"""
Kevin Selenium demo tests.

Covers:
UC 3.3 — Coach accepts an existing client contract request.
UC 3.4 — Client requests to terminate a coaching contract.
UC 8.2 — Client writes a review for a coach.

Known routes:
Client coach search: /client/coaches
Coach contract review: /coach
Login route: /signin

Demo behavior:
UC 3.3 accepts an existing pending coaching request and mutates demo database data.
UC 3.4 intentionally submits a termination/report form and mutates demo database data.
UC 8.2 fills the Write Review modal. It only submits the review if ALLOW_REVIEW_SUBMIT=true.
"""

import os
import time

import pytest
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


TIMEOUT = 12
DEMO_SLEEP = float(os.getenv("DEMO_SLEEP", "1"))
LOGIN_SETTLE_SLEEP = float(os.getenv("LOGIN_SETTLE_SLEEP", "3"))

CLIENT_EMAIL = os.getenv("CLIENT_EMAIL", "alex@example.com")
CLIENT_PASSWORD = os.getenv("CLIENT_PASSWORD", "Rishik@1")

COACH_EMAIL = os.getenv("COACH_EMAIL", "taylor@example.com")
COACH_PASSWORD = os.getenv("COACH_PASSWORD", "Rishik@1")

# UC 3.3 pending request to accept.
# This test no longer creates the client request because that flow belongs to another use case.
# Seed/create the pending request before running, then set this to the requesting client's name.
# Example:
# set CONTRACT_REQUEST_CLIENT_NAME=Alex Taylor
CONTRACT_REQUEST_CLIENT_NAME = os.getenv("CONTRACT_REQUEST_CLIENT_NAME", "Alex Taylor")

# UC 3.4 active coach to terminate/report.
# Currently Alex's active coach is Sam Nguyen.
# Later, switch to Taylor Brooks by running:
# set TERMINATION_COACH_NAME=Taylor Brooks
TERMINATION_COACH_NAME = os.getenv("TERMINATION_COACH_NAME", "Sam Nguyen")

# UC 8.2 review flow.
# This account should have coach/client access and contract history.
REVIEW_EMAIL = os.getenv("REVIEW_EMAIL", "sam@example.com")
REVIEW_PASSWORD = os.getenv("REVIEW_PASSWORD", "Rishik@1")
REVIEW_COACH_NAME = os.getenv("REVIEW_COACH_NAME", "Taylor Brooks")
REVIEW_TEXT = os.getenv(
    "REVIEW_TEXT",
    "UC 8.2 Selenium review: great coaching experience and helpful feedback.",
)

# Keep false by default so you can test the modal without creating duplicate reviews.
# To actually submit:
# set ALLOW_REVIEW_SUBMIT=true
ALLOW_REVIEW_SUBMIT = os.getenv("ALLOW_REVIEW_SUBMIT", "false").lower() == "true"


# ------------------------------------------------------------
# General helpers
# ------------------------------------------------------------

def demo_pause(multiplier=1):
    """
    Demo pacing helper.

    DEMO_SLEEP is a global multiplier. For example, DEMO_SLEEP=0.3
    makes each visual pause 30% of its normal length, while DEMO_SLEEP=2
    doubles visual pauses. Login waits are controlled separately by
    LOGIN_SETTLE_SLEEP.
    """
    time.sleep(max(0, DEMO_SLEEP * float(multiplier)))


def settle_pause(seconds):
    """Absolute wait for auth/redirect/backend settling."""
    time.sleep(max(0, float(seconds)))


def wait_for_body(driver):
    WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )


def page_text(driver) -> str:
    wait_for_body(driver)
    return driver.find_element(By.TAG_NAME, "body").text.lower()


def assert_page_contains(driver, words):
    text = page_text(driver)

    assert any(word.lower() in text for word in words), (
        f"Expected page to contain one of {words}\n\n"
        f"Actual page text:\n{text[:1200]}"
    )


def scroll_to_element(driver, element, pause=True):
    driver.execute_script(
        "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
        element,
    )

    if pause:
        demo_pause(1)


def click_element(driver, element, pause=True):
    scroll_to_element(driver, element, pause=True)
    element.click()

    if pause:
        demo_pause()


def type_into_element(driver, element, value, pause=True):
    scroll_to_element(driver, element, pause=True)
    element.clear()
    element.send_keys(value)

    if pause:
        demo_pause()


def click_button_by_text(driver, text):
    button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//button[contains(translate(normalize-space(.), "
                f"'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
                f"'{text.lower()}')]",
            )
        )
    )

    click_element(driver, button)
    wait_for_body(driver)


def find_button_by_text(driver, text):
    return WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//button[contains(translate(normalize-space(.), "
                f"'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
                f"'{text.lower()}')]",
            )
        )
    )


def login(driver, base_url, email, password):
    driver.get(f"{base_url}/signin")
    wait_for_body(driver)
    demo_pause(2)

    email_input = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )
    password_input = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.NAME, "password"))
    )

    type_into_element(driver, email_input, email)
    type_into_element(driver, password_input, password)

    sign_in_button = find_button_by_text(driver, "Sign In")
    click_element(driver, sign_in_button)

    WebDriverWait(driver, TIMEOUT).until(
        lambda d: "/signin" not in d.current_url
    )

    wait_for_body(driver)

    # Wait for login redirects, auth state updates, and notifications/toasts to fade.
    settle_pause(LOGIN_SETTLE_SLEEP)


def clear_session(driver, base_url):
    """
    Clears local auth before logging into the next role.
    This handles auth stored in cookies, localStorage, or sessionStorage.
    """
    driver.get(base_url)
    wait_for_body(driver)

    driver.delete_all_cookies()
    driver.execute_script("window.localStorage.clear();")
    driver.execute_script("window.sessionStorage.clear();")

    demo_pause(1)


# ------------------------------------------------------------
# Shared navbar/dropdown helpers
# ------------------------------------------------------------

def click_navbar_profile_or_avatar(driver):
    """
    Opens the profile dropdown by clicking the avatar button.

    Exact navbar structure:
    <div class="relative">
        <button class="mt-0.5">
            <span class="avatar avatar--md w-8 h-8">
                <img class="avatar__image" ...>
    """

    avatar_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//div[contains(@class, 'relative')]"
                "//button[contains(@class, 'mt-0.5') and .//span[contains(@class, 'avatar')]]",
            )
        )
    )

    click_element(driver, avatar_button)
    demo_pause(2)

    WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                "//div[contains(@class, 'absolute') and contains(@class, 'right-0')]",
            )
        )
    )

    demo_pause(1)


def click_dropdown_button(driver, button_text):
    dropdown_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//div[contains(@class, 'absolute') and contains(@class, 'right-0')]"
                f"//button[contains(normalize-space(.), '{button_text}')]",
            )
        )
    )

    click_element(driver, dropdown_button)
    wait_for_body(driver)
    demo_pause(3)


def click_settings_from_dropdown(driver):
    """
    Clicks Settings from the opened avatar dropdown.
    """
    click_dropdown_button(driver, "Settings")


def click_switch_to_client_from_dropdown(driver):
    """
    Clicks Switch to Client from the opened coach dropdown.
    """
    click_dropdown_button(driver, "Switch to Client")


# ------------------------------------------------------------
# UC 3.3 helpers
# ------------------------------------------------------------

def click_taylor_brooks_view_profile(driver):
    """
    Finds Taylor Brooks' card and clicks View Profile.
    """
    click_coach_view_profile(driver, "Taylor Brooks")


def click_coach_view_profile(driver, coach_name):
    """
    Finds the named coach card and clicks its View Profile button.
    """
    coach_card = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                f"//*[contains(normalize-space(.), '{coach_name}')]"
                "/ancestor::div[contains(@class, 'card')][1]",
            )
        )
    )

    scroll_to_element(driver, coach_card)
    demo_pause(2)

    view_profile_button = coach_card.find_element(
        By.XPATH,
        ".//button[contains(normalize-space(.), 'View Profile')]",
    )

    click_element(driver, view_profile_button)
    wait_for_body(driver)
    demo_pause(3)


def fill_request_coaching_form(driver):
    training_reason = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.NAME, "training_reason"))
    )
    goals = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.NAME, "goals"))
    )
    preferred_schedule = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.NAME, "preferred_schedule"))
    )
    notes = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.NAME, "notes"))
    )

    type_into_element(
        driver,
        training_reason,
        "I want help staying consistent with workouts and improving conditioning.",
    )

    type_into_element(
        driver,
        goals,
        "Build endurance, lose weight, and improve weekly workout consistency.",
    )

    type_into_element(
        driver,
        preferred_schedule,
        "Weekdays after 6 PM or Saturday mornings.",
    )

    type_into_element(
        driver,
        notes,
        "Selenium demo request created for UC 3.3 testing.",
    )


def click_send_request(driver):
    send_request_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//button[contains(translate(normalize-space(.), "
                "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
                "'send request')]",
            )
        )
    )

    assert send_request_button.is_enabled(), "Send request button should be enabled."

    click_element(driver, send_request_button)
    wait_for_body(driver)
    demo_pause(4)


def click_pending_contracts_tab(driver):
    """
    Opens the Pending Contracts tab/section when the coach dashboard exposes it.
    If Pending is already selected, this is harmless.
    """

    possible_xpaths = [
        "//*[@role='tab' and contains(translate(normalize-space(.), "
        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'pending')]",
        "//button[contains(translate(normalize-space(.), "
        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'pending contracts')]",
        "//button[contains(translate(normalize-space(.), "
        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'pending')]",
    ]

    for xpath in possible_xpaths:
        try:
            pending_tab = WebDriverWait(driver, 3).until(
                EC.element_to_be_clickable((By.XPATH, xpath))
            )
            click_element(driver, pending_tab)
            wait_for_body(driver)
            demo_pause(2)
            return
        except TimeoutException:
            continue

    # Some versions land directly on the pending panel.
    demo_pause(1)


def find_pending_contract_card_by_client_name(driver, client_name):
    """
    Finds the pending contract request card for a specific client name.

    This keeps UC 3.3 focused on the coach-side accept action instead of
    creating a new request from the client side.
    """

    client_name_lower = client_name.lower()

    def locate(current_driver):
        try:
            panels = current_driver.find_elements(By.CSS_SELECTOR, "[role='tabpanel']")
            search_roots = [panel for panel in panels if panel.is_displayed()]

            if not search_roots:
                search_roots = [current_driver.find_element(By.TAG_NAME, "body")]

            for root in search_roots:
                if client_name_lower not in (root.text or "").lower():
                    continue

                matching_nodes = root.find_elements(
                    By.XPATH,
                    f".//*[contains(translate(normalize-space(.), "
                    f"'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
                    f"'{client_name_lower}')]",
                )

                for node in matching_nodes:
                    if not node.is_displayed():
                        continue

                    ancestor_xpaths = [
                        "./ancestor::div[contains(@class, 'card')][1]",
                        "./ancestor::div[.//button][1]",
                    ]

                    for ancestor_xpath in ancestor_xpaths:
                        try:
                            card = node.find_element(By.XPATH, ancestor_xpath)

                            if not card.is_displayed():
                                continue

                            card_text = (card.text or "").lower()
                            has_client = client_name_lower in card_text
                            has_buttons = len(card.find_elements(By.TAG_NAME, "button")) > 0

                            if has_client and has_buttons:
                                return card

                        except Exception:
                            continue

            return False

        except Exception:
            return False

    return WebDriverWait(driver, TIMEOUT).until(locate)


def click_pending_contract_accept_button_for_client(driver, client_name=CONTRACT_REQUEST_CLIENT_NAME):
    """
    Accepts the pending contract request for the configured client.

    The current UI shows two icon buttons on each pending card. The first visible
    enabled button is the accept/check action, matching the previous behavior,
    but now scoped to the requested client's card.
    """

    click_pending_contracts_tab(driver)

    contract_card = find_pending_contract_card_by_client_name(driver, client_name)

    print("\\nAccepting pending coaching request:")
    print(f"Client request: {client_name}\\n")

    scroll_to_element(driver, contract_card)
    demo_pause(2)

    buttons = contract_card.find_elements(By.TAG_NAME, "button")
    visible_buttons = [
        button
        for button in buttons
        if button.is_displayed() and button.is_enabled()
    ]

    assert visible_buttons, (
        f"Expected an accept button on the pending contract card for {client_name}.\\n\\n"
        f"Card text:\\n{contract_card.text}"
    )

    accept_button = visible_buttons[0]
    click_element(driver, accept_button)
    wait_for_body(driver)
    demo_pause(4)


def click_first_pending_contract_accept_button(driver):
    """
    Backward-compatible wrapper. Prefer
    click_pending_contract_accept_button_for_client.
    """

    click_pending_contract_accept_button_for_client(driver, CONTRACT_REQUEST_CLIENT_NAME)



# ------------------------------------------------------------
# UC 3.4 helpers
# ------------------------------------------------------------

def click_report_your_coach(driver):
    report_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//*[self::button or self::a]"
                "[contains(translate(normalize-space(.), "
                "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'report')]",
            )
        )
    )

    click_element(driver, report_button)
    wait_for_body(driver)
    demo_pause(3)


def select_coach_in_report_modal(driver, coach_name):
    modal = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[role='dialog']"))
    )

    assert "report a coach" in modal.text.lower(), "Expected Report a Coach modal."

    coach_card = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//*[contains(normalize-space(.), '{coach_name}')]"
                "/ancestor::div[contains(@class, 'card')][1]",
            )
        )
    )

    click_element(driver, coach_card)
    wait_for_body(driver)
    demo_pause(2)


def select_report_reason(driver, reason_text="Other"):
    """
    Opens the React Aria reason dropdown and selects a reason.
    """

    reason_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='Report reason']"))
    )

    click_element(driver, reason_button)
    demo_pause(1)

    try:
        option = WebDriverWait(driver, TIMEOUT).until(
            EC.element_to_be_clickable(
                (
                    By.XPATH,
                    f"//*[@role='option' and contains(translate(normalize-space(.), "
                    f"'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
                    f"'{reason_text.lower()}')]",
                )
            )
        )

        click_element(driver, option)
        demo_pause(2)

    except TimeoutException:
        # Fallback for custom select components if role='option' is not exposed.
        # This still selects a valid reason so the Submit button can enable.
        reason_button.send_keys(Keys.ARROW_DOWN)
        demo_pause(1)
        reason_button.send_keys(Keys.ENTER)
        demo_pause(2)


def fill_report_details(driver, details):
    textarea = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                "//textarea[@aria-label='Report details' or contains(@placeholder, 'Add more details')]",
            )
        )
    )

    type_into_element(driver, textarea, details)


def check_terminate_contract(driver):
    """
    Clicks the visible Terminate contract checkbox card/label.
    """

    terminate_checkbox_label = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//*[contains(translate(normalize-space(.), "
                "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
                "'terminate contract')]"
                "/ancestor::label[1]",
            )
        )
    )

    click_element(driver, terminate_checkbox_label)
    demo_pause(2)


def click_submit_report_or_termination(driver):
    submit_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//button[contains(translate(normalize-space(.), "
                "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'submit')]",
            )
        )
    )

    assert submit_button.is_enabled(), "Submit button should be enabled before clicking."

    click_element(driver, submit_button)
    wait_for_body(driver)
    demo_pause(4)


# ------------------------------------------------------------
# UC 8.2 helpers
# ------------------------------------------------------------

def click_find_coaches_nav(driver):
    """
    Clicks Find Coaches in the client navbar.
    """
    find_coaches_link = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//a[contains(@href, '/client/coaches') "
                "and contains(normalize-space(.), 'Find Coaches')]",
            )
        )
    )

    click_element(driver, find_coaches_link)
    wait_for_body(driver)
    demo_pause(3)


def click_reviews_tab(driver):
    """
    Clicks the Reviews tab inside a coach profile.
    """
    reviews_tab = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//button[contains(normalize-space(.), 'Reviews')]",
            )
        )
    )

    click_element(driver, reviews_tab)
    wait_for_body(driver)
    demo_pause(4)


def click_write_review_button(driver):
    """
    Clicks the Write Review button in the Reviews tab.
    """
    write_review_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//button[contains(normalize-space(.), 'Write Review')]",
            )
        )
    )

    click_element(driver, write_review_button)
    wait_for_body(driver)
    demo_pause(3)


def select_review_rating(driver, rating=4):
    """
    Selects a star rating inside the Write Review modal.
    The modal exposes buttons like:
    aria-label="Set rating to 4"
    """
    rating_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.CSS_SELECTOR,
                f"button[aria-label='Set rating to {rating}']",
            )
        )
    )

    click_element(driver, rating_button)
    demo_pause(2)


def fill_review_text(driver, review_text):
    """
    Fills the review textarea inside the Write Review modal.
    """
    review_textarea = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.ID, "coach-review-text"))
    )

    type_into_element(driver, review_textarea, review_text)
    demo_pause(2)


def click_submit_review(driver):
    """
    Clicks Submit Review in the modal.
    """
    submit_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//button[contains(normalize-space(.), 'Submit Review')]",
            )
        )
    )

    click_element(driver, submit_button)
    wait_for_body(driver)
    demo_pause(4)


# ------------------------------------------------------------
# Tests
# ------------------------------------------------------------

@pytest.mark.kevin
def test_uc_3_3_client_requests_coaching_and_coach_accepts(driver, base_url):
    """
    UC 3.3 coach-side demo flow:

    1. Coach signs in.
    2. Coach opens the contract dashboard.
    3. Coach opens Pending Contracts.
    4. Coach finds the pending request for CONTRACT_REQUEST_CLIENT_NAME.
    5. Coach accepts that specific pending contract request.

    Note:
    This test intentionally does not create the client request. The client-side
    request flow belongs to another use case. Seed/create the pending request
    first, then set CONTRACT_REQUEST_CLIENT_NAME if needed.
    """

    login(driver, base_url, COACH_EMAIL, COACH_PASSWORD)

    driver.get(f"{base_url}/coach")
    wait_for_body(driver)
    demo_pause(3)

    assert_page_contains(
        driver,
        ["pending contracts", "active contracts", "history contracts"],
    )

    assert_page_contains(
        driver,
        ["pending", "contract", "client", CONTRACT_REQUEST_CLIENT_NAME],
    )

    click_pending_contract_accept_button_for_client(
        driver,
        CONTRACT_REQUEST_CLIENT_NAME,
    )

    assert_page_contains(
        driver,
        ["active", "contract", "accepted", "approved", "history", "pending"],
    )



@pytest.mark.kevin
def test_uc_3_4_client_requests_contract_termination(driver, base_url):
    """
    Full UC 3.4 demo flow:

    1. Client signs in.
    2. Client stays on the authenticated page after login.
    3. Client opens avatar dropdown.
    4. Client opens Settings.
    5. Client opens Report Your Coach.
    6. Client selects the active coach.
    7. Client selects a report reason.
    8. Client enters report details.
    9. Client checks Terminate contract.
    10. Client submits the termination/report request.
    """

    login(driver, base_url, CLIENT_EMAIL, CLIENT_PASSWORD)

    # Do not reroute here. After login, the app should already be on /client.
    wait_for_body(driver)

    # login() already waits for redirects/toasts using LOGIN_SETTLE_SLEEP.
    demo_pause()

    assert_page_contains(
        driver,
        ["home", "calendar", "nutrition", "find coaches", "messages"],
    )

    click_navbar_profile_or_avatar(driver)
    click_settings_from_dropdown(driver)

    assert_page_contains(
        driver,
        ["settings", "profile", "coach", "report"],
    )

    click_report_your_coach(driver)

    assert_page_contains(
        driver,
        ["report a coach", "current coach", "previous coach"],
    )

    assert_page_contains(
        driver,
        [TERMINATION_COACH_NAME],
    )

    select_coach_in_report_modal(driver, TERMINATION_COACH_NAME)

    assert_page_contains(
        driver,
        ["reason", "details", "terminate contract", "submit"],
    )

    select_report_reason(driver, "Other")

    fill_report_details(
        driver,
        f"Selenium UC 3.4 demo: requesting to terminate contract with {TERMINATION_COACH_NAME}.",
    )

    check_terminate_contract(driver)

    click_submit_report_or_termination(driver)

    assert_page_contains(
        driver,
        ["submitted", "success", "report", "terminate", "contract", "coach", "settings"],
    )


@pytest.mark.kevin
def test_uc_8_2_client_can_write_review_for_coach(driver, base_url):
    """
    UC 8.2 review flow:

    1. Sign in as the review-capable account.
    2. Open avatar dropdown.
    3. Click Switch to Client.
    4. Go to Find Coaches.
    5. Open Taylor Brooks' profile.
    6. Click Reviews tab.
    7. Click Write Review.
    8. Select 4 stars.
    9. Write review text.
    10. Submit only if ALLOW_REVIEW_SUBMIT=true.
    """

    login(driver, base_url, REVIEW_EMAIL, REVIEW_PASSWORD)

    # login() already waits for redirects/toasts using LOGIN_SETTLE_SLEEP.
    demo_pause()

    click_navbar_profile_or_avatar(driver)
    click_switch_to_client_from_dropdown(driver)

    assert_page_contains(
        driver,
        ["home", "calendar", "nutrition", "find coaches", "messages"],
    )

    click_find_coaches_nav(driver)

    assert_page_contains(
        driver,
        ["coaches", "view profile", REVIEW_COACH_NAME.lower()],
    )

    click_coach_view_profile(driver, REVIEW_COACH_NAME)

    assert_page_contains(
        driver,
        [REVIEW_COACH_NAME.lower(), "about", "reviews", "success stories"],
    )

    click_reviews_tab(driver)

    assert_page_contains(
        driver,
        ["reviews", "rating", "coach"],
    )

    click_write_review_button(driver)

    assert_page_contains(
        driver,
        ["write review", "rating", "review", "submit review"],
    )

    select_review_rating(driver, rating=4)
    fill_review_text(driver, REVIEW_TEXT)

    assert_page_contains(
        driver,
        ["write review", "submit review"],
    )

    if ALLOW_REVIEW_SUBMIT:
        click_submit_review(driver)

        assert_page_contains(
            driver,
            ["review", "submitted", "success", "rating", REVIEW_COACH_NAME.lower()],
        )
    else:
        # Leave modal open so the professor can see the completed review form.
        demo_pause(5)
