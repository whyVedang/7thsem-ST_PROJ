# Attendee check-in verification

**Role owner** — @atharvsgit. The reference checks below were executed with Codex assistance.

**Environment** — Hi.Events v2.2.0, local Docker stack, on 25 November 2026, 11:24 IST. The [API run](Functional_Run.json) used fresh fixtures with one confirmed General Admission attendee named Alex Portfolio and a separate Workshop Pass. A separate automated Chrome smoke test captured the browser's Check in and Check out states.

| Case | Expected behavior | Actual result | Status | Evidence |
|---|---|---|---|---|
| CI-01 Create a restricted door list | The staff view opens for the correct list with exactly one eligible attendee from BK-02. Progress is 0/1. | Main Door accepted General Admission and reported 0/1. | Pass | Live API result |
| CI-02 Find the booked attendee | Alex Portfolio appears with the expected General Admission ticket. The row is pending before check-in. | Search returned the same single attendee from the booking. | Pass | Live API result |
| CI-03 Search for an unknown attendee | No matching attendee is shown. The door count remains 0/1. | Unknown name returned no matches and door count stayed 0/1. | Pass | Live API result |
| CI-04 Check in the attendee | The action changes to Check out and the progress changes from 0/1 to 1/1. That state persists. | One check-in was recorded, and a separate stats request showed 1/1. | Pass | [Browser screenshot](../07_Screenshots/CI-04-check-in-progress.png) |
| CI-05 Repeat the same check-in | The direct repeat returns the existing record with an already-checked-in message. The count stays 1/1 and the manual row offers Check out. | The API reported already checked in and returned the original record; count stayed 1/1. | Pass | Live API result |
| CI-06 Undo the check-in | Progress returns to 0/1 and the row offers Check in again. Postman C06–C07 verify this separately. | Undo returned HTTP 204 and the separate stats request returned to 0/1. | Pass | [Browser screenshot](../07_Screenshots/CI-06-check-out-progress.png) |
| CI-07 Exclude a different ticket type | Alex does not appear in Workshop Door results. Workshop Door shows zero eligible attendees. | Workshop-only list returned zero eligible attendees and no matching Alex. | Pass | Live API result |
| CI-08 Verify the stats view | Stats shows 1 checked in out of 1 eligible attendee, matching Search. The latest check-in is for the sample attendee. | Stats showed 1/1 and Alex as most recent; reset restored 0/1. | Pass | Live API result |

**Totals** — Eight API cases passed, zero failed and zero were blocked. CI-04 and CI-06 have separate browser evidence. The screenshots mask the attendee identifier.

## Viva handoff

After Person 2 books a General Admission ticket, open the same event in the organizer dashboard. Under **Guest Management**, choose **Check-In Lists**, then **Open Check-In** on QA Main Door. Use **Search** to find Alex Portfolio. Show the count move from 0/1 to 1/1 and back to 0/1 with **Check in** and **Check out**.

The staff page uses the booking from the same local Hi.Events instance. Create a new free booking on that instance if the booking and check-in roles rehearsed on different computers.
