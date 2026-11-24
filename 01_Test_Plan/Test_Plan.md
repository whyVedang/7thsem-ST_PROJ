# Event management test plan

Person 1 (@whyVedang) checks that the organizer can configure a free, single-date event, keep it private in Draft, and make the same event and tickets available to guests after publication.

## Test setup

Use the [pinned release and fixture settings](../README.md). Begin with a working local organizer login, a fresh Demo event name and a signed-out guest window. Record the release, date, timezone, organizer ID and browser or API client used. Keep the Visibility fixture free of orders throughout the run.

## Execution order

| Cases | Fixture and action | What to compare |
| --- | --- | --- |
| EM-01–EM-04 | Create Demo in Draft. Try the blank name and invalid end time on separate forms. Open the draft as a guest. | Saved title, dates, validation and access from each session. |
| EM-05–EM-06 | Save and reopen the free tickets, then publish Demo. | Persisted quantities and order limits, organizer Live status and the guest ticket listing. |
| EM-07 | Edit Demo's description and refresh the guest page. | The updated text and ticket availability on the same event. |
| EM-08 | Switch Visibility from Live to Draft, then back to Live. | Guest access at all three points. Demo stays available for the handoff. |

Use the [eight case procedures](../02_Test_Case_Design/Test_Cases.md) to record the actual outcome, status and relevant screenshot or API observation for each case. Identify the method used: a server validation response establishes API behavior, while a disabled control or picker restriction needs a browser observation.

## Completion and handoff

Record Pass when the observed outcome meets the expectation, Fail for a mismatch, Blocked when a dependency prevents execution, and Not Run for an unattempted case. Link any failure to the steps and evidence needed to repeat it. Before handing over Demo, confirm its public link works and both ticket types retain their starting stock. Booking, order validation and attendee check-in belong to the next two workstreams.
