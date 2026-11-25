# Reference Postman automation run

Verified on 23 November 2026 with Newman 6.2.1 against the local Docker release image `daveearley/hi.events-all-in-one:v2.2.0`. The collection was run twice, creating a fresh event each time.

| Run | Requests | Assertions | Failures |
|---|---:|---:|---:|
| First run | 20 | 38 | 0 |
| Repeat run | 20 | 38 | 0 |

This reference covers API automation. Record your own manual outcomes and submission run separately.

| Request | Passed assertions in both runs |
|---|---|
| A01 Create an isolated draft event | HTTP 200 / A draft with the run title was created |
| A02 Guest cannot open the draft | HTTP 404 |
| A03 Read the default product category | HTTP 200 / The event has a default product category |
| A04 Create a free ticket | HTTP 201 / General Admission was created |
| A05 Verify the saved price quota and limits | HTTP 200 / Free ticket has five available and a one-to-two order limit |
| A06 Publish the event | HTTP 200 / Organizer sees LIVE |
| A07 Guest can open the live event | HTTP 200 / Public response shows the same live event |
| B01 Reject a zero-ticket order | HTTP 422 / Validation rejected the empty selection |
| B02 Reject three tickets when the order limit is two | HTTP 422 / The per-order maximum was enforced |
| B03 Reserve one ticket | HTTP 201 / Reservation is RESERVED and has a checkout session |
| B04 Complete the free order | HTTP 200 / Order transitioned to COMPLETED and total is zero |
| B05 Fetch confirmation and attendee | HTTP 200 / Same order is completed with one active attendee |
| B06 Confirm one ticket was counted as sold | HTTP 200 / The five-ticket price now has one sale |
| C01 Create a list for General Admission | HTTP 200 / The named list has a staff link identifier |
| C02 Verify initial door count | HTTP 200 / Door count is 0/1 |
| C03 Check in the attendee | HTTP 200 / Exactly one check-in was recorded |
| C04 Repeat the scan | HTTP 200 / Existing check-in is returned and the duplicate is reported |
| C05 Verify duplicate did not change the count | HTTP 200 / Door count is 1/1 |
| C06 Undo the check-in | HTTP 204 |
| C07 Verify the attendee is pending again | HTTP 200 / Door count is 0/1 |

## Integration rerun

On 25 November 2026 IST, the same collection ran against Hi.Events v2.2.0 on the local Docker stack. All 20 requests and 38 assertions passed.
