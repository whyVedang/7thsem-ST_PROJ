# Ticket booking verification

**Target:** Hi.Events v2.2.0 at commit `6ec8a7915d9e4eb00c12475849ec2e481760226a`

**Execution date:** 24 November 2026 UTC / 25 November 2026 IST
**Execution credit:** Copilot-assisted local execution. This is not an unaided student run. The earlier assisted run in the supplied reference materials remains reference-only and is not included in these totals.

## Environment and method

The local Hi.Events v2.2.0 stack ran on `http://localhost:8123` using the shared `hieventsportfolioqa` Compose project and a fictional Campus QA Lab organizer (ID 1). The supplied `functional-suite.mjs` ran against a fresh API fixture set with Node.js v24.11.1 at `2026-11-24T18:35:07.686Z`. All eight BK API assertions passed; the machine-readable BK-only results are in [BK_Functional_Run.json](BK_Functional_Run.json).

Signed-out public browser checks were completed on separately created fresh fixtures with five free General Admission tickets, quantity display enabled, and a per-order limit of 1–2. The browser sequence followed the handoff: BK-02 Demo; BK-01 and BK-04 on untouched Limits; BK-03, BK-07 and BK-08 on Limits; then BK-05 and BK-06 on Validation. Each guest fixture was opened in a fresh browser page and returned HTTP 401 for the authenticated-user check. The supplied API suite has its own execution order; it is recorded as executed, not represented as the browser sequence.

The browser evidence fixtures were `Campus Tech Fest BK Signed-out Demo`, `Limits`, and `Validation` (local event IDs 8, 9 and 10), all scheduled for 2 December 2026, 18:00–20:00 UTC. IDs and localhost links are specific to this machine's local database.

## Case results

| Case | Expected result | Actual result | Status and method | Evidence |
| --- | --- | --- | --- | --- |
| BK-01 | Zero tickets cannot proceed; API rejects the request with HTTP 422. | The signed-out guest page stayed at quantity 0 and disabled Continue. The API returned HTTP 422 for zero selected tickets. | **Pass** — browser + API | [Zero selection](../07_Screenshots/BK-01-zero-selection.png); [API record](BK_Functional_Run.json) |
| BK-02 | One free order completes and a fresh visit shows 4 of 5 remaining. | Alex Portfolio completed a free General Admission order in the browser. The fresh guest page showed 4 available; API inventory was 1 sold of 5. | **Pass** — browser + API | [Confirmation (redacted)](../07_Screenshots/BK-02-free-order-confirmation.png); [4 remaining](../07_Screenshots/BK-02-stock-four.png) |
| BK-03 | One order for two tickets completes; 3 of 5 remain. | The guest completed a two-ticket Limits order. A fresh public view showed 3 available; API assertions confirmed two sold. | **Pass** — browser + API | [Two-ticket order](../07_Screenshots/BK-03-two-ticket-order.png); [3 remaining](../07_Screenshots/BK-03-stock-three.png); [API record](BK_Functional_Run.json) |
| BK-04 | Guest control caps at 2; API rejects 3 with HTTP 422. | Increase was disabled at quantity 2 while 5 were available. The API returned HTTP 422 and identified the maximum of 2. | **Pass** — browser + API | [Quantity limit](../07_Screenshots/BK-04-quantity-limit.png); [API record](BK_Functional_Run.json) |
| BK-05 | Mismatched emails keep checkout incomplete; correcting the field clears the error. | The browser displayed “Email addresses do not match” and kept checkout open. Correcting the confirmation cleared the message, after which the order completed. API returned HTTP 422 for the mismatch and left that invalid order Reserved. | **Pass** — browser + API | [Mismatch validation (redacted)](../07_Screenshots/BK-05-email-mismatch.png); [API record](BK_Functional_Run.json) |
| BK-06 | Missing First Name blocks checkout; correcting it clears the field error. | The browser displayed “First name is required” and kept checkout open. The request returned HTTP 422; entering a first name cleared the error and allowed the corrected order to complete. The API invalid order remained Reserved. | **Pass** — browser + API | [Required-name validation (redacted)](../07_Screenshots/BK-06-missing-first-name.png); [API record](BK_Functional_Run.json) |
| BK-07 | Stock moves 3 → 1 → 0; final one-ticket order completes and event shows sold out. | The browser Limits fixture moved 5 → 3 after BK-03, then 3 → 1 after another two-ticket order and 1 → 0 after the final one-ticket order. The fresh page showed Sold Out; API reported sold out. | **Pass** — browser + API | [Two more tickets](../07_Screenshots/BK-07-two-tickets-issued.png); [One remaining](../07_Screenshots/BK-07-one-remaining.png); [Sold out](../07_Screenshots/BK-07-sold-out.png); [API record](BK_Functional_Run.json) |
| BK-08 | No additional ticket is selectable and completed sales remain five. | The sold-out guest page had no quantity control and disabled Continue. The API returned HTTP 422 for another reservation and confirmed sold quantity remained 5. | **Pass** — browser + API | [Sold-out guest view](../07_Screenshots/BK-07-sold-out.png); [API record](BK_Functional_Run.json) |

**Totals:** 8 passed, 0 failed, 0 blocked in the API suite; all 8 cases were also observed in the signed-out browser. Evidence screenshots redact guest email addresses and order references; checkout session URLs and API credentials were not committed.

## Person 3 handoff

On the machine running this test database, use the browser Demo event **Campus Tech Fest BK Signed-out Demo** at [the public event page](http://localhost:8123/event/8/campus-tech-fest-bk-signed-out-demo). It has a confirmed **Alex Portfolio — General Admission** attendee from BK-02; the fresh public view shows four of five tickets remaining. Person 3 can sign in to the local Campus QA Lab organizer and create a check-in list for this event.

The localhost event and attendee exist only in this machine's Hi.Events database. For another stack, start the shared Compose project on port 8123, create the Campus QA Lab organizer and a Live Demo event with five free General Admission tickets (min 1, max 2, quantity display on), then complete one guest order as Alex Portfolio before running check-in. Do not copy the local order/session URL into shared materials.

## Viva cue

Show the redacted free-order confirmation and the fresh four-remaining guest view. On Limits, show that 0 cannot proceed, 1 can be selected, 2 is the maximum, and a third ticket is not available; then show the final sold-out state. Explain that each completed free ticket consumes one of the five available tickets.
