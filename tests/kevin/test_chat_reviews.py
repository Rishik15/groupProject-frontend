"""
Kevin Selenium demo tests.

Covers:
UC 8.1 — Chat with coach.

Flow:
1. Client Alex signs in.
2. Client opens Messages from the navbar.
3. Client selects Sam Nguyen from the contact list.
4. Client sends a Selenium message.
5. Selenium signs out/clears session.
6. Coach Sam signs in.
7. Coach opens Messages from the navbar.
8. Coach selects Alex Taylor from the contact list.
9. Coach verifies Alex's message was received.
10. Coach sends a response.

Known routes:
Login route: /signin
Client messages: /client/chat
Coach messages: /coach/chat
"""

import os
import time

import pytest
from selenium.common.exceptions import ElementClickInterceptedException, TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


TIMEOUT = 10
DEMO_SLEEP = float(os.getenv("DEMO_SLEEP", "1"))
LOGIN_SETTLE_SLEEP = float(os.getenv("LOGIN_SETTLE_SLEEP", "3"))

CLIENT_EMAIL = os.getenv("CLIENT_EMAIL", "alex@example.com")
CLIENT_PASSWORD = os.getenv("CLIENT_PASSWORD", "Rishik@1")

CHAT_COACH_EMAIL = os.getenv("CHAT_COACH_EMAIL", "sam@example.com")
CHAT_COACH_PASSWORD = os.getenv("CHAT_COACH_PASSWORD", "Rishik@1")

CLIENT_CONTACT_NAME = os.getenv("CLIENT_CONTACT_NAME", "Alex Taylor")
COACH_CONTACT_NAME = os.getenv("COACH_CONTACT_NAME", "Sam Nguyen")


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


def wait_until_page_contains(driver, expected_text):
    expected_text = expected_text.lower()

    WebDriverWait(driver, TIMEOUT).until(
        lambda d: expected_text in page_text(d)
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

    try:
        element.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", element)

    if pause:
        demo_pause()


def type_into_element(driver, element, value, pause=True):
    scroll_to_element(driver, element, pause=True)
    element.clear()
    element.send_keys(value)

    if pause:
        demo_pause()


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

    # Wait for redirects, auth state updates, and notifications/toasts to fade.
    settle_pause(LOGIN_SETTLE_SLEEP)


def clear_session(driver, base_url):
    """
    Clears local auth before logging into another role.
    """
    driver.get(base_url)
    wait_for_body(driver)

    driver.delete_all_cookies()
    driver.execute_script("window.localStorage.clear();")
    driver.execute_script("window.sessionStorage.clear();")

    demo_pause(1)


# ------------------------------------------------------------
# Chat helpers
# ------------------------------------------------------------

def click_messages_nav(driver, role):
    """
    Clicks Messages in either the client or coach navbar.

    role should be:
    - "client"
    - "coach"
    """

    if role == "client":
        href_piece = "/client/chat"
    elif role == "coach":
        href_piece = "/coach/chat"
    else:
        raise ValueError("role must be either 'client' or 'coach'")

    messages_link = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//a[contains(@href, '{href_piece}') "
                "and contains(normalize-space(.), 'Messages')]",
            )
        )
    )

    click_element(driver, messages_link)
    wait_for_body(driver)
    demo_pause(3)

    assert_page_contains(driver, ["messages", "search"])


def select_chat_contact(driver, contact_name):
    """
    Selects a contact from the left-side Messages contact list.
    """

    contact_card = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//*[contains(normalize-space(.), '{contact_name}')]"
                "/ancestor::div[contains(@class, 'flex') and contains(@class, 'gap-2')][1]",
            )
        )
    )

    click_element(driver, contact_card)
    wait_for_body(driver)
    demo_pause(3)

    assert_page_contains(driver, [contact_name])


def get_message_input(driver):
    return WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                "//input[contains(@placeholder, 'Type a message')]",
            )
        )
    )


def get_send_message_control(driver):
    """
    The send control is currently a div next to the message input, not a button.
    HTML structure:
    <input placeholder="Type a message..." />
    <div class="p-2 rounded-lg ...">
        <svg class="lucide-send" />
    </div>
    """

    return WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                "//input[contains(@placeholder, 'Type a message')]"
                "/following-sibling::div[1]",
            )
        )
    )


def send_chat_message(driver, message):
    message_input = get_message_input(driver)

    type_into_element(driver, message_input, message)
    demo_pause(2)

    send_control = get_send_message_control(driver)

    WebDriverWait(driver, TIMEOUT).until(
        lambda _: "cursor-not-allowed" not in (send_control.get_attribute("class") or "")
    )

    click_element(driver, send_control)
    wait_for_body(driver)
    demo_pause(4)

    wait_until_page_contains(driver, message)


# ------------------------------------------------------------
# Tests
# ------------------------------------------------------------

@pytest.mark.kevin
@pytest.mark.chat
def test_uc_8_1_client_and_coach_can_exchange_messages(driver, base_url):
    """
    UC 8.1 full chat flow:

    1. Alex signs in as client.
    2. Alex opens Messages.
    3. Alex selects Sam Nguyen.
    4. Alex sends a message.
    5. Sam signs in as coach.
    6. Sam opens Messages.
    7. Sam selects Alex Taylor.
    8. Sam verifies Alex's message was received.
    9. Sam sends a response.
    """

    unique_id = int(time.time())

    client_message = (
        f"UC 8.1 Selenium client sender coverage message {unique_id}"
    )

    coach_response = (
        f"UC 8.1 Selenium coach response coverage message {unique_id}"
    )

    # -------------------------
    # Client sends message
    # -------------------------
    login(driver, base_url, CLIENT_EMAIL, CLIENT_PASSWORD)

    click_messages_nav(driver, role="client")

    select_chat_contact(driver, COACH_CONTACT_NAME)

    assert_page_contains(
        driver,
        ["type a message", COACH_CONTACT_NAME],
    )

    send_chat_message(driver, client_message)

    assert_page_contains(
        driver,
        [client_message],
    )

    # -------------------------
    # Switch to coach and respond
    # -------------------------
    clear_session(driver, base_url)

    login(driver, base_url, CHAT_COACH_EMAIL, CHAT_COACH_PASSWORD)

    click_messages_nav(driver, role="coach")

    select_chat_contact(driver, CLIENT_CONTACT_NAME)

    assert_page_contains(
        driver,
        [CLIENT_CONTACT_NAME, client_message],
    )

    send_chat_message(driver, coach_response)

    assert_page_contains(
        driver,
        [coach_response],
    )

    demo_pause(5)
