# Hi.Events test execution summary

**Target** — Hi.Events v2.2.0, source commit `6ec8a7915d9e4eb00c12475849ec2e481760226a`.

| Workstream | API cases passed | Role verification |
|---|---:|---|
| Person 1 — Event management | 8 of 8 | [Event management and browser evidence](../03_Test_Execution/Event_Management_Verification.md) |
| Person 2 — Ticket booking | 8 of 8 | [Booking and browser evidence](../03_Test_Execution/Ticket_Booking_Verification.md) |
| Person 3 — Attendee check-in | 8 of 8 | [Check-in and browser evidence](../03_Test_Execution/Attendee_Check_In_Verification.md) |

The role records describe each person's reference runs and browser evidence. A fresh team integration run on 25 November 2026 IST also passed [24 of 24 API checks](../03_Test_Execution/Functional_Run.json).

- **Black-box browser smoke** — The local workflow reached the guest event page, completed a free booking, and changed the attendee count to 1/1 and back to 0/1.
- **White-box** — [10 of 10 PHP checks](White_Box_Run.txt) passed on check-in-list scheduling and whether payment is required.
- **Automation** — The Postman integration rerun recorded [20 requests and 38 assertions](Reference_Automation_Run.md), all passing. These requests overlap with the functional checks.
- **Defects** — The recorded runs reported no unexpected failures. Live payment processing and real email delivery were outside the free-event scope.

The [testing methods report](Testing_Methods.md) explains what makes each type of testing distinct and what to show in the viva.
