# Attendee check-in test cases

Use the local Hi.Events v2.2.0 Demo event with one confirmed General Admission attendee and a separate Workshop Pass product. The API suite creates its own fixtures. For a browser walkthrough, use QA Main Door and keep the attendee pending before the first check-in.

## CI-01 Create a restricted door list

**Technique** — Positive workflow

**Steps and data** — On Demo, open Check-in Lists and create QA Main Door. Select General Admission only and leave activation and expiry empty. Open the staff link in a guest window and switch to Search.

**Expected result** — The staff view opens for the correct list with exactly one eligible attendee from BK-02. Progress is 0/1.

**Evidence** — List product selection and initial progress.

## CI-02 Find the booked attendee

**Technique** — Equivalence partitioning

**Steps and data** — In the Main Door Search tab enter Portfolio, then open the row for Alex Portfolio. Compare the name and ticket type with the booking evidence.

**Expected result** — Alex Portfolio appears with the expected General Admission ticket. The row is pending before check-in.

**Evidence** — Matching attendee with Check in available.

## CI-03 Search for an unknown attendee

**Technique** — Equivalence partitioning

**Steps and data** — Clear Search and enter NoSuchGuest529. Wait for results and leave the actual attendee unchanged.

**Expected result** — No matching attendee is shown. The door count remains 0/1.

**Evidence** — Empty search result and unchanged progress.

## CI-04 Check in the attendee

**Technique** — State transition

**Steps and data** — Search for Alex Portfolio in QA Main Door and press Check in. Reopen the list or refresh to verify persistence.

**Expected result** — The action changes to Check out and the progress changes from 0/1 to 1/1. That state persists.

**Evidence** — Checked-in row and 1/1 progress.

## CI-05 Repeat the same check-in

**Technique** — State transition and duplicate handling

**Steps and data** — With the attendee already checked in, run Postman C03–C05 as part of the full collection on its own event. In the manual Demo list, search again and inspect the available action.

**Expected result** — The direct repeat returns the existing record with an already-checked-in message. The count stays 1/1 and the manual row offers Check out.

**Evidence** — Postman C04/C05 and the manual checked-in row.

## CI-06 Undo the check-in

**Technique** — State transition

**Steps and data** — In the manual Demo list, search Alex Portfolio and press Check out. Confirm if prompted and refresh.

**Expected result** — Progress returns to 0/1 and the row offers Check in again. Postman C06–C07 verify this separately.

**Evidence** — Pending row and 0/1 progress after undo.

## CI-07 Exclude a different ticket type

**Technique** — Decision table

**Steps and data** — Create QA Workshop Door on Demo with only Workshop Pass selected. Open this second staff link and search for Alex Portfolio, who holds General Admission only.

**Expected result** — Alex does not appear in Workshop Door results. Workshop Door shows zero eligible attendees.

**Evidence** — Second list settings and empty search for Alex.

## CI-08 Verify the stats view

**Technique** — Cross-view consistency

**Steps and data** — Return to QA Main Door, check Alex in again, then open Stats. Compare the total and checked-in values with Search. Check Alex out before a fresh viva demonstration.

**Expected result** — Stats shows 1 checked in out of 1 eligible attendee, matching Search. The latest check-in is for the sample attendee.

**Evidence** — Stats view and matching check-in progress.
