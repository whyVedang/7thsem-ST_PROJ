# Run the automated tests

Start the local Hi.Events v2.2.0 app on port 8123. Create a short-lived read/write key in **Settings → API Keys** and get your organizer ID from its dashboard URL. Keep the key in your local environment.

## Node functional suite

Use Node.js 22 or later. Set `HIEVENTS_API_KEY` and `HIEVENTS_ORGANIZER_ID` in the shell, then run this from the portfolio root.

```bash
node 05_Test_Automation/functional-suite.mjs functional-run
```

Each run creates its own fixtures and writes a sanitized result file to `functional-run/Functional_Run.json`.

## Postman collection

Import the collection and the blank local Postman environment. Privately set `api_key` and `organizer_id` in your environment. Use `http://localhost:8123/api` for `api_base`. Run all three folders together so they can pass the fresh event, order and attendee IDs between requests.

## PHP white-box suite

Run the [white-box command](../06_Test_Reports/Testing_Methods.md#run-or-demonstrate) with Docker. It uses the Hi.Events release image and exercises the real application methods without starting a web server.
