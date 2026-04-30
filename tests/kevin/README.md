# Kevin Selenium Test Scripts

This folder contains Selenium + pytest scripts for Kevin's assigned frontend use cases.

## Current files

```text
kevin/
├── conftest.py
├── pytest.ini
├── README.md
├── test_contracts.py
├── test_chat_reviews.py
├── test_coach_application.py
├── test_predictions.py
└── test_workouts_calendar.py
```

## Currently implemented

| File | Use Case | Description | Status |
|---|---:|---|---|
| `test_contracts.py` | UC 3.3 | Client requests coaching and coach accepts the request | Working |
| `test_contracts.py` | UC 3.4 | Client requests contract termination through report coach flow | Working |
| `test_contracts.py` | UC 8.2 | Client switches to client view, opens coach profile, writes a review | Working |
| `test_chat_reviews.py` | UC 8.1 | Client sends coach a message, coach verifies and replies | Working |
| `test_coach_application.py` | UC 11.1 | New coach submits application, completes client onboarding, admin approves, then verifies in approved tab | Working |
| `test_predictions.py` | UC 8.4 | Goal prediction gambling full flow: bet, create markets, close/cancel, admin review/settle, final verification | Working |
| `test_workouts_calendar.py` | UC 4.2 | Client browses recommended workout plans, retakes preferences, and assigns a predefined plan | Working |
| `test_workouts_calendar.py` | UC 4.3 | Coach opens Manage Clients, selects Alex, and assigns a coach workout plan | Working |
| `test_workouts_calendar.py` | UC 4.4 | Client adds a workout session to today's calendar with an active time window | Working |
| `test_workouts_calendar.py` | UC 6.1 | Client starts/logs the scheduled workout activity, logs exercise/cardio, and edits logs | Working |

---

## Requirements

The application must be running before starting Selenium.

The frontend should be available at:

```text
http://localhost:5173
```

The backend should be available at:

```text
http://localhost:8080
```

These scripts are currently being run locally on Windows, outside WSL/Docker.

---

## Install Python dependencies

From this folder:

```bash
python -m pip install selenium pytest pytest-html python-dotenv
```

---

## Remove pytest marker warnings

If you see warnings like this:

```text
PytestUnknownMarkWarning: Unknown pytest.mark.kevin
```

create a file named:

```text
pytest.ini
```

in this same folder:

```text
C:\Users\black\OneDrive\Desktop\Selenium Testing\kevin
```

Paste this into `pytest.ini`:

```ini
[pytest]
markers =
    kevin: Kevin's assigned Selenium use case tests
    contracts: Contract and coach relationship tests
    review: Coach review tests
    chat: Chat and messaging tests
    application: Coach application and admin approval tests
    prediction: Goal prediction gambling tests
    workouts: Workout plan, workout calendar, and activity logging tests

addopts = -v -s
```

After this, the marker warnings should disappear.

---

## Run all implemented tests

```bash
python -m pytest test_contracts.py test_chat_reviews.py test_coach_application.py test_predictions.py test_workouts_calendar.py
```

Because `pytest.ini` includes:

```ini
addopts = -v -s
```

the tests automatically run with verbose output and print output enabled.

---

## Run tests by file

### Contract/review tests

```bash
python -m pytest test_contracts.py
```

### Chat tests

```bash
python -m pytest test_chat_reviews.py
```

### Coach application/admin approval tests

```bash
python -m pytest test_coach_application.py
```

### Prediction gambling tests

```bash
python -m pytest test_predictions.py
```

### Workout/calendar tests

```bash
python -m pytest test_workouts_calendar.py
```

---

## Run one test at a time

### UC 3.3 — Client requests coaching and coach accepts

```bash
python -m pytest test_contracts.py::test_uc_3_3_client_requests_coaching_and_coach_accepts
```

### UC 3.4 — Client requests contract termination

```bash
python -m pytest test_contracts.py::test_uc_3_4_client_requests_contract_termination
```

### UC 8.2 — Client writes coach review

```bash
python -m pytest test_contracts.py::test_uc_8_2_client_can_write_review_for_coach
```

### UC 8.1 — Client and coach exchange messages

```bash
python -m pytest test_chat_reviews.py::test_uc_8_1_client_and_coach_can_exchange_messages
```

### UC 11.1 — Coach submits application and admin approves

```bash
python -m pytest test_coach_application.py::test_uc_11_1_new_coach_application_full_admin_approval -v -s
```

### UC 8.4 — Goal prediction gambling

PowerShell:

```powershell
cd "C:\Users\black\OneDrive\Desktop\Selenium Testing\kevin"

Remove-Item Env:SAM_MARKET_BET -ErrorAction SilentlyContinue
Remove-Item Env:SAM_MARKET_TO_CLOSE -ErrorAction SilentlyContinue
Remove-Item Env:SAM_MARKET_TO_CANCEL -ErrorAction SilentlyContinue
Remove-Item Env:ALEX_APPROVE_MARKET_TITLE -ErrorAction SilentlyContinue
Remove-Item Env:ALEX_REJECT_MARKET_TITLE -ErrorAction SilentlyContinue

$env:PREDICTION_WAGER_POINTS = "10"
$env:PREDICTION_BET_SIDE = "no"

python -m pytest test_predictions.py::test_uc_8_4_prediction_gambling_full_flow -v -s
```

Command Prompt:

```bat
cd "C:\Users\black\OneDrive\Desktop\Selenium Testing\kevin"

set SAM_MARKET_BET=
set SAM_MARKET_TO_CLOSE=
set SAM_MARKET_TO_CANCEL=
set ALEX_APPROVE_MARKET_TITLE=
set ALEX_REJECT_MARKET_TITLE=

set PREDICTION_WAGER_POINTS=10
set PREDICTION_BET_SIDE=no

python -m pytest test_predictions.py::test_uc_8_4_prediction_gambling_full_flow -v -s
```

### UC 4.2 — Browse and assign predefined workout plan

```powershell
cd "C:\Users\black\OneDrive\Desktop\Selenium Testing\kevin"

$env:CLIENT_EMAIL = "alex@example.com"
$env:CLIENT_PASSWORD = "Rishik@1"

python -m pytest test_workouts_calendar.py::test_uc_4_2_client_browses_and_assigns_recommended_plan -v -s
```

### UC 4.3 — Coach assigns workout plan to client

```powershell
cd "C:\Users\black\OneDrive\Desktop\Selenium Testing\kevin"

$env:COACH_EMAIL = "sam@example.com"
$env:COACH_PASSWORD = "Rishik@1"
$env:CLIENT_NAME = "Alex Taylor"
$env:COACH_PLAN_NAME = "Full Body Strength - 3x Week"

python -m pytest test_workouts_calendar.py::test_uc_4_3_coach_assigns_workout_plan_to_client -v -s
```

### UC 4.4 — Assign workout to specific day and view in calendar

```powershell
cd "C:\Users\black\OneDrive\Desktop\Selenium Testing\kevin"

$env:CLIENT_EMAIL = "alex@example.com"
$env:CLIENT_PASSWORD = "Rishik@1"
$env:SESSION_WORKOUT_PLAN = "Full Body Strength - 3x Week"

python -m pytest test_workouts_calendar.py::test_uc_4_4_client_assigns_workout_to_specific_day -v -s
```

### UC 6.1 — Log workout activity

```powershell
cd "C:\Users\black\OneDrive\Desktop\Selenium Testing\kevin"

$env:CLIENT_EMAIL = "alex@example.com"
$env:CLIENT_PASSWORD = "Rishik@1"

python -m pytest test_workouts_calendar.py::test_uc_6_1_client_starts_scheduled_workout_activity -v -s
```

### Final workout/calendar flow — UC 4.3, UC 4.2, UC 4.4, UC 6.1

This is the preferred workout/calendar demo command because it minimizes logins: coach Sam logs in once, then Alex logs in once and completes the remaining workout/calendar use cases.

```powershell
cd "C:\Users\black\OneDrive\Desktop\Selenium Testing\kevin"

python -m pytest test_workouts_calendar.py::test_workout_calendar_full_flow -v -s
```

For a slower visual demo:

```powershell
$env:DEMO_SLEEP = "1"
$env:LOGIN_SETTLE_SLEEP = "4"
```

For a faster run:

```powershell
$env:DEMO_SLEEP = "0.3"
$env:LOGIN_SETTLE_SLEEP = "2"
```

---

## Test accounts

### Client account

```text
Email: alex@example.com
Password: Rishik@1
```

Used for:

- UC 3.3 client request flow
- UC 3.4 contract termination flow
- UC 8.1 client message sender flow
- UC 8.4 prediction gambling bet, market creation, and final verification flow
- UC 4.2 recommended workout plan browsing/assignment
- UC 4.4 workout session calendar scheduling
- UC 6.1 workout activity logging

### Coach account

```text
Email: taylor@example.com
Password: Rishik@1
```

Used for:

- UC 3.3 coach accept flow

### Review-capable account

```text
Email: sam@example.com
Password: Rishik@1
```

Used for:

- UC 8.2 review flow

This account is expected to have coach/client access and contract history.

### Chat coach account

```text
Email: sam@example.com
Password: Rishik@1
```

Used for:

- UC 8.1 coach message receiver/reply flow

### Prediction market owner account

```text
Email: sam@example.com
Password: Rishik@1
```

Used for:

- UC 8.4 Sam-owned market close flow
- UC 8.4 Sam-owned market cancellation request flow

This account may need to switch to client view before opening the predictions page.

### Workout coach account

```text
Email: sam@example.com
Password: Rishik@1
```

Used for:

- UC 4.3 coach Manage Clients flow
- UC 4.3 assigning `Full Body Strength - 3x Week` to Alex
- Final workout/calendar flow before switching to Alex

### Admin account

```text
Email: liam@example.com
Password: Rishik@1
```

Used for:

- UC 11.1 admin coach application approval flow
- UC 8.4 admin prediction review, settlement, and cancellation review flow

### Dynamically generated coach applicant account

`test_coach_application.py` creates a new coach account every run.

The generated account uses:

```text
Name: Selenium Coach
Email format: cxxxx@example.com
Password: Rishik@1
Role: Coach
```

The email local part is intentionally short, letters-only, and has no numbers or extra periods because the backend creates the username from the email local part.

---

## Environment variables

The scripts support environment variables so accounts, coaches, contacts, markets, workout plans, and test data can be changed without editing the Python files.

### Shared client login

Default:

```text
alex@example.com
```

Change it with:

```bash
set CLIENT_EMAIL=alex@example.com
set CLIENT_PASSWORD=Rishik@1
```

### UC 3.3 coach login

Default:

```text
taylor@example.com
```

Change it with:

```bash
set COACH_EMAIL=taylor@example.com
set COACH_PASSWORD=Rishik@1
```

### UC 3.4 termination coach

Default:

```text
Sam Nguyen
```

Change it with:

```bash
set TERMINATION_COACH_NAME=Taylor Brooks
```

### UC 8.2 review account

Default:

```text
sam@example.com
```

Change it with:

```bash
set REVIEW_EMAIL=taylor@example.com
set REVIEW_PASSWORD=Rishik@1
```

### UC 8.2 coach being reviewed

Default:

```text
Taylor Brooks
```

Change it with:

```bash
set REVIEW_COACH_NAME=Taylor Brooks
```

### UC 8.2 review text

Default:

```text
UC 8.2 Selenium review: great coaching experience and helpful feedback.
```

Change it with:

```bash
set REVIEW_TEXT=UC 8.2 Selenium review test message.
```

### UC 8.1 chat coach login

Default:

```text
sam@example.com
```

Change it with:

```bash
set CHAT_COACH_EMAIL=sam@example.com
set CHAT_COACH_PASSWORD=Rishik@1
```

### UC 8.1 chat contact names

Defaults:

```text
CLIENT_CONTACT_NAME=Alex Taylor
COACH_CONTACT_NAME=Sam Nguyen
```

Change them with:

```bash
set CLIENT_CONTACT_NAME=Alex Taylor
set COACH_CONTACT_NAME=Sam Nguyen
```

### UC 11.1 admin login

Default:

```text
liam@example.com
```

Change it with:

```bash
set ADMIN_EMAIL=liam@example.com
set ADMIN_PASSWORD=Rishik@1
```

### UC 11.1 generated coach applicant

Defaults:

```text
COACH_APPLICATION_NAME=Selenium Coach
COACH_APPLICATION_PASSWORD=Rishik@1
```

Change them with:

```bash
set COACH_APPLICATION_NAME=Selenium Coach
set COACH_APPLICATION_PASSWORD=Rishik@1
```

The email is generated automatically. To force a specific email:

```bash
set COACH_APPLICATION_EMAIL=cabcd@example.com
```

Only use a short email local part before `@`, because the backend uses it as the username.

### UC 11.1 coach application data

Defaults:

```text
PRIMARY_SPECIALTIES=Strength Training,HIIT,Weight Loss
SECONDARY_SPECIALTIES=Mobility,Nutrition
CLIENT_SKILL_LEVELS=Beginners,Intermediate
SESSION_FORMAT=Virtual / Online
COACHING_PRICE=75
CERTIFICATION_NAME=NASM CPT
CERTIFICATION_PROVIDER=National Academy of Sports Medicine
COACH_EXPERIENCE_YEARS=3
```

Change them with:

```bash
set PRIMARY_SPECIALTIES=Strength Training,HIIT,Weight Loss
set SECONDARY_SPECIALTIES=Mobility,Nutrition
set CLIENT_SKILL_LEVELS=Beginners,Intermediate
set SESSION_FORMAT=Virtual / Online
set COACHING_PRICE=75
set CERTIFICATION_NAME=NASM CPT
set CERTIFICATION_PROVIDER=National Academy of Sports Medicine
set COACH_EXPERIENCE_YEARS=3
```

### UC 11.1 client onboarding data

Defaults:

```text
CLIENT_ONBOARDING_GOALS=General Fitness,Build Strength
CLIENT_HEIGHT=70
CLIENT_WEIGHT=180
CLIENT_WEIGHT_GOAL=170
CLIENT_DOB=2000-01-01
CLIENT_ACTIVITY_LEVEL=Intermediate
```

Change them with:

```bash
set CLIENT_ONBOARDING_GOALS=General Fitness,Build Strength
set CLIENT_HEIGHT=70
set CLIENT_WEIGHT=180
set CLIENT_WEIGHT_GOAL=170
set CLIENT_DOB=2000-01-01
set CLIENT_ACTIVITY_LEVEL=Intermediate
```

### UC 11.1 admin approval note

Default:

```text
Approved by Selenium UC 11.1 automated admin review.
```

Change it with:

```bash
set ADMIN_APPROVAL_NOTE=Approved during Selenium demo.
```

### UC 4.2, UC 4.3, UC 4.4, and UC 6.1 workout/calendar settings

Defaults:

```text
CLIENT_EMAIL=alex@example.com
CLIENT_PASSWORD=Rishik@1
COACH_EMAIL=sam@example.com
COACH_PASSWORD=Rishik@1
CLIENT_NAME=Alex Taylor
COACH_PLAN_NAME=Full Body Strength - 3x Week
WORKOUT_GOAL=General Fitness
WORKOUT_EXPERIENCE=Beginner
WORKOUT_DAYS_PER_WEEK=3 days
WORKOUT_SESSION_LENGTH=30–45 min
EXPECTED_PLAN_NAME=Beginner Bodyweight
SESSION_WORKOUT_PLAN=Full Body Strength - 3x Week
SESSION_TITLE_PREFIX=UC 4.4 Active Session
```

Change them with:

```bash
set CLIENT_EMAIL=alex@example.com
set CLIENT_PASSWORD=Rishik@1
set COACH_EMAIL=sam@example.com
set COACH_PASSWORD=Rishik@1
set CLIENT_NAME=Alex Taylor
set COACH_PLAN_NAME=Full Body Strength - 3x Week
set WORKOUT_GOAL=General Fitness
set WORKOUT_EXPERIENCE=Beginner
set WORKOUT_DAYS_PER_WEEK=3 days
set WORKOUT_SESSION_LENGTH=30–45 min
set EXPECTED_PLAN_NAME=Beginner Bodyweight
set SESSION_WORKOUT_PLAN=Full Body Strength - 3x Week
set SESSION_TITLE_PREFIX=UC 4.4 Active Session
```

The combined workout/calendar flow creates a fresh session title each run using the current time:

```text
UC 4.4 Active Session HHMM
```

UC 4.4 schedules that session for today around the current hour so UC 6.1 can immediately start/log it from the client home page.

### UC 8.4 prediction gambling settings

Defaults:

```text
ALEX_EMAIL=alex@example.com
SAM_EMAIL=sam@example.com
ADMIN_EMAIL=liam@example.com
GLOBAL_PASSWORD=Rishik@1
PREDICTION_WAGER_POINTS=10
PREDICTION_BET_SIDE=no
SAM_MARKET_CREATOR=Sam Nguyen
```

Change them with:

```bash
set ALEX_EMAIL=alex@example.com
set SAM_EMAIL=sam@example.com
set ADMIN_EMAIL=liam@example.com
set GLOBAL_PASSWORD=Rishik@1
set PREDICTION_WAGER_POINTS=10
set PREDICTION_BET_SIDE=no
set SAM_MARKET_CREATOR=Sam Nguyen
```

The script discovers a visible Sam-created market from Gambling Den and places one `NO` bet on it. It then uses that same discovered market for Sam's close flow and admin settlement.

#### Optional UC 8.4 market overrides

Use these only when the seeded market data requires a specific card:

```bash
set SAM_MARKET_BET=Will Sam complete 5 workouts?
set SAM_MARKET_TO_CLOSE=Will Sam complete 5 workouts?
set SAM_MARKET_TO_CANCEL=Will Alex hit 10k steps daily?
```

Clear stale overrides before a normal run:

PowerShell:

```powershell
Remove-Item Env:SAM_MARKET_BET -ErrorAction SilentlyContinue
Remove-Item Env:SAM_MARKET_TO_CLOSE -ErrorAction SilentlyContinue
Remove-Item Env:SAM_MARKET_TO_CANCEL -ErrorAction SilentlyContinue
```

Command Prompt:

```bat
set SAM_MARKET_BET=
set SAM_MARKET_TO_CLOSE=
set SAM_MARKET_TO_CANCEL=
```

#### Optional UC 8.4 generated Alex market titles

By default, the test generates unique market titles using the current timestamp:

```text
UC 8.4 Alex approved market <suffix>
UC 8.4 Alex rejected market <suffix>
```

To force custom titles:

```bash
set ALEX_APPROVE_MARKET_TITLE=UC 8.4 Alex approved market demo
set ALEX_REJECT_MARKET_TITLE=UC 8.4 Alex rejected market demo
```

Clear stale custom titles before a normal run:

PowerShell:

```powershell
Remove-Item Env:ALEX_APPROVE_MARKET_TITLE -ErrorAction SilentlyContinue
Remove-Item Env:ALEX_REJECT_MARKET_TITLE -ErrorAction SilentlyContinue
```

Command Prompt:

```bat
set ALEX_APPROVE_MARKET_TITLE=
set ALEX_REJECT_MARKET_TITLE=
```

### Demo speed

Defaults vary by file, but these are commonly supported:

```text
DEMO_SLEEP=0.6 or 1
LOGIN_SETTLE_SLEEP=3
```

For a slower demo:

```bash
set DEMO_SLEEP=1
set LOGIN_SETTLE_SLEEP=4
```

For a faster run:

```bash
set DEMO_SLEEP=0.3
set LOGIN_SETTLE_SLEEP=2
```

---

## Review submission behavior

By default, the UC 8.2 review test fills the review modal but does not submit it.

This prevents duplicate reviews while testing.

To actually submit the review:

```bash
set ALLOW_REVIEW_SUBMIT=true
python -m pytest test_contracts.py::test_uc_8_2_client_can_write_review_for_coach
```

To turn submission back off:

```bash
set ALLOW_REVIEW_SUBMIT=false
```

---

## Important data notes

These tests interact with real local demo data.

UC 3.3 submits a coaching request and accepts it as the coach.

UC 3.4 submits a report/termination request.

UC 8.1 sends a real chat message from Alex to Sam, then sends a real response from Sam to Alex.

UC 8.2 only submits a review if:

```bash
set ALLOW_REVIEW_SUBMIT=true
```

UC 11.1 creates a brand-new coach account, submits the coach application, completes required client onboarding, logs in as admin Liam, approves the application, refreshes the page, checks the Approved tab, and verifies the same account appears there.

UC 8.4 places a real prediction bet, creates two real Alex prediction markets, has Sam close one market and request cancellation on another, has admin approve/reject/settle/review cancellation, then logs back in as Alex for final verification.

UC 4.2 assigns a real recommended workout plan to Alex.

UC 4.3 logs in as Sam, selects Alex from Manage Clients, and assigns a real coach workout plan.

UC 4.4 creates a real workout session on today's calendar using an active time window.

UC 6.1 starts/logs the scheduled session, records multiple exercise sets, records cardio, and edits today's logs.

If a test fails because the expected data no longer exists, reset or reseed the database, or update the environment variables to use a different account/coach/contact/market/workout plan.

---

## Current coverage summary

```text
test_contracts.py
[x] UC 3.3 — Coach accepts/rejects client requests
[x] UC 3.4 — Client terminates contract
[x] UC 8.2 — Leave review for coach

test_chat_reviews.py
[x] UC 8.1 — Chat with coach

test_coach_application.py
[x] UC 11.1 — Coach submits application, admin approves

test_predictions.py
[x] UC 8.4 — Goal prediction gambling

test_workouts_calendar.py
[x] UC 4.2 — Browse and assign predefined workout plans
[x] UC 4.3 — Coach assigns workout to client
[x] UC 4.4 — Assign workout to specific day, view in calendar
[x] UC 6.1 — Log workout activity
```

Remaining Kevin UCs:

```text
None. All assigned Kevin UCs are implemented.
```

---

## Troubleshooting

### Unknown pytest mark warning

If this warning appears:

```text
PytestUnknownMarkWarning: Unknown pytest.mark.kevin
```

make sure `pytest.ini` exists in the same folder where pytest is being run.

The file should include:

```ini
[pytest]
markers =
    kevin: Kevin's assigned Selenium use case tests
    contracts: Contract and coach relationship tests
    review: Coach review tests
    chat: Chat and messaging tests
    application: Coach application and admin approval tests
    prediction: Goal prediction gambling tests
    workouts: Workout plan, workout calendar, and activity logging tests
```

### Browser opens and closes too fast

The scripts include demo pauses.

If the browser still closes too quickly, add a temporary pause in `conftest.py` after the test finishes.

Example:

```python
import time

@pytest.fixture
def driver():
    options = Options()
    options.add_argument("--start-maximized")

    driver = webdriver.Chrome(options=options)
    yield driver

    time.sleep(10)
    driver.quit()
```

### Selenium cannot find an element

Usually this means one of these happened:

- the app route changed
- the user account does not have the expected data
- a modal or notification is blocking the click
- the frontend HTML changed
- the test was run with the wrong database state

Run the specific test and watch where the browser stops:

```bash
python -m pytest test_file.py::test_name_here
```

### UC 8.1 chat test does not find the expected contact

Make sure the chat data exists for both sides:

```text
Client side:
Alex should have Sam Nguyen in Messages.

Coach side:
Sam should have Alex Taylor in Messages.
```

If the contact names change, update:

```bash
set CLIENT_CONTACT_NAME=Alex Taylor
set COACH_CONTACT_NAME=Sam Nguyen
```

### UC 11.1 registration fails

Check the backend logs first:

```bash
docker compose logs -f backend
```

or:

```bash
docker logs betafit-backend --tail 100 -f
```

Common issue:

```text
Data too long for column 'username'
```

The backend creates the username from the front of the email. Use a short email local part:

```bash
set COACH_APPLICATION_EMAIL=cabcd@example.com
```

Avoid long emails, numbers, and extra periods.

### UC 11.1 admin approval clicks the wrong tab

The script uses exact selectors to avoid clicking the `Approved` filter when it needs to click the `Approve` button.

If it fails again, check whether the button text changed from:

```text
Approve
```

to something else like:

```text
Accept
Approve Application
```

Then update the selector in `click_approve_on_application_card`.

### UC 8.4 cannot find a Sam market in Gambling Den

The script looks for a visible market where:

```text
Creator = Sam Nguyen
```

and where the card has a `Choose No` button.

If Alex has already bet on every visible Sam market, those markets may no longer appear in Gambling Den. Use one of these fixes:

- reseed/reset the local database
- use another account that has not bet on the market
- set `SAM_MARKET_BET` to a visible Sam-created market title that still appears in Gambling Den
- ask backend to create another open Sam-owned prediction market

### UC 8.4 admin actions click the wrong market

The script matches admin action cards by exact market title and action button inside the active admin tab.

If it clicks the wrong thing, check the printed console output:

```text
Matched exact admin action card:
Title: ...
Required button: ...
Card preview:
...
```

The card preview shows which card Selenium matched before clicking.

### UC 8.4 settlement modal has no visible note field

Some versions of the settlement modal show admin-note text but do not expose a visible textarea.

The script continues without failing if the note field is not visible, as long as the correct settlement side and confirmation can be selected.

### UC 4.4 or UC 6.1 does not find the scheduled session

The final workout/calendar flow is safest because it creates the session and immediately logs it in the same run.

Use:

```bash
python -m pytest test_workouts_calendar.py::test_workout_calendar_full_flow -v -s
```

If running UC 6.1 alone, make sure a current-day session exists for Alex with the title prefix:

```text
UC 4.4 Active Session
```

### UC 6.1 activity modal is open but inputs are not found

The Log Activity modal uses tabs for:

```text
Exercises
Cardio
Logs
```

The script expects the modal title to be:

```text
Log Activity
```

and expects fields such as:

```text
set-number
reps
weight
rpe
steps
distance-km
duration-min
calories
avg-hr
```

If the UI changes these IDs or tab labels, update the UC 6.1 helper selectors in `test_workouts_calendar.py`.

---

## Recommended demo commands

Run UC 3.4:

```bash
python -m pytest test_contracts.py::test_uc_3_4_client_requests_contract_termination
```

Run UC 8.2 without submitting:

```bash
python -m pytest test_contracts.py::test_uc_8_2_client_can_write_review_for_coach
```

Run UC 8.2 with submit enabled:

```bash
set ALLOW_REVIEW_SUBMIT=true
python -m pytest test_contracts.py::test_uc_8_2_client_can_write_review_for_coach
```

Run UC 8.1 chat flow:

```bash
python -m pytest test_chat_reviews.py::test_uc_8_1_client_and_coach_can_exchange_messages
```

Run UC 11.1 coach application/admin approval flow:

```bash
python -m pytest test_coach_application.py::test_uc_11_1_new_coach_application_full_admin_approval -v -s
```

Run UC 8.4 prediction gambling flow:

```bash
set PREDICTION_WAGER_POINTS=10
set PREDICTION_BET_SIDE=no
python -m pytest test_predictions.py::test_uc_8_4_prediction_gambling_full_flow -v -s
```

Run the final workout/calendar flow:

```bash
python -m pytest test_workouts_calendar.py::test_workout_calendar_full_flow -v -s
```

Run all currently implemented tests:

```bash
python -m pytest test_contracts.py test_chat_reviews.py test_coach_application.py test_predictions.py test_workouts_calendar.py
```

---

## Remaining UC list

```text
Remaining: 0 UCs

All assigned Kevin Selenium use cases are implemented.
```

---

## Coverage count

```text
Completed: 10 UCs
Remaining: 0 UCs
Total assigned: 10 UCs
```

---

## Suggested commit message

```text
Add Selenium coverage for all Kevin-assigned frontend use cases
```
