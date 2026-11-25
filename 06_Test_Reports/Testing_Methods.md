# Four testing methods

**System under test** — Hi.Events v2.2.0 at source commit `6ec8a7915d9e4eb00c12475849ec2e481760226a`.

| Required method | What was tested | Evidence |
|---|---|---|
| Black-box browser testing | Opened the published event as a guest, completed a free booking in Chrome, checked in the attendee, and undid the check-in. These checks were based on the visible inputs and results. | [Event management](../03_Test_Execution/Event_Management_Verification.md) · [Booking](../03_Test_Execution/Ticket_Booking_Verification.md) · [Check-in](../03_Test_Execution/Attendee_Check_In_Verification.md) |
| White-box unit testing | Selected inputs from the internal PHP conditions for check-in-list activation, check-in-list expiration, and payment requirement. Called the real application methods directly with a fixed clock. | [White-box cases and results](#white-box-cases-and-results) and [PHP test script](../05_Test_Automation/white-box-suite.php) |
| API testing | Checked HTTP responses and saved state across event management, ticket booking and attendee check-in. All 24 functional checks passed. | [Functional run results](../03_Test_Execution/Functional_Run.json) |
| Automation testing | Ran the Node functional suite, the Postman collection via Newman, and the PHP unit suite. The Postman reference run recorded 20 requests and 38 assertions passing in each of two runs. | [Functional script](../05_Test_Automation/functional-suite.mjs) and [Postman results](Reference_Automation_Run.md) |

A test can be both API-based and automated. The results report counts for each run separately.

## White-box cases and results

**Run date** — 25 November 2026. The script loaded the real application classes through Composer in the pinned Hi.Events release image. It ran in an isolated container with networking disabled. All **10 of 10 checks passed**. See the [captured run output](White_Box_Run.txt).

The test fixes the clock at 12:00:00 IST. `isActivated()` returns true without an activation timestamp. With a timestamp, it tests whether the timestamp is strictly in the past. `isExpired()` returns false without an expiry timestamp, then uses the same strict comparison when a timestamp exists. `isPaymentRequired()` checks whether the rounded-up gross total is positive.

| Case | Internal method | Input | Expected | Actual |
|---|---|---|---|---|
| WB-01 | `isActivated()` | No activation timestamp | true | true |
| WB-02 | `isActivated()` | 12:00:01 | false | false |
| WB-03 | `isActivated()` | Exactly 12:00:00 | false | false |
| WB-04 | `isActivated()` | 11:59:59 | true | true |
| WB-05 | `isExpired()` | No expiry timestamp | false | false |
| WB-06 | `isExpired()` | 12:00:01 | false | false |
| WB-07 | `isExpired()` | Exactly 12:00:00 | false | false |
| WB-08 | `isExpired()` | 11:59:59 | true | true |
| WB-09 | `isPaymentRequired()` | Gross total 0.00 | false | false |
| WB-10 | `isPaymentRequired()` | Gross total 0.01 | true | true |

The cases exercise the null and timestamp paths and both outcomes of the time comparison for each check-in method. The payment tests exercise both outcomes of the gross-total decision.

Source under test. [Check-in list decisions](https://github.com/HiEventsDev/Hi.Events/blob/v2.2.0/backend/app/DomainObjects/CheckInListDomainObject.php#L94-L114) · [Order payment decision](https://github.com/HiEventsDev/Hi.Events/blob/v2.2.0/backend/app/DomainObjects/OrderDomainObject.php#L200-L203)

## Run or demonstrate

From the portfolio root with Docker running:

```bash
docker run --rm --network none -i --entrypoint php daveearley/hi.events-all-in-one:v2.2.0 < 05_Test_Automation/white-box-suite.php
```

PowerShell equivalent:

```powershell
Get-Content -Raw 05_Test_Automation/white-box-suite.php | docker run --rm --network none -i --entrypoint php daveearley/hi.events-all-in-one:v2.2.0
```

For the viva, finish the browser flow first. In Antigravity, open `CheckInListDomainObject.php` under the Hi.Events source and show the default and timestamp paths of `isActivated()`. Run the command above and point to WB-01, WB-02 and WB-04, then show the 10/10 total. Open the API execution log and the Newman summary for the other two categories.
