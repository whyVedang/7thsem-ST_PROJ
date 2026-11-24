# 7thsem-ST_PROJ

## Hi.Events software testing portfolio

Person 1 (@whyVedang) prepares the events for the team and checks what an organizer and a signed-out guest can see before and after publication. The system under test is Hi.Events v2.2.0 at commit `6ec8a7915d9e4eb00c12475849ec2e481760226a`.

Read the [test plan](01_Test_Plan/Test_Plan.md) and [eight event-management cases](02_Test_Case_Design/Test_Cases.md). The [verification record](03_Test_Execution/Event_Management_Verification.md) contains the results, browser evidence and local handoff links.

### Start the local test app

Start Docker with Compose v2.24.4 or later. From this portfolio's root, run the following in PowerShell to create a separate application checkout alongside the portfolio.

```powershell
git clone --branch v2.2.0 --depth 1 https://github.com/HiEventsDev/Hi.Events.git ../Hi.Events
Copy-Item compose.portfolio.yml ../Hi.Events/docker/all-in-one/
Set-Location ../Hi.Events/docker/all-in-one
Copy-Item .env.example .env
```

On first setup, fill the two empty entries in the local `.env` file. Generate a separate value for each using the [upstream key instructions](https://github.com/HiEventsDev/Hi.Events/blob/v2.2.0/docker/all-in-one/README.md#step-3-generate-the-app_key-and-jwt_secret). Keep the default log mailer. From the same directory, start the stack.

```powershell
docker compose -p hieventsportfolioqa -f docker-compose.yml -f compose.portfolio.yml up -d
docker compose -p hieventsportfolioqa -f docker-compose.yml -f compose.portfolio.yml ps
```

Open [local registration](http://localhost:8123/auth/register), create a fictional owner and an organizer named **Campus QA Lab**. Use the owner's normal browser window for setup and a separate private window for guest checks. To pause the stack and keep its test data, use the same Compose command with `stop` in place of `up -d`.

### Prepare the team fixtures

Prefix each event name with **Campus Tech Fest -**. Choose a single date seven days ahead, 18:00–20:00, and record the timezone. Use USD and English. Set General Admission to Free, with five tickets and a limit of one to two per order. Show the remaining quantity, keep sold-out tickets visible, leave sales open, and use the default registration questions.

| Event suffix | Starting state and purpose |
| --- | --- |
| Demo | Start in Draft. Add a free Workshop Pass with capacity three. Publish after the draft checks, then hand over with all five General Admission and three Workshop tickets available. |
| Limits | Publish with five General Admission tickets for the booking boundary cases. |
| Visibility | Use a separate live event with zero orders for the unpublish and republish check. |
| Validation | Publish with free stock for buyer-input checks so abandoned reservations leave the other fixtures available. |

Give Person 2 the Demo, Limits and Validation guest links and saved ticket settings. Give Person 3 the Demo organizer link and both product names. These localhost links work on the computer running the stack.
