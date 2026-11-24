# Event management manual test cases

### EM-01 Create a draft

**Technique** — Positive workflow

**Steps and data** — Sign in as the owner. Open Events > Create Event. Enter Campus Tech Fest - Demo, choose a one-off event, set a start seven days ahead at 18:00 and end at 20:00, then create it.

**Expected result** — The event dashboard opens. The title and dates are correct and the event shows Draft.

**Evidence** — Dashboard with the Draft status.

### EM-02 Require an event name

**Technique** — Equivalence partitioning

**Steps and data** — Open a new event form with a valid future date. Leave the name blank and try to create it. Close the dialog after observing the result.

**Expected result** — The form prevents creation until a name is supplied. No extra event appears in Events.

**Evidence** — Required-field feedback or the disabled create control.

### EM-03 Check end-date validation

**Technique** — Boundary and negative input

**Steps and data** — On a fresh event form, set a valid name and a start at 18:00. Try to set the end at 17:59 on the same day. Keep this scratch form separate from the Demo event.

**Expected result** — The picker prevents the invalid end time or the form refuses to save it. A saved event cannot end before it starts.

**Evidence** — Date picker restriction or validation message.

### EM-04 Check guest access to a draft

**Technique** — State transition prerequisite

**Steps and data** — Copy the Demo event public link from its preview or share control. Paste it into an incognito window with no organizer session while the event is still Draft.

**Expected result** — The public ticket page is unavailable to the guest. The signed-in organizer can still manage the event.

**Evidence** — Guest page and owner Draft status.

### EM-05 Save the free ticket settings

**Technique** — Configuration persistence

**Steps and data** — On Demo, open Tickets & Products. Add General Admission as a free ticket. Set quantity to 5, minimum per order to 1, maximum to 2, and show remaining quantity. Save, then reopen it. Add Workshop Pass as a separate free ticket with quantity 3.

**Expected result** — The ticket keeps the name, Free type, quantity 5 and order limits 1–2 after reload.

**Evidence** — Saved ticket settings with the values visible.

### EM-06 Publish and check public details

**Technique** — State transition

**Steps and data** — Change Demo from Draft to Live with the status control. Confirm publication. Open its public link as a guest and compare the title, date and ticket details with the dashboard.

**Expected result** — The guest view opens, shows the same event, and presents General Admission as free. The owner sees Live.

**Evidence** — Owner Live status and matching guest ticket view.

### EM-07 Edit the event after publishing

**Technique** — Persistence across views

**Steps and data** — In Event Settings, change the public description to Student QA demo event. Save. Refresh the public event in the guest window and check the description.

**Expected result** — The saved text appears publicly for the same event, while the free ticket remains selectable.

**Evidence** — Updated guest description and ticket.

### EM-08 Unpublish and restore a scratch event

**Technique** — State transition

**Steps and data** — Use the separate visibility fixture with no orders. Open its Live link as a guest. As owner switch it to Draft, refresh the guest view, then republish and refresh again.

**Expected result** — The guest view is available, unavailable, then available again as the event moves Live → Draft → Live.

**Evidence** — Three timestamped views or a short recording.
