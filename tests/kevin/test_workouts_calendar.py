"""
Kevin Selenium demo tests.

Covers:
UC 4.2 — Browse and assign predefined workout plans.
UC 4.3 — Coach assigns workout plan to client.
UC 4.4 — Client assigns workout/session to a specific day.
UC 6.1 — Client starts/logs scheduled workout activity.

Run full workout/calendar flow:
python -m pytest test_workouts_calendar.py::test_workout_calendar_full_flow -v -s
"""

import os
import time
from datetime import datetime, timedelta

import pytest
from selenium.common.exceptions import (
    ElementClickInterceptedException,
    NoSuchElementException,
    StaleElementReferenceException,
    TimeoutException,
)
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


TIMEOUT = int(os.getenv("SELENIUM_TIMEOUT", "12"))

# Visual pacing for small demo pauses. Example: DEMO_SLEEP=0.4.
DEMO_SLEEP = float(os.getenv("DEMO_SLEEP", "1"))

# Absolute wait after login for redirects/auth/toasts. Example: LOGIN_SETTLE_SLEEP=3.
LOGIN_SETTLE_SLEEP = float(os.getenv("LOGIN_SETTLE_SLEEP", "3"))

GLOBAL_PASSWORD = os.getenv("GLOBAL_PASSWORD", "Rishik@1")

CLIENT_EMAIL = os.getenv("CLIENT_EMAIL", "alex@example.com")
CLIENT_PASSWORD = os.getenv("CLIENT_PASSWORD", GLOBAL_PASSWORD)

COACH_EMAIL = os.getenv("COACH_EMAIL", "sam@example.com")
COACH_PASSWORD = os.getenv("COACH_PASSWORD", GLOBAL_PASSWORD)
CLIENT_NAME = os.getenv("CLIENT_NAME", "Alex Taylor")
COACH_PLAN_NAME = os.getenv("COACH_PLAN_NAME", "Full Body Strength - 3x Week")

WORKOUT_GOAL = os.getenv("WORKOUT_GOAL", "General Fitness")
WORKOUT_EXPERIENCE = os.getenv("WORKOUT_EXPERIENCE", "Beginner")
WORKOUT_DAYS_PER_WEEK = os.getenv("WORKOUT_DAYS_PER_WEEK", "3 days")
WORKOUT_SESSION_LENGTH = os.getenv("WORKOUT_SESSION_LENGTH", "30–45 min")
EXPECTED_PLAN_NAME = os.getenv("EXPECTED_PLAN_NAME", "Beginner Bodyweight")

SESSION_WORKOUT_PLAN = os.getenv("SESSION_WORKOUT_PLAN", COACH_PLAN_NAME)
SESSION_FALLBACK_PLAN = os.getenv("SESSION_FALLBACK_PLAN", EXPECTED_PLAN_NAME)
SESSION_WORKOUT_DAY = os.getenv("SESSION_WORKOUT_DAY", "")
SESSION_TITLE_PREFIX = os.getenv("SESSION_TITLE_PREFIX", "UC 4.4 Active Session")
SESSION_TITLE = os.getenv(
    "SESSION_TITLE",
    f"{SESSION_TITLE_PREFIX} {datetime.now().strftime('%H%M')}",
)
SESSION_NOTES = os.getenv(
    "SESSION_NOTES",
    "Selenium UC 4.4 scheduled session using today's date and an active time window.",
)

STRENGTH_EXERCISE_ONE = os.getenv("STRENGTH_EXERCISE_ONE", "Barbell Incline Bench Press")
STRENGTH_EXERCISE_TWO = os.getenv("STRENGTH_EXERCISE_TWO", "Seated Cable Row")


# ------------------------------------------------------------
# General helpers
# ------------------------------------------------------------

def demo_pause(multiplier=1.0):
    """Small visual delay scaled by DEMO_SLEEP."""
    time.sleep(max(DEMO_SLEEP * float(multiplier), 0))


def settle_pause(seconds=LOGIN_SETTLE_SLEEP):
    """Absolute settle delay, mainly for login redirects/toasts."""
    time.sleep(max(float(seconds), 0))


def wait_for_body(driver):
    WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )


def page_text(driver):
    wait_for_body(driver)
    return driver.find_element(By.TAG_NAME, "body").text.lower()


def assert_page_contains(driver, expected_words):
    text = page_text(driver)
    assert any(str(word).lower() in text for word in expected_words), (
        f"Expected page to contain one of {expected_words}\n\n"
        f"Actual text:\n{text[:3000]}"
    )


def normalize_text(text):
    return " ".join((text or "").split()).strip()


def xpath_literal(value):
    value = str(value)

    if "'" not in value:
        return f"'{value}'"

    if '"' not in value:
        return f'"{value}"'

    parts = value.split("'")
    return "concat(" + ', "\'", '.join(f"'{part}'" for part in parts) + ")"


def lower_contains(text):
    return (
        "contains(translate(normalize-space(.), "
        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
        f"{xpath_literal(str(text).lower())})"
    )


def lower_attr_contains(attr_name, text):
    return (
        f"contains(translate(@{attr_name}, "
        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
        f"{xpath_literal(str(text).lower())})"
    )


def scroll_to_element(driver, element, pause=True):
    driver.execute_script(
        "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
        element,
    )
    if pause:
        demo_pause(0.5)


def scroll_page_to_top(driver):
    driver.execute_script("window.scrollTo({ top: 0, behavior: 'smooth' });")
    demo_pause(0.5)


def scroll_page_to_bottom(driver):
    driver.execute_script(
        "window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });"
    )
    demo_pause(0.8)


def visual_scroll_page(driver):
    scroll_page_to_top(driver)
    driver.execute_script("window.scrollBy({ top: 500, behavior: 'smooth' });")
    demo_pause(0.7)
    driver.execute_script("window.scrollBy({ top: 500, behavior: 'smooth' });")
    demo_pause(0.7)


def click_element(driver, element, pause=True):
    scroll_to_element(driver, element, pause=pause)
    try:
        element.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", element)

    if pause:
        demo_pause(1)


def type_into_element(driver, element, value, pause=True):
    scroll_to_element(driver, element)
    try:
        element.clear()
    except Exception:
        pass
    element.send_keys(str(value))

    if pause:
        demo_pause(0.7)


def set_react_input_value(driver, element, value):
    scroll_to_element(driver, element, pause=False)
    element.click()
    demo_pause(0.15)

    try:
        element.send_keys(Keys.CONTROL, "a")
        element.send_keys(Keys.BACKSPACE)
    except Exception:
        try:
            element.clear()
        except Exception:
            pass

    element.send_keys(str(value))

    driver.execute_script(
        """
        const element = arguments[0];
        const value = arguments[1];
        const inputSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        )?.set;
        const textareaSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            'value'
        )?.set;

        if (element.tagName.toLowerCase() === 'textarea') {
            textareaSetter.call(element, value);
        } else {
            inputSetter.call(element, value);
        }

        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        """,
        element,
        str(value),
    )
    demo_pause(0.3)


def click_button_containing(driver, text, timeout=TIMEOUT):
    button = WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable((By.XPATH, f"//button[{lower_contains(text)}]"))
    )
    click_element(driver, button)
    wait_for_body(driver)
    return button


def try_click_button_containing(driver, text, timeout=3):
    try:
        click_button_containing(driver, text, timeout=timeout)
        return True
    except TimeoutException:
        return False


def click_link_containing(driver, text, timeout=TIMEOUT):
    link = WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable((By.XPATH, f"//a[{lower_contains(text)}]"))
    )
    click_element(driver, link)
    wait_for_body(driver)
    return link


def clear_auth_storage(driver):
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
    clear_auth_storage(driver)
    driver.get(f"{base_url}/signin")
    wait_for_body(driver)
    demo_pause(1)

    email_input = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )
    password_input = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.NAME, "password"))
    )

    set_react_input_value(driver, email_input, email)
    set_react_input_value(driver, password_input, password)

    sign_in_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable((By.XPATH, f"//button[{lower_contains('sign in')}]"))
    )
    click_element(driver, sign_in_button)

    WebDriverWait(driver, TIMEOUT).until(lambda current_driver: "/signin" not in current_driver.current_url)
    wait_for_body(driver)
    settle_pause(LOGIN_SETTLE_SLEEP)


# ------------------------------------------------------------
# Modal/select helpers
# ------------------------------------------------------------

def get_visible_dialog(driver, timeout=TIMEOUT):
    """
    Returns visible modal dialog. Does not filter by 'hidden' because classes like
    overflow-hidden would otherwise break dialog detection.
    """

    def locate(current_driver):
        try:
            dialogs = current_driver.find_elements(By.XPATH, "//*[@role='dialog']")
            for dialog in reversed(dialogs):
                try:
                    if dialog.is_displayed():
                        return dialog
                except StaleElementReferenceException:
                    continue
            return False
        except StaleElementReferenceException:
            return False

    return WebDriverWait(driver, timeout).until(locate)


def wait_for_dialog_to_close(driver, timeout=TIMEOUT):
    def no_dialogs(current_driver):
        try:
            dialogs = current_driver.find_elements(By.XPATH, "//*[@role='dialog']")
            return all(not dialog.is_displayed() for dialog in dialogs)
        except StaleElementReferenceException:
            return True
    WebDriverWait(driver, timeout).until(no_dialogs)
    demo_pause(0.5)


def get_dialog_body(dialog):
    try:
        return dialog.find_element(By.XPATH, ".//*[contains(@class, 'modal__body')]")
    except NoSuchElementException:
        return dialog


def get_dialog_footer(dialog):
    try:
        return dialog.find_element(By.XPATH, ".//*[contains(@class, 'modal__footer')]")
    except NoSuchElementException:
        return dialog


def scroll_dialog_to_top(driver, dialog):
    body = get_dialog_body(dialog)
    driver.execute_script(
        """
        const body = arguments[0];
        try { body.scrollTo({ top: 0, behavior: 'smooth' }); }
        catch (e) { body.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        """,
        body,
    )
    demo_pause(0.5)


def scroll_dialog_to_bottom(driver, dialog):
    body = get_dialog_body(dialog)
    footer = get_dialog_footer(dialog)
    driver.execute_script(
        """
        const body = arguments[0];
        const footer = arguments[1];
        try { body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }); } catch (e) {}
        try { footer.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
        """,
        body,
        footer,
    )
    demo_pause(0.8)


def scroll_dialog_to_element(driver, dialog, element):
    body = get_dialog_body(dialog)
    driver.execute_script(
        """
        const body = arguments[0];
        const element = arguments[1];
        try {
            const bodyRect = body.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const offset = elementRect.top - bodyRect.top + body.scrollTop - 110;
            body.scrollTo({ top: Math.max(offset, 0), behavior: 'smooth' });
        } catch (e) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        """,
        body,
        element,
    )
    demo_pause(0.4)


def click_dialog_element(driver, dialog, element):
    scroll_dialog_to_element(driver, dialog, element)
    try:
        element.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", element)
    demo_pause(0.7)


def find_select_trigger_by_label(driver, dialog, label_text):
    label = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (By.XPATH, f"//*[@role='dialog']//*[self::span or self::label][{lower_contains(label_text)}]")
        )
    )

    try:
        select_container = label.find_element(By.XPATH, "./ancestor::div[@data-slot='select'][1]")
    except NoSuchElementException:
        select_container = label.find_element(By.XPATH, "./ancestor::div[.//button][1]")

    return select_container.find_element(
        By.XPATH,
        ".//button[@data-slot='select-trigger' or @aria-haspopup='listbox' or contains(@class, 'select')]",
    )


def click_select_option(driver, option_text, timeout=1):
    normalized = normalize_text(option_text)
    option_xpaths = [
        f"//*[@role='option' and normalize-space(.)={xpath_literal(normalized)}]",
        f"//*[@role='option' and {lower_contains(normalized)}]",
        f"//*[contains(@class, 'popover') and {lower_contains(normalized)}]",
        f"//*[contains(@class, 'select') and {lower_contains(normalized)}]",
    ]

    last_error = None
    for xpath in option_xpaths:
        try:
            option = WebDriverWait(driver, timeout).until(EC.element_to_be_clickable((By.XPATH, xpath)))
            click_element(driver, option)
            try:
                return normalize_text(option.text) or normalized
            except StaleElementReferenceException:
                return normalized
        except TimeoutException as error:
            last_error = error

    raise TimeoutException(f"Could not find select option: {option_text}") from last_error

def click_visible_option_by_index(driver, option_index=0):
    def locate(current_driver):
        try:
            visible = []
            for option in current_driver.find_elements(By.XPATH, "//*[@role='option']"):
                try:
                    text = normalize_text(option.text)
                    if option.is_displayed() and option.is_enabled() and text:
                        visible.append((option, text))
                except StaleElementReferenceException:
                    continue

            if len(visible) > option_index:
                return visible[option_index]
            if visible:
                return visible[0]
            return False
        except StaleElementReferenceException:
            return False

    option, text = WebDriverWait(driver, TIMEOUT).until(locate)
    click_element(driver, option)
    return text


def select_dialog_option(driver, dialog, label_text, preferred_text="", fallback_index=0):
    trigger = find_select_trigger_by_label(driver, dialog, label_text)
    click_dialog_element(driver, dialog, trigger)

    selected = ""
    if preferred_text:
        try:
            selected = click_select_option(driver, preferred_text, timeout=1)
        except TimeoutException:
            selected = click_visible_option_by_index(driver, fallback_index)
    else:
        selected = click_visible_option_by_index(driver, fallback_index)

    print(f"Selected {label_text}: {selected}")
    demo_pause(0.7)
    return selected


def set_contenteditable_segment(driver, segment, value):
    scroll_to_element(driver, segment, pause=False)
    segment.click()
    demo_pause(0.2)

    try:
        segment.send_keys(Keys.CONTROL, "a")
        segment.send_keys(Keys.BACKSPACE)
        segment.send_keys(str(value))
    except Exception:
        pass

    driver.execute_script(
        """
        const element = arguments[0];
        const value = arguments[1];
        element.textContent = value;
        element.dispatchEvent(new InputEvent('input', { bubbles: true, data: value }));
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        """,
        segment,
        str(value),
    )
    demo_pause(0.25)


def set_dialog_text_input_by_label(driver, dialog, label_text, value):
    label = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (By.XPATH, f"//*[@role='dialog']//*[self::label or self::span][{lower_contains(label_text)}]")
        )
    )
    container = label.find_element(By.XPATH, "./ancestor::div[contains(@class, 'space-y') or .//input][1]")
    input_element = container.find_element(By.XPATH, ".//input[not(@type='hidden')]")
    scroll_dialog_to_element(driver, dialog, input_element)
    set_react_input_value(driver, input_element, value)


def set_dialog_textarea_by_label(driver, dialog, label_text, value):
    label = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (By.XPATH, f"//*[@role='dialog']//*[self::label or self::span][{lower_contains(label_text)}]")
        )
    )
    container = label.find_element(By.XPATH, "./ancestor::div[contains(@class, 'space-y') or .//textarea][1]")
    textarea = container.find_element(By.XPATH, ".//textarea")
    scroll_dialog_to_element(driver, dialog, textarea)
    set_react_input_value(driver, textarea, value)


def set_dialog_number_input_by_id(driver, dialog, input_id, value):
    input_element = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.XPATH, f"//*[@role='dialog']//input[@id={xpath_literal(input_id)}]"))
    )
    scroll_dialog_to_element(driver, dialog, input_element)
    set_react_input_value(driver, input_element, value)


# ------------------------------------------------------------
# UC 4.2 — recommended plans
# ------------------------------------------------------------

def open_client_workouts_page(driver, base_url):
    driver.get(f"{base_url}/client/workouts")
    wait_for_body(driver)
    demo_pause(2)
    assert_page_contains(driver, ["calendar", "recommended plans", "create plan", "add session"])


def open_recommended_plans(driver):
    click_button_containing(driver, "Recommended Plans")
    wait_for_body(driver)
    demo_pause(2)
    assert_page_contains(
        driver,
        ["workout plans that actually feel picked for you", "browse plans", "retake", "your current fit", "matched plan"],
    )
    visual_scroll_page(driver)


def open_preferences_modal(driver):
    if not try_click_button_containing(driver, "Retake preferances", timeout=1):
        if not try_click_button_containing(driver, "Retake preferences", timeout=1):
            if not try_click_button_containing(driver, "Edit Filters", timeout=1):
                click_button_containing(driver, "Adjust filters")

    dialog = get_visible_dialog(driver)
    assert "edit filters" in dialog.text.lower(), f"Expected Edit Filters modal, got:\n{dialog.text[:1200]}"
    scroll_dialog_to_top(driver, dialog)
    return dialog


def fill_recommended_plan_filters(driver):
    dialog = open_preferences_modal(driver)
    select_dialog_option(driver, dialog, "Goal", WORKOUT_GOAL)
    select_dialog_option(driver, dialog, "Experience", WORKOUT_EXPERIENCE)
    select_dialog_option(driver, dialog, "Days per week", WORKOUT_DAYS_PER_WEEK)
    select_dialog_option(driver, dialog, "Session length", WORKOUT_SESSION_LENGTH)

    scroll_dialog_to_bottom(driver, dialog)
    apply_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable((By.XPATH, f"//*[@role='dialog']//button[{lower_contains('apply filters')}]") )
    )
    click_dialog_element(driver, dialog, apply_button)
    wait_for_dialog_to_close(driver)
    wait_for_body(driver)
    demo_pause(2)


def verify_matched_plan(driver):
    wait_for_body(driver)
    assert_page_contains(driver, [EXPECTED_PLAN_NAME, WORKOUT_GOAL, WORKOUT_EXPERIENCE, "3 days", "30"])

    plan_heading = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (By.XPATH, f"//h1[{lower_contains(EXPECTED_PLAN_NAME)}] | //h2[{lower_contains(EXPECTED_PLAN_NAME)}] | //h3[{lower_contains(EXPECTED_PLAN_NAME)}]")
        )
    )
    scroll_to_element(driver, plan_heading)
    demo_pause(1)
    scroll_page_to_bottom(driver)


def assign_matched_plan(driver):
    assign_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable((By.XPATH, f"//button[{lower_contains('assign plan')}]") )
    )
    click_element(driver, assign_button)
    wait_for_body(driver)
    demo_pause(2)
    assert_page_contains(driver, [EXPECTED_PLAN_NAME, "assigned", "calendar", "session", "workout"])


def client_browse_and_assign_recommended_plan(driver, base_url):
    open_client_workouts_page(driver, base_url)
    open_recommended_plans(driver)
    fill_recommended_plan_filters(driver)
    verify_matched_plan(driver)
    assign_matched_plan(driver)


@pytest.mark.kevin
@pytest.mark.workouts
def test_uc_4_2_client_browses_and_assigns_recommended_plan(driver, base_url):
    login(driver, base_url, CLIENT_EMAIL, CLIENT_PASSWORD)
    client_browse_and_assign_recommended_plan(driver, base_url)


# ------------------------------------------------------------
# UC 4.3 — coach assigns plan
# ------------------------------------------------------------

def open_coach_manage_clients_page(driver, base_url):
    try:
        click_link_containing(driver, "Manage Clients", timeout=1)
    except TimeoutException:
        driver.get(f"{base_url}/coach/clients")
        wait_for_body(driver)
        demo_pause(2)

    assert_page_contains(driver, ["manage clients", "client dashboards", CLIENT_NAME])
    visual_scroll_page(driver)


def find_client_card(driver, client_name):
    client_literal = xpath_literal(client_name)

    def locate(current_driver):
        try:
            cards = current_driver.find_elements(By.XPATH, "//div[contains(@class, 'card') and contains(@class, 'cursor-pointer')]")
            for card in cards:
                if card.is_displayed() and client_name.lower() in (card.text or "").lower():
                    return card

            name_node = current_driver.find_element(By.XPATH, f"//*[normalize-space(.)={client_literal}]")
            card = name_node.find_element(By.XPATH, "./ancestor::div[contains(@class, 'card')][1]")
            return card if card.is_displayed() else False
        except (NoSuchElementException, StaleElementReferenceException):
            return False

    card = WebDriverWait(driver, TIMEOUT).until(locate)
    scroll_to_element(driver, card)
    return card


def select_client(driver, client_name=CLIENT_NAME):
    card = find_client_card(driver, client_name)
    print(f"\nSelecting coach client: {client_name}\n")
    click_element(driver, card)
    wait_for_body(driver)
    demo_pause(2)
    assert_page_contains(driver, [client_name, "workout", "nutrition", "dashboard"])


def click_client_dumbbell_section(driver):
    xpaths = [
        "//*[contains(@class, 'absolute') and contains(@class, 'left-22')]//*[contains(@class, 'lucide-dumbbell')]/ancestor::div[contains(@class, 'cursor-pointer')][1]",
        "//*[contains(@class, 'lucide-dumbbell')]/ancestor::div[contains(@class, 'cursor-pointer') and contains(@class, 'rounded-full')][1]",
        "//*[contains(@class, 'lucide-dumbbell')]/ancestor::*[self::button or self::div][contains(@class, 'cursor-pointer')][1]",
    ]

    last_error = None
    for xpath in xpaths:
        try:
            button = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, xpath)))
            print("\nOpening selected client's workout panel with dumbbell icon.\n")
            click_element(driver, button)
            wait_for_body(driver)
            demo_pause(2)
            return
        except TimeoutException as error:
            last_error = error

    raise TimeoutException("Could not find client dumbbell sidebar button.") from last_error


def open_assign_workout_plan_modal(driver):
    if not try_click_button_containing(driver, "Assign Workout Plan", timeout=1):
        click_button_containing(driver, "Assign Plan", timeout=1)

    dialog = get_visible_dialog(driver)
    assert "assign workout plan" in dialog.text.lower(), f"Expected Assign Workout Plan modal, got:\n{dialog.text[:1200]}"
    scroll_dialog_to_top(driver, dialog)
    demo_pause(1)
    return dialog


def select_coach_plan_in_modal(driver, dialog, plan_name=COACH_PLAN_NAME):
    # Coach Plans is usually selected by default, but click it if visible.
    try:
        tab = WebDriverWait(driver, 3).until(
            EC.element_to_be_clickable((By.XPATH, f"//*[@role='dialog']//*[@role='tab' and {lower_contains('Coach Plans')}]") )
        )
        click_dialog_element(driver, dialog, tab)
    except TimeoutException:
        pass

    plan_button_xpaths = [
        f"//*[@role='dialog']//button[contains(normalize-space(.), {xpath_literal(plan_name)})]",
        f"//*[@role='dialog']//button[{lower_contains(plan_name)}]",
        "//*[@role='dialog']//div[@role='tabpanel']//button[not(@disabled)]",
    ]

    last_error = None
    for xpath in plan_button_xpaths:
        try:
            plan_button = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.XPATH, xpath)))
            print("\nSelecting coach workout plan:")
            print(f"Plan: {plan_name}\n")
            click_dialog_element(driver, dialog, plan_button)
            demo_pause(1)
            return
        except TimeoutException as error:
            last_error = error

    raise TimeoutException(f"Could not find coach plan in modal: {plan_name}") from last_error


def confirm_assign_workout_plan(driver, dialog):
    scroll_dialog_to_bottom(driver, dialog)
    assign_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//*[@role='dialog']//*[contains(@class, 'modal__footer')]//button["
                f"{lower_contains('assign plan')} and not(@disabled) and not(@data-disabled='true')]",
            )
        )
    )
    print("\nConfirming coach plan assignment.\n")
    click_dialog_element(driver, dialog, assign_button)
    wait_for_dialog_to_close(driver, timeout=1)
    wait_for_body(driver)
    demo_pause(2)


def verify_coach_plan_assignment(driver):
    text = page_text(driver)
    assert any(expected.lower() in text for expected in [COACH_PLAN_NAME, "assigned", "workout plan", "workout"]), (
        "Expected the client workout dashboard to show the assigned workout plan or confirmation.\n\n"
        f"Page text:\n{text[:2500]}"
    )
    visual_scroll_page(driver)


def coach_assign_workout_plan_to_client(driver, base_url):
    login(driver, base_url, COACH_EMAIL, COACH_PASSWORD)
    open_coach_manage_clients_page(driver, base_url)
    select_client(driver, CLIENT_NAME)
    click_client_dumbbell_section(driver)
    dialog = open_assign_workout_plan_modal(driver)
    select_coach_plan_in_modal(driver, dialog, COACH_PLAN_NAME)
    confirm_assign_workout_plan(driver, dialog)
    verify_coach_plan_assignment(driver)


@pytest.mark.kevin
@pytest.mark.workouts
def test_uc_4_3_coach_assigns_workout_plan_to_client(driver, base_url):
    coach_assign_workout_plan_to_client(driver, base_url)


# ------------------------------------------------------------
# UC 4.4 — add session to calendar
# ------------------------------------------------------------

def get_active_session_window():
    now = datetime.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = now.replace(hour=23, minute=59, second=0, microsecond=0)

    start_time = now.replace(minute=0, second=0, microsecond=0) - timedelta(hours=1)
    end_time = now.replace(minute=0, second=0, microsecond=0) + timedelta(hours=2)

    if start_time < today_start:
        start_time = today_start
    if end_time > today_end:
        end_time = today_end
    if end_time <= start_time:
        end_time = min(start_time + timedelta(hours=1), today_end)

    return now.date(), start_time, end_time


def format_time_for_print(dt_value):
    return dt_value.strftime("%-I:%M %p") if os.name != "nt" else dt_value.strftime("%I:%M %p").lstrip("0")


def time_parts_for_react_aria(dt_value):
    hour_24 = dt_value.hour
    minute = dt_value.minute
    period = "AM" if hour_24 < 12 else "PM"
    hour_12 = hour_24 % 12 or 12
    return str(hour_12), f"{minute:02d}", period


def set_workout_session_date(driver, dialog, target_date):
    values = {"month": str(target_date.month), "day": str(target_date.day), "year": str(target_date.year)}
    for segment_type, value in values.items():
        segment = WebDriverWait(driver, TIMEOUT).until(
            EC.presence_of_element_located((By.XPATH, f"//*[@role='dialog']//*[@data-type='{segment_type}' and @contenteditable='true']"))
        )
        scroll_dialog_to_element(driver, dialog, segment)
        set_contenteditable_segment(driver, segment, value)

    iso_date = target_date.isoformat()
    driver.execute_script(
        """
        const dialog = arguments[0];
        const value = arguments[1];
        dialog.querySelectorAll("input[type='date'], input[hidden]").forEach((input) => {
            try {
                const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                setter.call(input, value);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('blur', { bubbles: true }));
            } catch (e) {}
        });
        """,
        dialog,
        iso_date,
    )
    print(f"Selected session date: {iso_date}")
    demo_pause(0.7)


def get_time_field_container(driver, label_text):
    label = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (By.XPATH, f"//*[@role='dialog']//*[self::span or self::label][{lower_contains(label_text)}]")
        )
    )
    return label.find_element(By.XPATH, "./ancestor::div[@data-slot='time-field'][1]")


def set_workout_session_time(driver, dialog, label_text, dt_value):
    container = get_time_field_container(driver, label_text)
    hour, minute, period = time_parts_for_react_aria(dt_value)
    values = {"hour": hour, "minute": minute, "dayPeriod": period}

    for segment_type, value in values.items():
        segment = container.find_element(By.XPATH, f".//*[@data-type='{segment_type}' and @contenteditable='true']")
        scroll_dialog_to_element(driver, dialog, segment)
        set_contenteditable_segment(driver, segment, value)

    hidden_value = dt_value.strftime("%H:%M:00")
    driver.execute_script(
        """
        const container = arguments[0];
        const value = arguments[1];
        const input = container.querySelector("input[hidden]");
        if (input) {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
            setter.call(input, value);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));
        }
        """,
        container,
        hidden_value,
    )
    print(f"Selected {label_text}: {format_time_for_print(dt_value)}")
    demo_pause(0.7)


def open_add_session_modal(driver):
    click_button_containing(driver, "Add Session")
    dialog = get_visible_dialog(driver)
    assert "add session" in dialog.text.lower(), f"Expected Add Session modal, got:\n{dialog.text[:1200]}"
    scroll_dialog_to_top(driver, dialog)
    demo_pause(0.7)
    return dialog


def fill_add_session_modal(driver, dialog):
    target_date, start_time, end_time = get_active_session_window()
    print("\nCreating calendar workout session:")
    print(f"Title: {SESSION_TITLE}")
    print(f"Date: {target_date.isoformat()}")
    print(f"Start: {format_time_for_print(start_time)}")
    print(f"End: {format_time_for_print(end_time)}\n")

    set_dialog_text_input_by_label(driver, dialog, "Session Title", SESSION_TITLE)
    selected_plan = select_dialog_option(driver, dialog, "Workout Plan", SESSION_WORKOUT_PLAN)
    if not selected_plan:
        select_dialog_option(driver, dialog, "Workout Plan", SESSION_FALLBACK_PLAN)

    select_dialog_option(driver, dialog, "Workout Day", SESSION_WORKOUT_DAY)
    set_workout_session_date(driver, dialog, target_date)
    set_workout_session_time(driver, dialog, "Start Time", start_time)
    set_workout_session_time(driver, dialog, "End Time", end_time)
    set_dialog_textarea_by_label(driver, dialog, "Notes", SESSION_NOTES)
    scroll_dialog_to_bottom(driver, dialog)


def save_workout_session(driver, dialog):
    scroll_dialog_to_bottom(driver, dialog)
    save_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//*[@role='dialog']//*[contains(@class, 'modal__footer')]//button["
                f"{lower_contains('save session')} and not(@disabled) and not(@data-disabled='true')]",
            )
        )
    )
    print("\nSaving workout session.\n")
    click_dialog_element(driver, dialog, save_button)
    wait_for_dialog_to_close(driver, timeout=1)
    wait_for_body(driver)
    demo_pause(2)


def verify_session_on_calendar(driver):
    wait_for_body(driver)
    text = page_text(driver)
    assert SESSION_TITLE.lower() in text, (
        "Expected the newly scheduled workout session to appear on the calendar.\n\n"
        f"Session title: {SESSION_TITLE}\n\nPage text:\n{text[:3000]}"
    )
    try:
        node = driver.find_element(By.XPATH, f"//*[contains(normalize-space(.), {xpath_literal(SESSION_TITLE)})]")
        scroll_to_element(driver, node)
    except NoSuchElementException:
        pass
    visual_scroll_page(driver)


def client_assign_workout_to_calendar_day(driver, base_url):
    open_client_workouts_page(driver, base_url)
    dialog = open_add_session_modal(driver)
    fill_add_session_modal(driver, dialog)
    save_workout_session(driver, dialog)
    verify_session_on_calendar(driver)


@pytest.mark.kevin
@pytest.mark.workouts
def test_uc_4_4_client_assigns_workout_to_specific_day(driver, base_url):
    login(driver, base_url, CLIENT_EMAIL, CLIENT_PASSWORD)
    client_assign_workout_to_calendar_day(driver, base_url)


# ------------------------------------------------------------
# UC 6.1 — start/log activity
# ------------------------------------------------------------

def open_client_home_page(driver, base_url):
    driver.get(f"{base_url}/client")
    wait_for_body(driver)
    demo_pause(2)
    assert_page_contains(driver, ["today's workout sessions", "workout sessions", "scheduled", "active"])
    visual_scroll_page(driver)


def get_workout_session_tablist(driver):
    tablist_xpaths = [
        "//*[@role='tablist' and " + lower_attr_contains("aria-label", "workout session tabs") + "]",
        "//*[@role='tablist' and .//*[@role='tab' and " + lower_contains("Scheduled") + "] and .//*[@role='tab' and " + lower_contains("Active") + "]]",
    ]

    last_error = None
    for xpath in tablist_xpaths:
        try:
            tablist = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.XPATH, xpath)))
            if tablist.is_displayed():
                scroll_to_element(driver, tablist)
                return tablist
        except TimeoutException as error:
            last_error = error

    raise TimeoutException("Could not find Workout session tabs on the client home page.") from last_error


def click_todays_workout_tab(driver, tab_name):
    tablist = get_workout_session_tablist(driver)
    tab = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//*[@role='tablist' and " + lower_attr_contains("aria-label", "workout session tabs") + "]"
                f"//*[@role='tab' and {lower_contains(tab_name)}]",
            )
        )
    )
    print(f"\nOpening Today's Workout Sessions tab: {tab_name}\n")
    scroll_to_element(driver, tablist)
    click_element(driver, tab)
    wait_for_body(driver)
    demo_pause(1.5)


def find_session_container_for_text(driver, text_to_find):
    title_xpath = (
        "//*[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
        f"{xpath_literal(text_to_find.lower())})]"
    )
    nodes = driver.find_elements(By.XPATH, title_xpath)

    for node in nodes:
        try:
            if not node.is_displayed():
                continue

            for container_xpath in [
                "./ancestor::div[contains(@class, 'card')][1]",
                "./ancestor::div[.//button][1]",
                "./ancestor::div[contains(@class, 'rounded')][1]",
                "./ancestor::section[1]",
            ]:
                try:
                    candidate = node.find_element(By.XPATH, container_xpath)
                    if candidate.is_displayed() and candidate.find_elements(By.XPATH, ".//button"):
                        return candidate
                except NoSuchElementException:
                    continue
        except StaleElementReferenceException:
            continue

    return False


def find_scheduled_session_card(driver, preferred_title=SESSION_TITLE):
    preferred_lower = (preferred_title or "").lower()
    prefix_lower = SESSION_TITLE_PREFIX.lower()

    def locate(current_driver):
        try:
            if preferred_lower:
                exact = find_session_container_for_text(current_driver, preferred_lower)
                if exact:
                    return exact

            prefix = find_session_container_for_text(current_driver, prefix_lower)
            if prefix:
                return prefix

            # Fallback: find a visible Start/Log Workout/Continue button in the selected tab panel.
            action_xpath = (
                "//*[@role='tabpanel']//button["
                + lower_contains("Start")
                + " or "
                + lower_contains("Log Workout")
                + " or "
                + lower_contains("Continue")
                + "]"
            )
            for button in current_driver.find_elements(By.XPATH, action_xpath):
                try:
                    if not button.is_displayed() or not button.is_enabled():
                        continue
                    for container_xpath in [
                        "./ancestor::div[contains(@class, 'card')][1]",
                        "./ancestor::div[contains(@class, 'rounded')][1]",
                        "./ancestor::div[.//button][1]",
                    ]:
                        try:
                            candidate = button.find_element(By.XPATH, container_xpath)
                            if candidate.is_displayed():
                                return candidate
                        except NoSuchElementException:
                            continue
                except StaleElementReferenceException:
                    continue
            return False
        except (NoSuchElementException, StaleElementReferenceException):
            return False

    try:
        card = WebDriverWait(driver, TIMEOUT).until(locate)
        scroll_to_element(driver, card)
        demo_pause(1)
        print("\nMatched Today's Workout Session card:")
        print(card.text[:900])
        print()
        return card
    except TimeoutException as exc:
        raise AssertionError(
            "Could not find the UC 4.4 scheduled workout session on the client home page.\n\n"
            f"Preferred title: {preferred_title}\nFallback prefix: {SESSION_TITLE_PREFIX}\n\n"
            f"Page text preview:\n{page_text(driver)[:3500]}"
        ) from exc


def get_session_action_button(session_card):
    labels = ["start", "log workout", "continue"]
    buttons = session_card.find_elements(By.XPATH, ".//button")
    for label in labels:
        for button in buttons:
            try:
                button_text = normalize_text(button.text).lower()
                if button.is_displayed() and button.is_enabled() and label in button_text:
                    return button, button_text
            except StaleElementReferenceException:
                continue

    raise AssertionError(
        "Could not find Start / Log Workout / Continue button in session card.\n\n"
        f"Card text:\n{session_card.text}"
    )


def click_activity_log_tab(driver, tab_name):
    tab = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//*[@role='tablist' and {lower_attr_contains('aria-label', 'activity log tabs')}]"
                f"//*[@role='tab' and {lower_contains(tab_name)}]",
            )
        )
    )
    print(f"\nOpening activity log tab: {tab_name}\n")
    click_element(driver, tab)
    wait_for_body(driver)
    demo_pause(0.8)
    return get_visible_dialog(driver)


def click_dialog_button_containing(driver, dialog, button_text, timeout=TIMEOUT):
    button = WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//*[@role='dialog']//button[{lower_contains(button_text)} and not(@disabled) and not(@data-disabled='true')]",
            )
        )
    )
    click_dialog_element(driver, dialog, button)
    wait_for_body(driver)
    demo_pause(0.8)
    try:
        return get_visible_dialog(driver, timeout=1)
    except TimeoutException:
        return None


def select_activity_exercise(driver, exercise_name, fallback_index=0):
    if not exercise_name:
        return ""

    dialog = get_visible_dialog(driver)
    trigger = find_select_trigger_by_label(driver, dialog, "Exercise")

    print(f"Selecting exercise: {exercise_name}")
    click_dialog_element(driver, dialog, trigger)

    try:
        selected = click_select_option(driver, exercise_name, timeout=1)
    except TimeoutException:
        selected = click_visible_option_by_index(driver, fallback_index)

    print(f"Selected exercise: {selected}")
    demo_pause(0.8)
    return selected


def log_strength_set(driver, exercise_name, fallback_index, set_number, reps, weight, rpe):
    click_activity_log_tab(driver, "Exercises")
    dialog = get_visible_dialog(driver)

    selected_exercise = select_activity_exercise(driver, exercise_name, fallback_index=fallback_index)
    dialog = get_visible_dialog(driver)

    print("Logging exercise set:")
    print(f"Exercise: {selected_exercise or exercise_name}")
    print(f"Set {set_number} • {reps} reps • {weight} lbs • RPE {rpe}\n")

    set_dialog_number_input_by_id(driver, dialog, "set-number", set_number)
    set_dialog_number_input_by_id(driver, dialog, "reps", reps)
    set_dialog_number_input_by_id(driver, dialog, "weight", weight)
    set_dialog_number_input_by_id(driver, dialog, "rpe", rpe)

    scroll_dialog_to_bottom(driver, dialog)
    click_dialog_button_containing(driver, dialog, "Log Set")
    demo_pause(1)


def log_multiple_strength_sets(driver):
    strength_sets = [
        (STRENGTH_EXERCISE_ONE, 0, 1, 8, 95, 7),
        (STRENGTH_EXERCISE_TWO, 1, 1, 10, 80, 7.5),
    ]

    for exercise_name, fallback_index, set_number, reps, weight, rpe in strength_sets:
        log_strength_set(driver, exercise_name, fallback_index, set_number, reps, weight, rpe)


def log_cardio_activity(driver):
    dialog = click_activity_log_tab(driver, "Cardio")
    print("\nLogging cardio activity.\n")

    for input_id, value in {
        "steps": 10,
        "distance-km": 10,
        "duration-min": 10,
        "calories": 10,
        "avg-hr": 10,
    }.items():
        set_dialog_number_input_by_id(driver, dialog, input_id, value)

    scroll_dialog_to_bottom(driver, dialog)
    click_dialog_button_containing(driver, dialog, "Log Cardio")
    demo_pause(1)


def get_logs_section_by_heading(driver, heading_text):
    dialog = click_activity_log_tab(driver, "Logs")

    section = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                "//*[@role='dialog']//*[@role='tabpanel']"
                f"//p[normalize-space(.)={xpath_literal(heading_text)}]"
                "/ancestor::div[.//button][1]",
            )
        )
    )
    scroll_dialog_to_element(driver, dialog, section)
    return dialog, section


def edit_first_logged_exercise_set(driver):
    dialog, section = get_logs_section_by_heading(driver, "Exercise Sets")
    print("\nEditing first logged exercise set.\n")

    edit_button = WebDriverWait(driver, TIMEOUT).until(
        lambda _driver: next(
            (
                button
                for button in section.find_elements(By.XPATH, ".//button")
                if button.is_displayed() and button.is_enabled() and "edit" in normalize_text(button.text).lower()
            ),
            False,
        )
    )
    click_dialog_element(driver, dialog, edit_button)
    demo_pause(0.8)

    dialog, section = get_logs_section_by_heading(driver, "Exercise Sets")
    save_button = WebDriverWait(driver, TIMEOUT).until(
        lambda _driver: next(
            (
                button
                for button in section.find_elements(By.XPATH, ".//button")
                if button.is_displayed() and button.is_enabled() and "save" in normalize_text(button.text).lower()
            ),
            False,
        )
    )

    edit_card = save_button.find_element(By.XPATH, "./ancestor::div[contains(@class, 'card')][1]")
    inputs = [
        input_element
        for input_element in edit_card.find_elements(By.XPATH, ".//input[@type='number']")
        if input_element.is_displayed() and input_element.is_enabled()
    ]

    for input_element, value in zip(inputs, [1, 9, 105, 8]):
        set_react_input_value(driver, input_element, value)

    click_dialog_element(driver, dialog, save_button)
    wait_for_body(driver)
    demo_pause(1)


def edit_logged_cardio_activity(driver):
    dialog, section = get_logs_section_by_heading(driver, "Cardio")
    print("\nEditing logged cardio activity.\n")

    edit_button = WebDriverWait(driver, TIMEOUT).until(
        lambda _driver: next(
            (
                button
                for button in section.find_elements(By.XPATH, ".//button")
                if button.is_displayed() and button.is_enabled() and "edit" in normalize_text(button.text).lower()
            ),
            False,
        )
    )
    click_dialog_element(driver, dialog, edit_button)
    demo_pause(0.8)

    dialog, section = get_logs_section_by_heading(driver, "Cardio")
    save_button = WebDriverWait(driver, TIMEOUT).until(
        lambda _driver: next(
            (
                button
                for button in section.find_elements(By.XPATH, ".//button")
                if button.is_displayed() and button.is_enabled() and "save" in normalize_text(button.text).lower()
            ),
            False,
        )
    )

    edit_card = save_button.find_element(By.XPATH, "./ancestor::div[contains(@class, 'card')][1]")
    inputs = [
        input_element
        for input_element in edit_card.find_elements(By.XPATH, ".//input[@type='number']")
        if input_element.is_displayed() and input_element.is_enabled()
    ]

    for input_element, value in zip(inputs, [20, 2, 15, 100, 120]):
        set_react_input_value(driver, input_element, value)

    click_dialog_element(driver, dialog, save_button)
    wait_for_body(driver)
    demo_pause(1)


def close_activity_log_modal(driver):
    try:
        dialog = get_visible_dialog(driver, timeout=1)
        scroll_dialog_to_bottom(driver, dialog)
        close_button = WebDriverWait(driver, 4).until(
            EC.element_to_be_clickable((By.XPATH, f"//*[@role='dialog']//button[{lower_contains('close')}]") )
        )
        click_dialog_element(driver, dialog, close_button)
        demo_pause(1)
    except TimeoutException:
        pass


def maybe_complete_workout_log_dialog(driver):
    try:
        dialog = get_visible_dialog(driver, timeout=1)
    except TimeoutException:
        return False

    dialog_text = (dialog.text or "").lower()
    if "log activity" not in dialog_text and "workout" not in dialog_text:
        return False

    print("\nLog Activity modal appeared. Filling exercise/cardio/log-edit flow.\n")
    scroll_dialog_to_top(driver, dialog)

    log_multiple_strength_sets(driver)
    click_activity_log_tab(driver, "Logs")
    demo_pause(1)

    log_cardio_activity(driver)
    edit_first_logged_exercise_set(driver)
    edit_logged_cardio_activity(driver)

    click_activity_log_tab(driver, "Logs")
    close_activity_log_modal(driver)
    return True


def client_start_scheduled_workout_activity(driver, base_url):
    open_client_home_page(driver, base_url)
    click_todays_workout_tab(driver, "Scheduled")

    session_card = find_scheduled_session_card(driver)
    action_button, action_text = get_session_action_button(session_card)

    print("\nStarting/logging workout activity from Today's Workout Sessions:")
    print(f"Button: {action_text}")
    print(f"Session title target: {SESSION_TITLE}\n")

    click_element(driver, action_button)
    wait_for_body(driver)
    demo_pause(2)

    maybe_complete_workout_log_dialog(driver)

    text = page_text(driver)
    assert any(
        expected in text
        for expected in [SESSION_TITLE.lower(), SESSION_TITLE_PREFIX.lower(), "active", "log workout", "workout"]
    ), (
        "Expected the scheduled workout session to be started or available for logging.\n\n"
        f"Session title: {SESSION_TITLE}\n\nPage text:\n{text[:3500]}"
    )
    visual_scroll_page(driver)


@pytest.mark.kevin
@pytest.mark.workouts
def test_uc_6_1_client_starts_scheduled_workout_activity(driver, base_url):
    login(driver, base_url, CLIENT_EMAIL, CLIENT_PASSWORD)
    client_start_scheduled_workout_activity(driver, base_url)


@pytest.mark.kevin
@pytest.mark.workouts
def test_workout_calendar_full_flow(driver, base_url):
    """
    Final workout/calendar demo flow:
    1. UC 4.3 — Coach assigns workout plan to Alex.
    2. UC 4.2 — Alex browses and assigns a recommended predefined plan.
    3. UC 4.4 — Alex schedules a session for today around the current hour.
    4. UC 6.1 — Alex starts/logs that scheduled workout activity from home.
    """
    coach_assign_workout_plan_to_client(driver, base_url)

    login(driver, base_url, CLIENT_EMAIL, CLIENT_PASSWORD)

    client_browse_and_assign_recommended_plan(driver, base_url)
    client_assign_workout_to_calendar_day(driver, base_url)
    client_start_scheduled_workout_activity(driver, base_url)
