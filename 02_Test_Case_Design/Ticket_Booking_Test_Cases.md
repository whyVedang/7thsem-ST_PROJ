# Ticket booking test cases

Use the shared setup and fresh Demo, Limits and Validation fixtures. Keep guest checks signed out. Record browser and API observations separately in the [booking verification](../03_Test_Execution/Ticket_Booking_Verification.md).

## BK-01 Empty ticket selection

**Technique** — Boundary value 0

**Steps and data** — Open the Limits fixture as a guest. Keep every ticket quantity at 0 and try to continue. Run the functional suite's zero-selection API check before booking any Limits tickets.

**Expected result** — Checkout cannot proceed with zero tickets. The direct API request is rejected with HTTP 422.

**Evidence** — Disabled Continue control and API result.

## BK-02 Book one ticket

**Technique** — Boundary value 1 and positive workflow

**Steps and data** — Use the untouched Demo fixture. Select 1 General Admission. Enter Alex Portfolio and `alex-demo@example.com` in the buyer fields and matching email confirmation. Complete the order.

**Expected result** — A free order completes for one attendee. A fresh public visit shows 4 of 5 General Admission tickets remaining. Save the Demo event and attendee details for Person 3.

**Evidence** — Order confirmation and refreshed ticket availability.

## BK-03 Book at the per-order maximum

**Technique** — Boundary value 2

**Steps and data** — Use Limits with 5 tickets untouched. Select 2 General Admission tickets and complete the order as Jamie Limit (`jamie-03@example.com`) with a matching email confirmation.

**Expected result** — One order completes with two tickets. A fresh public view shows 3 General Admission tickets remaining.

**Evidence** — Two-ticket completion and remaining quantity.

## BK-04 Try to select three tickets

**Technique** — Boundary value max + 1

**Steps and data** — Before any completed Limits booking, try to select 3 General Admission tickets. Run the functional suite's direct API check for a quantity of 3.

**Expected result** — The guest control offers at most 2 tickets. The API rejects 3 with HTTP 422 for the per-order limit.

**Evidence** — Quantity control and API result.

## BK-05 Enter mismatched buyer emails

**Technique** — Decision table

**Steps and data** — On Validation, select 1 General Admission ticket. Use Casey Mismatch, `casey@example.com` as the email and `wrong@example.com` as confirmation. Submit, then correct the confirmation email and observe validation.

**Expected result** — A mismatch message appears and checkout stays incomplete. Correcting the confirmation clears the error; the corrected order can then complete.

**Evidence** — Email validation and incomplete checkout.

## BK-06 Leave a required field empty

**Technique** — Equivalence partitioning

**Steps and data** — In a fresh Validation guest session, select 1 General Admission ticket. Leave buyer First Name blank, enter Missing as Last Name, and use matching `missing@example.com` buyer emails. Submit, then correct First Name.

**Expected result** — First Name is marked required and checkout does not complete. Correcting the name clears the field error and the corrected order can complete.

**Evidence** — Required-field feedback and incomplete checkout.

## BK-07 Consume the last ticket

**Technique** — Inventory boundary

**Steps and data** — Continue Limits from BK-03 with 3 remaining. Book 2 as Morgan Limit (`morgan-04@example.com`), refresh to check stock, then book the final 1 as Taylor Limit (`taylor-05@example.com`) in a fresh guest session.

**Expected result** — Stock moves 3 → 1 → 0. Both orders complete and General Admission shows sold out after the final ticket.

**Evidence** — One remaining, final order and sold-out view.

## BK-08 Reject another order at zero stock

**Technique** — Sold-out partition

**Steps and data** — After BK-07, open Limits in a fresh guest session. Inspect the sold-out General Admission card and try to select another ticket. Confirm through the organizer/API result that completed sales remain five.

**Expected result** — General Admission is sold out with no selectable quantity. No sixth ticket is issued and completed sales remain five.

**Evidence** — Sold-out selection and API inventory result.
