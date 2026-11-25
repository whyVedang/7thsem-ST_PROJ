# Event management verification

**Role owner:** @whyVedang. Codex ran the checks for this branch on 24 November 2026. All eight event-management API checks passed on a fresh local Hi.Events v2.2.0 instance. The browser observations below came from automated Chrome sessions, with separate organizer and signed-out guest contexts.

The API run finished at 23:05 IST using Node.js 22.22.1. Chrome 141.0.7390.108 ran the browser checks. The organizer was Campus QA Lab (ID 1). The Demo event was scheduled for 1 December 2026, 18:00–20:00 UTC. The [API results](Event_Management_Run.json) contain the individual assertions' outcomes.

| Case | Observed outcome | Browser evidence from this branch |
| --- | --- | --- |
| EM-01 | The API created Demo in Draft. Submitting a separate Browser Draft through the organizer form opened its draft dashboard. Its saved title and both timestamps matched the inputs. | [New draft dashboard](../07_Screenshots/EM-01-created-draft.png) |
| EM-02 | A blank title returned HTTP 422. The browser kept the form open and displayed “Give your event a name.” | [Name validation](../07_Screenshots/EM-02-blank-name.png) |
| EM-03 | With an 18:00 start and 17:59 end on the same day, the API returned HTTP 422. The form displayed “End date must be after start date.” | [End-time validation](../07_Screenshots/EM-03-invalid-end.png) |
| EM-04 | Draft Demo returned HTTP 200 to the organizer and 404 to the guest API request. On the separate Visibility fixture, the owner retained dashboard access in Draft while the signed-out browser showed “Event Not Available.” | [Organizer](../07_Screenshots/EM-04-owner-draft.png) · [Guest](../07_Screenshots/EM-04-draft-guest.png) |
| EM-05 | Reading the saved General Admission ticket back through the API confirmed Free, capacity 5 and limits 1–2. The second free ticket had capacity 3. The organizer's ticket list showed zero sold for each. | [Saved ticket list](../07_Screenshots/EM-05-organizer-tickets.png) |
| EM-06 | Publishing Demo changed its status to Live. The guest API returned HTTP 200. Chrome showed the matching event, date, times and both free tickets. | [Published Demo](../07_Screenshots/EM-06-live-guest.png) |
| EM-07 | After the API saved “Student QA demo event.” on Demo, the guest response showed the updated description and General Admission remained available. Chrome displayed the same text under About. | [Description and tickets](../07_Screenshots/EM-06-live-guest.png) |
| EM-08 | On the order-free Visibility fixture, the guest API returned 200 → 404 → 200 across Live → Draft → Live. Chrome showed the ticket before unpublishing, the unavailable page in Draft and the ticket again after republishing. | [Draft](../07_Screenshots/EM-04-draft-guest.png) · [Restored guest view](../07_Screenshots/EM-08-restored-guest.png) |

## Supplemental browser evidence

A fresh Chrome rerun on local Hi.Events v2.2.0 on 25 November 2026 used a separate visibility event with five free General Admission tickets.

| Case | Evidence from the rerun |
| --- | --- |
| EM-05 | [Saved minimum of 1 and maximum of 2 per order](../07_Screenshots/EM-05-order-limits.png) |
| EM-08 | The same signed-out guest view showed [the live event and its ticket](../07_Screenshots/EM-08-initial-live-guest.png), [the unavailable page after unpublishing](../07_Screenshots/EM-08-unpublished-guest.png), and [the event and ticket again after republishing](../07_Screenshots/EM-08-republished-guest.png). |

The first and last captures are identical because republishing restored the same guest view.

## Local handoff

On the machine running this stack, Person 2 can open [Demo](http://localhost:8123/event/1/campus-tech-fest-demo), [Limits](http://localhost:8123/event/3/campus-tech-fest-limits) and [Validation](http://localhost:8123/event/4/campus-tech-fest-validation). Person 3 can use the [Demo organizer dashboard](http://localhost:8123/manage/event/1/dashboard) after signing in. At handoff the Demo guest page showed five General Admission and three Workshop Pass tickets available, both free. The [Visibility scratch event](http://localhost:8123/event/2/campus-tech-fest-visibility) was restored to Live.

## Viva and supplied reference evidence

Open the organizer and guest Draft screenshots side by side. Then show the published Demo, its two free tickets and the saved description. Use a signed-out window so the organizer session cannot affect the guest check.

The supplied [event management viva guide](../08_Viva_Handouts/Event_Management_Viva_Guide.pdf) and [original published-event screenshot](../07_Screenshots/EM-06-published-event.png) belong to the team's earlier assisted reference run at 16:08 IST.
