import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = process.env.HIEVENTS_API_BASE || 'http://localhost:8123/api';
const apiKey = process.env.HIEVENTS_API_KEY;
const organizerId = Number(process.env.HIEVENTS_ORGANIZER_ID);
const out = process.argv[2] || 'functional-run';
assert.match(base, /^http:\/\/(localhost|127\.0\.0\.1):\d+\/api$/);
assert.ok(apiKey?.startsWith('hie_'), 'Set HIEVENTS_API_KEY to a local read/write key');
assert.ok(Number.isInteger(organizerId) && organizerId > 0, 'Set HIEVENTS_ORGANIZER_ID');

const run = randomBytes(4).toString('hex');
const date = new Date(Date.now() + 7 * 86400000);
date.setUTCHours(18, 0, 0, 0);
const start = date.toISOString();
const end = new Date(+date + 2 * 3600000).toISOString();
const eventSpec = {
  title: 'Campus Tech Fest QA ' + run, type: 'SINGLE', organizer_id: organizerId,
  start_date: start, end_date: end, category: 'MUSIC', currency: 'USD', timezone: 'UTC',
};
const rows = [];
let demo, general, workshop, limits, limitTicket, validation, validationTicket, demoOrder, door, attendee, checkIn;
let orderNumber = 0;

async function api(method, path, expected, { body, guest = path.startsWith('/public/') } = {}) {
  const headers = { Accept: 'application/json', 'Accept-Language': 'en' };
  if (!guest) headers.Authorization = 'Bearer ' + apiKey;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(base + path, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
    redirect: 'error', signal: AbortSignal.timeout(15000),
  });
  const json = await response.json().catch(() => ({}));
  if (expected !== null) {
    assert.ok([expected].flat().includes(response.status),
      `Expected HTTP ${expected}, got ${response.status}` +
      (json.errors ? ' (fields: ' + Object.keys(json.errors).join(', ') + ')' : ''));
  }
  return { status: response.status, data: json.data, errors: json.errors };
}

function test(id, name, action) {
  return (async () => {
    try {
      const actual = await action();
      rows.push({ id, name, status: 'Pass', actual });
    } catch (error) {
      const status = error.message.startsWith('Missing prior fixture') ? 'Blocked' : 'Fail';
      rows.push({ id, name, status, actual: error.message.replaceAll(apiKey, '[redacted]') });
    }
  })();
}

function need(value, name) {
  assert.ok(value, 'Missing prior fixture: ' + name);
  return value;
}

const publicEvent = (event, expected = 200) => api('GET', '/public/events/' + event.id, expected);
const status = (event, value) => api('PUT', '/events/' + event.id + '/status', 200, { body: { status: value } });
async function event(label) {
  return (await api('POST', '/events', 200, { body: { ...eventSpec, title: eventSpec.title + ' ' + label } })).data;
}

async function product(event, title, capacity) {
  const category = (await api('GET', `/events/${event.id}/product-categories`, 200)).data[0];
  const created = (await api('POST', `/events/${event.id}/products`, 201, { body: {
    title, type: 'FREE', product_type: 'TICKET', product_category_id: category.id,
    min_per_order: 1, max_per_order: 2, show_quantity_remaining: true, hide_when_sold_out: false,
    prices: [{ price: 0, initial_quantity_available: capacity }],
  } })).data;
  return productRecord(event, created);
}

async function productRecord(event, product) {
  return (await api('GET', `/events/${event.id}/products/${product.id}`, 200)).data;
}

async function reserve(event, ticket, quantity, expected = 201) {
  return api('POST', `/public/events/${event.id}/order`, expected, { body: { products: [{
    product_id: ticket.id, quantities: [{ price_id: ticket.prices[0].id, quantity }],
  }] } });
}

function orderUrl(event, order) {
  return `/public/events/${event.id}/order/${order.short_id}?session_identifier=${encodeURIComponent(order.session_identifier)}`;
}

async function complete(event, ticket, order, quantity, changes = {}, expected = 200) {
  const email = `alex-${run}-${++orderNumber}@example.com`;
  const person = { first_name: 'Alex', last_name: 'Portfolio', email, email_confirmation: email };
  return api('PUT', orderUrl(event, order), expected, { body: {
    order: { ...person, ...changes },
    products: Array.from({ length: quantity }, () => ({
      ...person, product_id: ticket.id, product_price_id: ticket.prices[0].id,
    })),
  } });
}

async function book(event, ticket, quantity) {
  const reserved = (await reserve(event, ticket, quantity)).data;
  const completed = await complete(event, ticket, reserved, quantity);
  assert.equal(completed.data.status, 'COMPLETED');
  assert.equal(Number(completed.data.total_gross), 0);
  const confirmation = (await api('GET', orderUrl(event, reserved), 200)).data;
  assert.equal(confirmation.attendees.length, quantity);
  return confirmation;
}

async function inventory(event, ticket, sold) {
  const current = await productRecord(event, ticket);
  assert.equal(current.prices[0].quantity_sold, sold);
  return current.prices[0];
}

async function createList(product, name) {
  return (await api('POST', `/events/${demo.id}/check-in-lists`, 200, {
    body: { name, product_ids: [product.id] },
  })).data;
}

const doorRoute = (list) => '/public/check-in-lists/' + need(list, 'door list').short_id;
async function stats(list, eligible, checked) {
  const { data } = await api('GET', doorRoute(list) + '/stats', 200);
  assert.equal(data.total_attendees, eligible);
  assert.equal(data.checked_in_attendees, checked);
  return data;
}
async function search(list, query) {
  return (await api('GET', doorRoute(list) + '/attendees?query=' + encodeURIComponent(query), 200)).data;
}
async function scan() {
  return api('POST', doorRoute(door) + '/check-ins', 200, {
    body: { attendees: [{ public_id: need(attendee, 'demo attendee').public_id, action: 'check-in' }] },
  });
}
async function undo(check) {
  return api('DELETE', doorRoute(door) + '/check-ins/' + need(check, 'check-in record').short_id, 204);
}

await test('EM-01', 'Create a draft', async () => {
  demo = await event('Demo');
  assert.equal(demo.status, 'DRAFT');
  assert.equal(demo.title, eventSpec.title + ' Demo');
  assert.match(demo.start_date, /18:00:00/);
  assert.match(demo.end_date, /20:00:00/);
  return 'HTTP 200 created the requested Draft with the 18:00 and 20:00 dates.';
});
await test('EM-02', 'Require event name', async () => {
  const result = await api('POST', '/events', 422, { body: { ...eventSpec, title: '' } });
  assert.ok(result.errors?.title?.length);
  return 'HTTP 422 returned title validation for the blank name.';
});
await test('EM-03', 'Reject an end before start', async () => {
  const result = await api('POST', '/events', 422, {
    body: { ...eventSpec, end_date: new Date(+date - 60000).toISOString() },
  });
  assert.ok(result.errors?.start_date?.length || result.errors?.end_date?.length);
  return 'HTTP 422 rejected the 17:59 end with an 18:00 start.';
});
await test('EM-04', 'Hide draft from guests', async () => {
  await publicEvent(need(demo, 'draft'), 404);
  const owner = await api('GET', '/events/' + demo.id, 200);
  assert.equal(owner.data.status, 'DRAFT');
  return 'Guest received HTTP 404 while the organizer received HTTP 200 with Draft.';
});
await test('EM-05', 'Save free ticket settings', async () => {
  general = await product(need(demo, 'draft'), 'General Admission', 5);
  workshop = await product(demo, 'Workshop Pass', 3);
  assert.equal(general.type, 'FREE');
  assert.equal(general.prices[0].initial_quantity_available, 5);
  assert.equal(general.min_per_order, 1);
  assert.equal(general.max_per_order, 2);
  assert.equal(workshop.prices[0].initial_quantity_available, 3);
  return 'A fresh authenticated GET confirmed FREE, quantity 5, limits 1–2 and Workshop quantity 3.';
});
await test('EM-06', 'Publish and read public event', async () => {
  assert.equal((await status(need(demo, 'draft'), 'LIVE')).data.status, 'LIVE');
  const { data } = await publicEvent(demo);
  assert.equal(data.title, demo.title);
  assert.equal(data.status, 'LIVE');
  assert.ok(data.product_categories.flatMap(x => x.products).some(x => x.title === 'General Admission' && x.type === 'FREE'));
  return 'Published Live; guest HTTP 200 included the matching title and Free ticket.';
});
await test('EM-07', 'Edit live event description', async () => {
  const description = '<p>Student QA demo event.</p>';
  await api('PUT', '/events/' + need(demo, 'live event').id, 200, { body: { ...eventSpec, title: demo.title, description } });
  const { data } = await publicEvent(demo);
  assert.match(data.description, /Student QA demo event/);
  assert.ok(data.product_categories.flatMap(x => x.products).some(x => x.id === general.id && x.is_available));
  return 'The updated description appeared publicly and General Admission remained available.';
});
await test('EM-08', 'Unpublish and republish', async () => {
  const visibility = await event('Visibility');
  await product(visibility, 'General Admission', 5);
  await status(visibility, 'LIVE');
  await publicEvent(visibility, 200);
  await status(visibility, 'DRAFT');
  await publicEvent(visibility, 404);
  await status(visibility, 'LIVE');
  await publicEvent(visibility, 200);
  return 'Guest responses were HTTP 200 → 404 → 200 across Live → Draft → Live.';
});
await test('BK-01', 'Reject zero tickets', async () => {
  limits = await event('Limits');
  limitTicket = await product(limits, 'General Admission', 5);
  await status(limits, 'LIVE');
  const result = await reserve(limits, limitTicket, 0, 422);
  assert.ok(result.errors?.products?.length);
  return 'HTTP 422 rejected zero selected tickets.';
});
await test('BK-02', 'Book one free ticket', async () => {
  demoOrder = await book(need(demo, 'live Demo'), need(general, 'General Admission'), 1);
  const price = await inventory(demo, general, 1);
  attendee = demoOrder.attendees[0];
  return `One confirmed ticket at zero cost; ${price.initial_quantity_available - price.quantity_sold} remained from five.`;
});
await test('BK-04', 'Reject three tickets', async () => {
  const result = await reserve(need(limits, 'Limits'), need(limitTicket, 'Limits ticket'), 3, 422);
  assert.match(result.errors?.['products.0']?.join(' ') || '', /maximum.*2/i);
  return 'HTTP 422 identified the order maximum of 2 before stock was consumed.';
});
await test('BK-03', 'Book the two-ticket limit', async () => {
  await book(need(limits, 'Limits'), need(limitTicket, 'Limits ticket'), 2);
  await inventory(limits, limitTicket, 2);
  return 'One completed order held two tickets and three of five remained.';
});
await test('BK-05', 'Reject mismatched emails', async () => {
  validation = await event('Validation');
  validationTicket = await product(validation, 'General Admission', 5);
  await status(validation, 'LIVE');
  const order = (await reserve(validation, validationTicket, 1)).data;
  const result = await complete(validation, validationTicket, order, 1, { email_confirmation: 'different@example.com' }, 422);
  assert.ok(result.errors?.['order.email_confirmation']?.length);
  assert.equal((await api('GET', orderUrl(validation, order), 200)).data.status, 'RESERVED');
  return 'HTTP 422 reported the email confirmation mismatch; order remained Reserved.';
});
await test('BK-06', 'Require buyer first name', async () => {
  const order = (await reserve(need(validation, 'Validation'), validationTicket, 1)).data;
  const result = await complete(validation, validationTicket, order, 1, { first_name: '' }, 422);
  assert.ok(result.errors?.['order.first_name']?.length);
  assert.equal((await api('GET', orderUrl(validation, order), 200)).data.status, 'RESERVED');
  return 'HTTP 422 reported required first name; order remained Reserved.';
});
await test('BK-07', 'Consume the final ticket', async () => {
  await inventory(need(limits, 'Limits'), limitTicket, 2);
  await book(limits, limitTicket, 2);
  await inventory(limits, limitTicket, 4);
  await book(limits, limitTicket, 1);
  const price = await inventory(limits, limitTicket, 5);
  assert.equal(price.is_sold_out, true);
  return 'Remaining stock moved 3 → 1 → 0; the price reported sold out.';
});
await test('BK-08', 'Reject a sixth ticket', async () => {
  const result = await reserve(need(limits, 'Limits'), limitTicket, 1, 422);
  assert.ok(result.errors && Object.keys(result.errors).length);
  await inventory(limits, limitTicket, 5);
  return 'HTTP 422 refused a new reservation after sell-out; sold quantity remained 5.';
});
await test('CI-01', 'Create a restricted door list', async () => {
  door = await createList(need(general, 'General Admission'), 'QA Main Door');
  await stats(door, 1, 0);
  return 'Main Door accepted General Admission and reported 0/1.';
});
await test('CI-02', 'Find the booked attendee', async () => {
  const matches = await search(door, 'Portfolio');
  assert.equal(matches.length, 1);
  assert.equal(matches[0].public_id, need(attendee, 'demo attendee').public_id);
  return 'Search returned the same single attendee from the booking.';
});
await test('CI-03', 'Find no unknown attendee', async () => {
  assert.equal((await search(door, 'NoSuchGuest529')).length, 0);
  await stats(door, 1, 0);
  return 'Unknown name returned no matches and door count stayed 0/1.';
});
await test('CI-04', 'Check in once', async () => {
  const result = await scan();
  assert.equal(result.data.length, 1);
  checkIn = result.data[0];
  await stats(door, 1, 1);
  return 'One check-in was recorded, and a separate stats request showed 1/1.';
});
await test('CI-05', 'Repeat the same check-in', async () => {
  const result = await scan();
  assert.equal(result.data[0].short_id, need(checkIn, 'first check-in').short_id);
  assert.match(JSON.stringify(result.errors), /already checked in/i);
  await stats(door, 1, 1);
  return 'The API reported already checked in and returned the original record; count stayed 1/1.';
});
await test('CI-06', 'Undo check-in', async () => {
  await undo(checkIn);
  await stats(door, 1, 0);
  return 'Undo returned HTTP 204 and the separate stats request returned to 0/1.';
});
await test('CI-07', 'Exclude the wrong ticket type', async () => {
  const other = await createList(need(workshop, 'Workshop Pass'), 'QA Workshop Door');
  assert.equal((await search(other, 'Portfolio')).length, 0);
  await stats(other, 0, 0);
  return 'Workshop-only list returned zero eligible attendees and no matching Alex.';
});
await test('CI-08', 'Verify stats and latest check-in', async () => {
  const result = await scan();
  const info = await stats(door, 1, 1);
  assert.equal(info.recent_check_ins[0].attendee_public_id, attendee.public_id);
  await undo(result.data[0]);
  await stats(door, 1, 0);
  return 'Stats showed 1/1 and Alex as most recent; reset restored 0/1.';
});

await mkdir(out, { recursive: true });
await writeFile(join(out, 'Functional_Run.json'), JSON.stringify({
  target: 'Hi.Events v2.2.0', executedAt: new Date().toISOString(), method: 'Live local API',
  results: rows.sort((a, b) => a.id.localeCompare(b.id)),
}, null, 2) + '\n');
for (const row of rows) console.log(`${row.id} ${row.status}: ${row.actual}`);
if (rows.some(row => row.status !== 'Pass')) process.exitCode = 1;
