"""
Kevin Selenium demo tests.

Covers:
UC 11.1 — Coach submits application, completes required client onboarding,
admin approves the coach application, then admin verifies the approved coach
appears in the Approved tab.

Flow:
1. Register a brand-new account as Coach.
2. Complete coach onboarding/application fields.
3. Submit coach application.
4. Click the post-application "One more step" Continue modal.
5. Complete required client onboarding.
6. Clear the new coach/client auth state and go directly to Sign In.
7. Log in as Liam/admin.
8. Open admin coach governance page.
9. Force the application roster to the Pending filter.
10. Find the newly submitted coach application by its generated email.
11. Click the exact Approve button inside that coach's pending application card.
12. Fill the admin action panel note.
13. Confirm the approval action.
14. Refresh the admin coach governance page.
15. Click the Approved filter.
16. Search the coach name.
17. Confirm the approved application appears.

Known routes:
Register route: /register
Login route: /signin
Admin coach governance route: /admin/coach-governance/
"""

import os
import time

import pytest
from selenium.common.exceptions import (
    ElementClickInterceptedException,
    NoSuchElementException,
    StaleElementReferenceException,
    TimeoutException,
)
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


TIMEOUT = 10
DEMO_SLEEP = float(os.getenv("DEMO_SLEEP", "1"))
REGISTER_SETTLE_SLEEP = float(os.getenv("REGISTER_SETTLE_SLEEP", "2"))
LOGIN_SETTLE_SLEEP = float(os.getenv("LOGIN_SETTLE_SLEEP", "3"))

COACH_APPLICATION_PASSWORD = os.getenv("COACH_APPLICATION_PASSWORD", "Rishik@1")

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "liam@example.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "Rishik@1")


def number_to_letters(number, length=4):
    """
    Converts a number into fixed-length lowercase letters only.

    Backend appears to create username from email local part, so keep
    the generated local part short and letters-only.
    """
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    result = ""

    while number > 0:
        number, remainder = divmod(number, 26)
        result = alphabet[remainder] + result

    result = result.rjust(length, "a")

    return result[-length:]


# Keep the visible name clean for the demo.
COACH_APPLICATION_NAME = os.getenv("COACH_APPLICATION_NAME", "Selenium Coach")

# Short, letters-only, no periods, no numbers.
# Example: cabcd@example.com
UNIQUE_LETTERS = number_to_letters(int(time.time()), length=4)

COACH_APPLICATION_EMAIL = os.getenv(
    "COACH_APPLICATION_EMAIL",
    f"c{UNIQUE_LETTERS}@example.com",
)

PRIMARY_SPECIALTIES = os.getenv(
    "PRIMARY_SPECIALTIES",
    "Strength Training,HIIT,Weight Loss",
).split(",")

SECONDARY_SPECIALTIES = os.getenv(
    "SECONDARY_SPECIALTIES",
    "Mobility,Nutrition",
).split(",")

CLIENT_SKILL_LEVELS = os.getenv(
    "CLIENT_SKILL_LEVELS",
    "Beginners,Intermediate",
).split(",")

SESSION_FORMAT = os.getenv("SESSION_FORMAT", "Virtual / Online")
COACHING_PRICE = os.getenv("COACHING_PRICE", "75")

CERTIFICATION_NAME = os.getenv("CERTIFICATION_NAME", "NASM CPT")
CERTIFICATION_PROVIDER = os.getenv(
    "CERTIFICATION_PROVIDER",
    "National Academy of Sports Medicine",
)
CERTIFICATION_DESCRIPTION = os.getenv(
    "CERTIFICATION_DESCRIPTION",
    "Selenium UC 11.1 demo certification for coach application testing.",
)

COACH_EXPERIENCE_YEARS = os.getenv("COACH_EXPERIENCE_YEARS", "3")
COACH_BIO = os.getenv(
    "COACH_BIO",
    "Selenium UC 11.1 demo coach bio. I help clients build consistent training habits, "
    "improve strength, and stay accountable with realistic programming.",
)

CLIENT_ONBOARDING_GOALS = os.getenv(
    "CLIENT_ONBOARDING_GOALS",
    "General Fitness,Build Strength",
).split(",")

CLIENT_HEIGHT = os.getenv("CLIENT_HEIGHT", "70")
CLIENT_WEIGHT = os.getenv("CLIENT_WEIGHT", "180")
CLIENT_WEIGHT_GOAL = os.getenv("CLIENT_WEIGHT_GOAL", "170")
CLIENT_DOB = os.getenv("CLIENT_DOB", "2000-01-01")
CLIENT_ACTIVITY_LEVEL = os.getenv("CLIENT_ACTIVITY_LEVEL", "Intermediate")

ADMIN_APPROVAL_NOTE = os.getenv(
    "ADMIN_APPROVAL_NOTE",
    "Approved by Selenium UC 11.1 automated admin review.",
)


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
        f"Actual page text:\n{text[:2000]}"
    )


def page_contains_any(driver, words):
    text = page_text(driver)
    return any(word.lower() in text for word in words)


def scroll_to_element(driver, element, pause=True):
    driver.execute_script(
        "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
        element,
    )

    if pause:
        demo_pause(1)


def click_element(driver, element, pause=True):
    scroll_to_element(driver, element, pause=True)

    try:
        element.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", element)

    if pause:
        demo_pause()


def set_react_value(driver, element, value):
    """
    Sets an input/textarea value in a React-friendly way.
    Useful for type='time', type='date', number inputs, and controlled inputs.
    """
    scroll_to_element(driver, element)

    driver.execute_script(
        """
        const element = arguments[0];
        const value = arguments[1];

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        )?.set;

        const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            'value'
        )?.set;

        if (element.tagName.toLowerCase() === 'textarea') {
            nativeTextAreaValueSetter.call(element, value);
        } else {
            nativeInputValueSetter.call(element, value);
        }

        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        """,
        element,
        value,
    )

    demo_pause()


def type_into_element(driver, element, value, pause=True):
    scroll_to_element(driver, element)
    element.clear()
    element.send_keys(value)

    if pause:
        demo_pause()


def lower_xpath_contains(text):
    return (
        "contains(translate(normalize-space(.), "
        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
        f"'{text.lower()}')"
    )


def find_button_by_text(driver, text, timeout=TIMEOUT):
    return WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//button[{lower_xpath_contains(text)}]",
            )
        )
    )


def click_button_by_text(driver, text, timeout=TIMEOUT):
    button = find_button_by_text(driver, text, timeout=timeout)
    click_element(driver, button)
    wait_for_body(driver)


def try_click_button_by_text(driver, text, timeout=3):
    try:
        click_button_by_text(driver, text, timeout=timeout)
        return True
    except TimeoutException:
        return False


def click_next_like_button(driver):
    """
    Clicks the most likely forward/progress button.
    Works across onboarding pages where the button may say Next, Continue, Save, etc.
    """
    possible_labels = [
        "Next",
        "Continue",
        "Save and Continue",
        "Save & Continue",
        "Review",
        "Finish",
    ]

    for label in possible_labels:
        if try_click_button_by_text(driver, label, timeout=3):
            demo_pause(3)
            return

    raise AssertionError(
        "Could not find a forward button like Next, Continue, Save and Continue, Review, or Finish."
    )


def click_submit_application(driver):
    possible_labels = [
        "Submit Application",
        "Submit",
        "Send Application",
        "Complete Application",
        "Finish",
    ]

    for label in possible_labels:
        if try_click_button_by_text(driver, label, timeout=4):
            demo_pause(5)
            return

    raise AssertionError("Could not find Submit Application button.")


def fill_input_by_name(driver, name, value):
    field = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.NAME, name))
    )

    type_into_element(driver, field, value)


def find_field_by_label_text(driver, label_text, tag="input", timeout=TIMEOUT):
    """
    Finds an input/textarea by nearby label text.
    This is useful when inputs do not have stable name attributes.
    """
    label = WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                f"//label[{lower_xpath_contains(label_text)}]",
            )
        )
    )

    html_for = label.get_attribute("for")

    if html_for:
        try:
            return driver.find_element(By.ID, html_for)
        except NoSuchElementException:
            pass

    return label.find_element(
        By.XPATH,
        f".//following::{tag}[1]",
    )


def fill_field_by_label_text(driver, label_text, value, tag="input"):
    field = find_field_by_label_text(driver, label_text, tag=tag)
    field_type = field.get_attribute("type")

    if field_type in ["date", "time", "number"]:
        set_react_value(driver, field, value)
    else:
        type_into_element(driver, field, value)


def find_field_by_label_or_placeholder(driver, labels, tag="input", timeout=3):
    """
    More flexible field lookup for client onboarding.
    Tries label text first, then placeholder/name/aria-label.
    """
    for label_text in labels:
        try:
            return find_field_by_label_text(
                driver,
                label_text,
                tag=tag,
                timeout=timeout,
            )
        except Exception:
            pass

    for label_text in labels:
        try:
            return WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located(
                    (
                        By.XPATH,
                        f"//{tag}["
                        f"contains(translate(@placeholder, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{label_text.lower()}') "
                        f"or contains(translate(@name, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{label_text.lower()}') "
                        f"or contains(translate(@aria-label, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '{label_text.lower()}')"
                        f"]",
                    )
                )
            )
        except TimeoutException:
            continue

    raise TimeoutException(f"Could not find {tag} for labels/placeholders: {labels}")


def try_fill_field_by_label_or_placeholder(driver, labels, value, tag="input"):
    try:
        field = find_field_by_label_or_placeholder(driver, labels, tag=tag)
        field_type = field.get_attribute("type")

        if field_type in ["date", "time", "number"]:
            set_react_value(driver, field, value)
        else:
            type_into_element(driver, field, value)

        return True

    except Exception:
        return False


def click_card_or_button_by_text(driver, text, timeout=4):
    """
    Clicks a selectable card/button based on visible text.
    """
    candidates = [
        (
            By.XPATH,
            f"//*[contains(translate(normalize-space(.), "
            f"'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
            f"'{text.lower()}')]/ancestor::button[1]",
        ),
        (
            By.XPATH,
            f"//button[contains(translate(normalize-space(.), "
            f"'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
            f"'{text.lower()}')]",
        ),
    ]

    for by, selector in candidates:
        try:
            element = WebDriverWait(driver, timeout).until(
                EC.element_to_be_clickable((by, selector))
            )

            click_element(driver, element)
            return True

        except TimeoutException:
            continue

    return False


def select_requested_cards_or_fallback(driver, requested_texts, fallback_count):
    """
    Tries to select cards by requested text.
    If some requested text does not exist, it selects visible card-like buttons as fallback.
    """
    clicked = 0

    for text in requested_texts:
        clean_text = text.strip()

        if not clean_text:
            continue

        if click_card_or_button_by_text(driver, clean_text):
            clicked += 1
            demo_pause(1)

        if clicked >= fallback_count:
            return

    if clicked >= fallback_count:
        return

    blocked_words = [
        "next",
        "continue",
        "back",
        "create account",
        "submit",
        "add block",
        "remove",
        "show password",
        "complete onboarding",
        "finish",
    ]

    candidate_buttons = driver.find_elements(
        By.XPATH,
        "//button[.//h3 or .//div[contains(@class, 'card')] or contains(@class, 'rounded-2xl')]",
    )

    for button in candidate_buttons:
        if clicked >= fallback_count:
            return

        if not button.is_displayed() or not button.is_enabled():
            continue

        button_text = (button.text or "").strip().lower()

        if not button_text:
            continue

        if any(blocked in button_text for blocked in blocked_words):
            continue

        click_element(driver, button)
        clicked += 1
        demo_pause(1)

    assert clicked >= fallback_count, (
        f"Expected to select {fallback_count} cards, but only selected {clicked}."
    )


def clear_auth_storage(driver):
    """
    Clears browser auth state without navigating through the app home page.
    """

    try:
        driver.delete_all_cookies()
    except Exception:
        pass

    try:
        driver.execute_script("window.localStorage.clear();")
        driver.execute_script("window.sessionStorage.clear();")
    except Exception:
        pass


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
    settle_pause(LOGIN_SETTLE_SLEEP)


def clear_session(driver, base_url):
    """
    Clears local auth and goes directly to the sign in screen.

    This intentionally avoids:
    /signin -> /home -> /signin
    """
    clear_auth_storage(driver)

    driver.get(f"{base_url}/signin")
    wait_for_body(driver)
    demo_pause(2)


# ------------------------------------------------------------
# Register helpers
# ------------------------------------------------------------

def choose_coach_role(driver):
    """
    Selects the exact Coach role card.

    This avoids accidentally clicking the client/train option if that card
    contains text like "train with a coach".
    """

    coach_role_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//button[.//h3[normalize-space(.)='Coach'] "
                "and .//*[contains(normalize-space(.), 'Manage clients')]]",
            )
        )
    )

    click_element(driver, coach_role_button)
    demo_pause(2)

    assert_page_contains(
        driver,
        ["coach", "manage clients", "create account"],
    )


def register_new_coach_account(driver, base_url):
    driver.get(f"{base_url}/register")
    wait_for_body(driver)
    demo_pause(3)

    assert_page_contains(
        driver,
        ["coach", "full name", "email", "password", "create account"],
    )

    choose_coach_role(driver)

    fill_input_by_name(driver, "name", COACH_APPLICATION_NAME)
    fill_input_by_name(driver, "email", COACH_APPLICATION_EMAIL)
    fill_input_by_name(driver, "password", COACH_APPLICATION_PASSWORD)

    print("\nRegistering coach account:")
    print(f"Name: {COACH_APPLICATION_NAME}")
    print(f"Email: {COACH_APPLICATION_EMAIL}")
    print(f"Password: {COACH_APPLICATION_PASSWORD}\n")

    click_button_by_text(driver, "Create Account")

    wait_for_body(driver)
    settle_pause(REGISTER_SETTLE_SLEEP)

    assert_page_contains(
        driver,
        ["coach profile setup", "special", "coach"],
    )


# ------------------------------------------------------------
# Coach onboarding helpers
# ------------------------------------------------------------

def complete_specialties_step(driver):
    assert_page_contains(
        driver,
        ["coach profile setup", "special"],
    )

    select_requested_cards_or_fallback(
        driver,
        PRIMARY_SPECIALTIES,
        fallback_count=3,
    )

    click_next_like_button(driver)


def complete_secondary_specialties_step(driver):
    assert_page_contains(
        driver,
        ["coach profile setup", "special"],
    )

    select_requested_cards_or_fallback(
        driver,
        SECONDARY_SPECIALTIES,
        fallback_count=2,
    )

    click_next_like_button(driver)


def add_availability_block(driver, day_name, start_time, end_time):
    """
    Adds one weekly availability block for a given day.
    Uses the day card's Add Block button, then sets the last time inputs in that card.
    """
    day_card = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                f"//*[normalize-space(.)='{day_name}']"
                "/ancestor::div[contains(@class, 'rounded-2xl')][1]",
            )
        )
    )

    scroll_to_element(driver, day_card)

    add_block_button = day_card.find_element(
        By.XPATH,
        ".//button[contains(normalize-space(.), 'Add Block')]",
    )

    click_element(driver, add_block_button)
    demo_pause(1)

    time_inputs = day_card.find_elements(By.XPATH, ".//input[@type='time']")

    assert len(time_inputs) >= 2, f"Expected start/end time inputs for {day_name}."

    start_input = time_inputs[-2]
    end_input = time_inputs[-1]

    set_react_value(driver, start_input, start_time)
    set_react_value(driver, end_input, end_time)

    demo_pause(1)


def complete_client_skill_format_price_availability_step(driver):
    assert_page_contains(
        driver,
        [
            "who do you coach",
            "client skill",
            "session format",
            "coaching price",
            "weekly availability",
        ],
    )

    select_requested_cards_or_fallback(
        driver,
        CLIENT_SKILL_LEVELS,
        fallback_count=2,
    )

    session_format_selected = click_card_or_button_by_text(driver, SESSION_FORMAT)

    if not session_format_selected:
        session_format_selected = click_card_or_button_by_text(driver, "Virtual / Online")

    assert session_format_selected, "Could not select a session format."

    fill_field_by_label_text(driver, "Price", COACHING_PRICE, tag="input")

    add_availability_block(driver, "Monday", "09:00", "10:00")
    add_availability_block(driver, "Tuesday", "11:00", "12:00")
    add_availability_block(driver, "Wednesday", "14:00", "15:00")

    click_next_like_button(driver)


def complete_credentials_step(driver):
    assert_page_contains(
        driver,
        ["credentials", "certification", "experience", "bio"],
    )

    fill_field_by_label_text(driver, "Number of Certifications", "1", tag="input")

    demo_pause(2)

    fill_field_by_label_text(driver, "Certification Name", CERTIFICATION_NAME, tag="input")
    fill_field_by_label_text(driver, "Provider Name", CERTIFICATION_PROVIDER, tag="input")
    fill_field_by_label_text(driver, "Description", CERTIFICATION_DESCRIPTION, tag="textarea")
    fill_field_by_label_text(driver, "Issued Date", "2024-01-01", tag="input")
    fill_field_by_label_text(driver, "Expires Date", "2028-01-01", tag="input")
    fill_field_by_label_text(
        driver,
        "Years of Coaching Experience",
        COACH_EXPERIENCE_YEARS,
        tag="input",
    )
    fill_field_by_label_text(driver, "Coaching Bio", COACH_BIO, tag="textarea")

    click_next_like_button(driver)


def submit_application_step(driver):
    assert_page_contains(
        driver,
        ["coach profile setup", "application", "review", "submit", "coach"],
    )

    click_submit_application(driver)

    assert_page_contains(
        driver,
        [
            "one more step",
            "client profile",
            "application was saved",
            "continue",
            "reviewed",
        ],
    )


def complete_coach_onboarding_flow(driver, base_url):
    """
    Full coach side of UC 11.1:
    Register coach account and submit coach application.
    """

    register_new_coach_account(driver, base_url)

    complete_specialties_step(driver)
    complete_secondary_specialties_step(driver)
    complete_client_skill_format_price_availability_step(driver)
    complete_credentials_step(driver)
    submit_application_step(driver)


# ------------------------------------------------------------
# Client onboarding after coach application helpers
# ------------------------------------------------------------

def click_one_more_step_continue_modal(driver):
    """
    Clicks Continue in the post-coach-application modal.
    """

    modal = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                "//*[@role='dialog' and .//*[contains(normalize-space(.), 'One more step')]]",
            )
        )
    )

    scroll_to_element(driver, modal)
    demo_pause(2)

    continue_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//*[@role='dialog' and .//*[contains(normalize-space(.), 'One more step')]]"
                "//button[contains(normalize-space(.), 'Continue')]",
            )
        )
    )

    click_element(driver, continue_button)
    wait_for_body(driver)
    demo_pause(3)

    assert_page_contains(
        driver,
        ["client profile setup", "goal", "continue"],
    )


def complete_client_goals_step(driver):
    assert_page_contains(
        driver,
        ["client profile setup", "goal"],
    )

    select_requested_cards_or_fallback(
        driver,
        CLIENT_ONBOARDING_GOALS,
        fallback_count=1,
    )

    click_next_like_button(driver)


def complete_client_profile_form_step(driver):
    """
    Fills basic profile info and selects an activity/skill level.
    This is intentionally flexible because labels may be slightly different.
    """

    assert_page_contains(
        driver,
        ["client profile setup", "height", "weight", "dob", "date of birth", "level"],
    )

    try_fill_field_by_label_or_placeholder(
        driver,
        ["height"],
        CLIENT_HEIGHT,
        tag="input",
    )

    try_fill_field_by_label_or_placeholder(
        driver,
        ["current weight", "weight"],
        CLIENT_WEIGHT,
        tag="input",
    )

    try_fill_field_by_label_or_placeholder(
        driver,
        ["weight goal", "goal weight", "target weight"],
        CLIENT_WEIGHT_GOAL,
        tag="input",
    )

    dob_filled = try_fill_field_by_label_or_placeholder(
        driver,
        ["date of birth", "dob", "birth"],
        CLIENT_DOB,
        tag="input",
    )

    if not dob_filled:
        try:
            date_input = WebDriverWait(driver, 3).until(
                EC.presence_of_element_located((By.XPATH, "//input[@type='date']"))
            )
            set_react_value(driver, date_input, CLIENT_DOB)
        except TimeoutException:
            pass

    click_card_or_button_by_text(driver, CLIENT_ACTIVITY_LEVEL, timeout=3)

    click_next_like_button(driver)


def complete_client_review_step(driver):
    assert_page_contains(
        driver,
        ["you're all set", "profile complete", "complete onboarding"],
    )

    click_button_by_text(driver, "Complete Onboarding")
    wait_for_body(driver)
    demo_pause(5)

    assert_page_contains(
        driver,
        [
            "home",
            "calendar",
            "nutrition",
            "find coaches",
            "messages",
            "dashboard",
            "client",
        ],
    )


def complete_client_onboarding_flow(driver):
    """
    Full client side of UC 11.1:
    Complete the required client onboarding after coach application submission.
    """

    click_one_more_step_continue_modal(driver)
    complete_client_goals_step(driver)
    complete_client_profile_form_step(driver)
    complete_client_review_step(driver)


# ------------------------------------------------------------
# Sign out and admin login helpers
# ------------------------------------------------------------

def sign_out_current_user(driver, base_url):
    """
    Clears the current coach/client auth state and goes directly to Sign In.

    This removes the extra navigation loop:
    sign in screen -> home screen -> sign in screen.
    """

    clear_auth_storage(driver)

    driver.get(f"{base_url}/signin")
    wait_for_body(driver)
    demo_pause(3)

    assert_page_contains(
        driver,
        ["sign in", "email", "password"],
    )


def login_as_admin(driver, base_url):
    """
    Logs in as Liam/admin.
    """

    login(driver, base_url, ADMIN_EMAIL, ADMIN_PASSWORD)

    if not page_contains_any(
        driver,
        ["admin", "dashboard", "accounts", "reports", "coach governance", "applications"],
    ):
        driver.get(f"{base_url}/admin")
        wait_for_body(driver)
        demo_pause(4)

    assert_page_contains(
        driver,
        ["admin", "dashboard", "accounts", "reports", "coach", "applications"],
    )


# ------------------------------------------------------------
# Admin approval helpers
# ------------------------------------------------------------

def open_admin_coach_governance_page(driver, base_url):
    """
    Opens the admin coach governance page where the application roster lives.
    """

    driver.get(f"{base_url}/admin/coach-governance/")
    wait_for_body(driver)
    demo_pause(5)

    assert_page_contains(
        driver,
        [
            "coach applications",
            "application roster",
            "pending",
            "approved",
            "rejected",
            "application action panel",
        ],
    )


def refresh_admin_coach_governance_page(driver, base_url):
    """
    Refreshes the admin coach governance page without logging out or logging back in.
    """

    if "/admin/coach-governance" not in driver.current_url:
        driver.get(f"{base_url}/admin/coach-governance/")
    else:
        driver.refresh()

    wait_for_body(driver)
    demo_pause(5)

    assert_page_contains(
        driver,
        [
            "coach applications",
            "application roster",
            "pending",
            "approved",
            "rejected",
        ],
    )


def click_pending_applications_filter(driver):
    """
    Clicks the Pending filter exactly.

    This prevents Selenium from accidentally using the Approved tab/filter
    while trying to approve a specific coach application.
    """

    pending_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//button["
                "translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'pending' "
                "or starts-with(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'pending ') "
                "or starts-with(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'pending(')"
                "]",
            )
        )
    )

    click_element(driver, pending_button)
    wait_for_body(driver)
    demo_pause(3)

    assert_page_contains(
        driver,
        ["application roster", "pending", "approve"],
    )


def click_approved_applications_filter(driver):
    """
    Clicks the Approved filter exactly.

    Important:
    This targets Approved, not Approve.
    """

    approved_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//button["
                "translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') = 'approved' "
                "or starts-with(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'approved ') "
                "or starts-with(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'approved(')"
                "]",
            )
        )
    )

    click_element(driver, approved_button)
    wait_for_body(driver)
    demo_pause(3)

    assert_page_contains(
        driver,
        ["application roster", "approved"],
    )


def search_for_new_coach_application(driver, search_value=None):
    """
    Uses the admin search box to narrow the application roster.

    Pending approval uses the generated email for precision.
    Final verification uses the coach name, then validates by generated email.
    """

    search_value = search_value or COACH_APPLICATION_EMAIL

    try:
        search_input = WebDriverWait(driver, 4).until(
            EC.presence_of_element_located(
                (
                    By.XPATH,
                    "//input[contains(translate(@placeholder, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'search') "
                    "or contains(translate(@placeholder, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'email') "
                    "or contains(translate(@placeholder, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'name') "
                    "or contains(translate(@placeholder, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'certification') "
                    "or contains(translate(@placeholder, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'description')]",
                )
            )
        )

        type_into_element(driver, search_input, search_value)
        wait_for_body(driver)
        demo_pause(3)

    except TimeoutException:
        print("\nNo admin application search box found. Continuing with exact roster lookup.\n")

    assert_page_contains(
        driver,
        [search_value],
    )


def get_application_roster_card(driver):
    """
    Returns the left-side Application roster card, not the right-side action panel.
    """

    return WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                "//*[normalize-space(.)='Application roster']"
                "/ancestor::div[contains(@class, 'card')][1]",
            )
        )
    )


def find_pending_card_inside_roster(driver):
    """
    Helper for WebDriverWait.

    Returns the matching pending card element when found, otherwise False.
    """

    try:
        roster = get_application_roster_card(driver)

        matching_email_nodes = roster.find_elements(
            By.XPATH,
            f".//*[normalize-space(.)='{COACH_APPLICATION_EMAIL}' "
            f"or contains(normalize-space(.), '{COACH_APPLICATION_EMAIL}')]",
        )

        for email_node in matching_email_nodes:
            candidate_cards = email_node.find_elements(
                By.XPATH,
                "./ancestor::div["
                "contains(@class, 'rounded') "
                "and .//button[normalize-space(.)='Approve' or .//span[normalize-space(.)='Approve']] "
                "and .//button[normalize-space(.)='Reject' or .//span[normalize-space(.)='Reject']]"
                "]",
            )

            for card in candidate_cards:
                if not card.is_displayed():
                    continue

                card_text = card.text.lower()

                has_email = COACH_APPLICATION_EMAIL.lower() in card_text
                has_pending_status = "status:" in card_text and "pending" in card_text
                has_exact_approve_button = len(
                    card.find_elements(
                        By.XPATH,
                        ".//button[normalize-space(.)='Approve' or .//span[normalize-space(.)='Approve']]",
                    )
                ) > 0

                if has_email and has_pending_status and has_exact_approve_button:
                    return card

        return False

    except (StaleElementReferenceException, TimeoutException):
        return False


def find_approved_card_inside_roster(driver):
    """
    Helper for WebDriverWait.

    Returns the matching approved card element when found, otherwise False.
    """

    try:
        roster = get_application_roster_card(driver)

        matching_email_nodes = roster.find_elements(
            By.XPATH,
            f".//*[normalize-space(.)='{COACH_APPLICATION_EMAIL}' "
            f"or contains(normalize-space(.), '{COACH_APPLICATION_EMAIL}')]",
        )

        for email_node in matching_email_nodes:
            candidate_cards = email_node.find_elements(
                By.XPATH,
                "./ancestor::div[contains(@class, 'rounded')][1]",
            )

            for card in candidate_cards:
                if not card.is_displayed():
                    continue

                card_text = card.text.lower()

                has_email = COACH_APPLICATION_EMAIL.lower() in card_text
                has_approved_status = "approved" in card_text

                if has_email and has_approved_status:
                    return card

        return False

    except (StaleElementReferenceException, TimeoutException):
        return False


def find_application_card_for_new_coach(driver):
    """
    Finds the exact pending application card for the coach account created in this test run.

    Important:
    This searches inside the Application roster only.
    It also requires Status: Pending so we do not accidentally grab approved/rejected cards.
    """

    print("\nFinding pending application card:")
    print(f"Coach name: {COACH_APPLICATION_NAME}")
    print(f"Coach email: {COACH_APPLICATION_EMAIL}\n")

    roster = get_application_roster_card(driver)
    scroll_to_element(driver, roster)
    demo_pause(1)

    application_card = WebDriverWait(driver, TIMEOUT).until(
        lambda current_driver: find_pending_card_inside_roster(current_driver)
    )

    scroll_to_element(driver, application_card)
    demo_pause(2)

    return application_card


def find_approved_application_card_for_new_coach(driver):
    """
    Finds the exact approved application card for the coach account created in this test run.
    """

    print("\nFinding approved application card:")
    print(f"Coach name: {COACH_APPLICATION_NAME}")
    print(f"Coach email: {COACH_APPLICATION_EMAIL}\n")

    roster = get_application_roster_card(driver)
    scroll_to_element(driver, roster)
    demo_pause(1)

    approved_card = WebDriverWait(driver, TIMEOUT).until(
        lambda current_driver: find_approved_card_inside_roster(current_driver)
    )

    scroll_to_element(driver, approved_card)
    demo_pause(2)

    return approved_card


def click_approve_on_application_card(driver, application_card):
    """
    Clicks Approve on the exact pending application card.

    This uses exact text 'Approve' and will not match the top-level 'Approved' filter tab.
    """

    approve_button = application_card.find_element(
        By.XPATH,
        ".//button[normalize-space(.)='Approve' or .//span[normalize-space(.)='Approve']]",
    )

    click_element(driver, approve_button)
    wait_for_body(driver)
    demo_pause(4)


def get_application_action_panel(driver):
    """
    Returns the right-side Application action panel card.

    Re-finds the panel each time to avoid stale references after React updates.
    """

    return WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                "//*[normalize-space(.)='Application action panel']"
                "/ancestor::div[contains(@class, 'card')][1]",
            )
        )
    )


def wait_for_application_action_panel_to_load_selected_coach(driver):
    """
    Waits until the action panel specifically shows the selected coach application.

    This prevents false positives where the page contains the email in the roster
    but the action panel still says 'No active application selection'.
    """

    def panel_has_selected_application(current_driver):
        try:
            panel = get_application_action_panel(current_driver)
            panel_text = panel.text.lower()

            return (
                COACH_APPLICATION_EMAIL.lower() in panel_text
                and "approve application" in panel_text
                and "admin note" in panel_text
                and "no active application selection" not in panel_text
            )

        except (StaleElementReferenceException, TimeoutException):
            return False

    WebDriverWait(driver, TIMEOUT).until(panel_has_selected_application)

    panel = get_application_action_panel(driver)
    scroll_to_element(driver, panel)
    demo_pause(2)

    return panel


def find_visible_textarea_inside_action_panel(driver):
    """
    Finds any visible textarea inside the action panel.
    """

    try:
        panel = get_application_action_panel(driver)

        textareas = panel.find_elements(By.XPATH, ".//textarea")

        for textarea in textareas:
            if textarea.is_displayed() and textarea.is_enabled():
                return textarea

        return False

    except (StaleElementReferenceException, TimeoutException):
        return False


def fill_admin_action_panel_note(driver):
    """
    Fills the admin note in the loaded Application action panel.
    """

    wait_for_application_action_panel_to_load_selected_coach(driver)

    note_box = WebDriverWait(driver, TIMEOUT).until(
        lambda current_driver: find_visible_textarea_inside_action_panel(current_driver)
    )

    type_into_element(driver, note_box, ADMIN_APPROVAL_NOTE)

    assert ADMIN_APPROVAL_NOTE.lower() in (
        note_box.get_attribute("value") or ""
    ).lower()


def confirm_admin_application_action(driver):
    """
    Clicks Confirm action inside the loaded Application action panel.
    """

    panel = wait_for_application_action_panel_to_load_selected_coach(driver)

    confirm_button = panel.find_element(
        By.XPATH,
        ".//button[normalize-space(.)='Confirm action']",
    )

    click_element(driver, confirm_button)
    wait_for_body(driver)
    demo_pause(5)

    assert_page_contains(
        driver,
        [
            "approved",
            "application roster",
            "coach governance",
            COACH_APPLICATION_EMAIL,
        ],
    )


def admin_accept_coach_application(driver, base_url):
    """
    Admin side of UC 11.1:
    Open coach governance, force Pending filter, search the new coach,
    approve the exact pending card, fill admin note, and confirm.
    """

    open_admin_coach_governance_page(driver, base_url)

    click_pending_applications_filter(driver)

    search_for_new_coach_application(driver, search_value=COACH_APPLICATION_EMAIL)

    application_card = find_application_card_for_new_coach(driver)

    click_approve_on_application_card(driver, application_card)

    fill_admin_action_panel_note(driver)

    confirm_admin_application_action(driver)


def admin_verify_approved_coach_application(driver, base_url):
    """
    Final admin verification:
    Same Liam admin session stays active.
    Refresh the page, click Approved tab, search the coach name,
    and verify that the accepted account appears in the Approved roster.
    """

    refresh_admin_coach_governance_page(driver, base_url)

    click_approved_applications_filter(driver)

    search_for_new_coach_application(driver, search_value=COACH_APPLICATION_NAME)

    approved_card = find_approved_application_card_for_new_coach(driver)

    assert COACH_APPLICATION_EMAIL.lower() in approved_card.text.lower()
    assert "approved" in approved_card.text.lower()

    demo_pause(4)


# ------------------------------------------------------------
# Test
# ------------------------------------------------------------

@pytest.mark.kevin
@pytest.mark.application
def test_uc_11_1_new_coach_application_full_admin_approval(driver, base_url):
    """
    UC 11.1 full flow:

    1. Register a new coach.
    2. Complete coach application.
    3. Complete required client onboarding.
    4. Go directly to Sign In.
    5. Login as admin Liam.
    6. Approve the newly submitted coach application.
    7. Refresh the admin page.
    8. Check the Approved tab and verify the same accepted account appears.
    """

    complete_coach_onboarding_flow(driver, base_url)

    complete_client_onboarding_flow(driver)

    sign_out_current_user(driver, base_url)

    login_as_admin(driver, base_url)

    admin_accept_coach_application(driver, base_url)

    admin_verify_approved_coach_application(driver, base_url)

    demo_pause(5)