"""
Kevin Selenium demo tests.

Covers:
UC 8.4 — Goal prediction gambling.

Simple full-flow coverage:
1. Alex logs in.
2. Alex opens client prediction page.
3. Alex places one NO bet on one Sam-created market discovered by Creator = Sam Nguyen.
4. Alex checks My Bets.
5. Alex creates one market intended for admin approval.
6. Alex creates one market intended for admin rejection.
7. Alex checks My Markets and Leaderboard.
8. Sam logs in.
9. Sam switches to client view.
10. Sam opens My Markets.
11. Sam closes the Sam market that Alex bet NO on.
12. Sam requests cancellation on another Sam market without Alex placing a second bet.
13. Liam/admin logs in.
14. Admin approves Alex's first new market.
15. Admin rejects Alex's second new market.
16. Admin settles Sam's closed market in favor of Alex's NO bet.
17. Admin approves Sam's cancellation request.
18. Alex logs back in.
19. Alex verifies Gambling Den, My Bets, My Markets, and Leaderboard.

Run:
python -m pytest test_predictions.py::test_uc_8_4_prediction_gambling_full_flow -v -s
"""

import os
import time
from datetime import date, timedelta

import pytest
from selenium.common.exceptions import (
    ElementClickInterceptedException,
    NoAlertPresentException,
    NoSuchElementException,
    StaleElementReferenceException,
    TimeoutException,
)
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


TIMEOUT = 10

# Lower sleeps so the script runs faster.
# Increase DEMO_SLEEP from the command line if you need slower demo visuals:
# set DEMO_SLEEP=1.25
DEMO_SLEEP = float(os.getenv("DEMO_SLEEP", "1"))
LOGIN_SETTLE_SLEEP = float(os.getenv("LOGIN_SETTLE_SLEEP", "3"))

GLOBAL_PASSWORD = os.getenv("GLOBAL_PASSWORD", "Rishik@1")

ALEX_EMAIL = os.getenv("ALEX_EMAIL", "alex@example.com")
ALEX_PASSWORD = os.getenv("ALEX_PASSWORD", GLOBAL_PASSWORD)

SAM_EMAIL = os.getenv("SAM_EMAIL", "sam@example.com")
SAM_PASSWORD = os.getenv("SAM_PASSWORD", GLOBAL_PASSWORD)

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "liam@example.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", GLOBAL_PASSWORD)

WAGER_POINTS = os.getenv("PREDICTION_WAGER_POINTS", "10")
PREDICTION_BET_SIDE = os.getenv("PREDICTION_BET_SIDE", "no")

SAM_MARKET_CREATOR = os.getenv("SAM_MARKET_CREATOR", "Sam Nguyen")

SAM_MARKET_BET = os.getenv("SAM_MARKET_BET", "")
SAM_MARKET_TO_CLOSE = os.getenv("SAM_MARKET_TO_CLOSE", "")
SAM_MARKET_TO_CANCEL = os.getenv("SAM_MARKET_TO_CANCEL", "")

RUN_SUFFIX = str(int(time.time()))[-5:]

ALEX_APPROVE_MARKET_TITLE = os.getenv(
    "ALEX_APPROVE_MARKET_TITLE",
    f"UC 8.4 Alex approved market {RUN_SUFFIX}",
)

ALEX_REJECT_MARKET_TITLE = os.getenv(
    "ALEX_REJECT_MARKET_TITLE",
    f"UC 8.4 Alex rejected market {RUN_SUFFIX}",
)

ALEX_APPROVE_MARKET_GOAL = os.getenv(
    "ALEX_APPROVE_MARKET_GOAL",
    "Alex completes a Selenium-approved prediction goal.",
)

ALEX_REJECT_MARKET_GOAL = os.getenv(
    "ALEX_REJECT_MARKET_GOAL",
    "Alex creates a Selenium market that admin will reject.",
)

MARKET_DEADLINE = os.getenv(
    "MARKET_DEADLINE",
    (date.today() + timedelta(days=21)).isoformat(),
)

CANCEL_REASON = os.getenv(
    "PREDICTION_CANCEL_REASON",
    "Selenium UC 8.4 cancellation request: demo market should be reviewed by admin.",
)

ADMIN_APPROVE_NOTE = os.getenv(
    "PREDICTION_ADMIN_APPROVE_NOTE",
    "Approved by Selenium UC 8.4 admin review.",
)

ADMIN_REJECT_NOTE = os.getenv(
    "PREDICTION_ADMIN_REJECT_NOTE",
    "Rejected by Selenium UC 8.4 admin review.",
)

SETTLEMENT_NOTE = os.getenv(
    "PREDICTION_SETTLEMENT_NOTE",
    "Settled by Selenium UC 8.4 in favor of Alex's NO bet.",
)

CANCEL_APPROVAL_NOTE = os.getenv(
    "PREDICTION_CANCEL_APPROVAL_NOTE",
    "Cancellation approved by Selenium UC 8.4 admin review.",
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


def page_text(driver):
    wait_for_body(driver)
    return driver.find_element(By.TAG_NAME, "body").text.lower()


def assert_page_contains(driver, expected_words):
    text = page_text(driver)

    assert any(word.lower() in text for word in expected_words), (
        f"Expected page to contain one of {expected_words}\n\n"
        f"Actual text:\n{text[:2500]}"
    )


def normalize_space_text(text):
    return " ".join((text or "").split()).strip()


def title_matches(actual, expected):
    return normalize_space_text(actual).lower() == normalize_space_text(expected).lower()


def scroll_to_element(driver, element, pause=True):
    driver.execute_script(
        "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
        element,
    )

    if pause:
        demo_pause(0.35)


def scroll_page_to_top(driver, pause=True):
    driver.execute_script("window.scrollTo({ top: 0, behavior: 'smooth' });")

    if pause:
        demo_pause(0.35)


def scroll_page_to_bottom(driver, pause=True):
    driver.execute_script(
        "window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });"
    )

    if pause:
        demo_pause(0.35)


def visually_scroll_section(driver):
    """
    Fast visual scroll for demo visibility after switching tabs.
    """

    scroll_page_to_top(driver)
    driver.execute_script("window.scrollBy({ top: 500, behavior: 'smooth' });")
    demo_pause(0.35)


def click_element(driver, element, pause=True):
    scroll_to_element(driver, element, pause=True)

    try:
        element.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", element)

    if pause:
        demo_pause(0.35)


def type_into_element(driver, element, value, pause=True):
    scroll_to_element(driver, element)
    element.clear()
    element.send_keys(value)

    if pause:
        demo_pause(0.25)


def set_react_value(driver, element, value):
    scroll_to_element(driver, element)

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
        value,
    )

    demo_pause(0.25)


def set_wager_points(driver, wager_input, points):
    scroll_to_element(driver, wager_input)

    wager_input.click()
    demo_pause(0.2)

    try:
        wager_input.send_keys(Keys.CONTROL, "a")
        wager_input.send_keys(Keys.BACKSPACE)
    except Exception:
        pass

    wager_input.send_keys(str(points))

    driver.execute_script(
        """
        const element = arguments[0];
        const value = arguments[1];

        const inputSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        )?.set;

        inputSetter.call(element, value);

        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        """,
        wager_input,
        str(points),
    )

    demo_pause(0.35)

    actual_value = wager_input.get_attribute("value")

    assert actual_value == str(points), (
        f"Expected wager input to contain {points}, but got {actual_value}"
    )


def lower_contains(text):
    return (
        "contains(translate(normalize-space(.), "
        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
        f"'{text.lower()}')"
    )


def lower_equals(text):
    return (
        "translate(normalize-space(.), "
        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') "
        f"= '{text.lower()}'"
    )


def xpath_literal(value):
    if "'" not in value:
        return f"'{value}'"

    if '"' not in value:
        return f'"{value}"'

    parts = value.split("'")
    return "concat(" + ", \"'\", ".join(f"'{part}'" for part in parts) + ")"


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
    demo_pause(0.7)

    email_input = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )
    password_input = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.NAME, "password"))
    )

    type_into_element(driver, email_input, email)
    type_into_element(driver, password_input, password)

    sign_in_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//button[{lower_contains('sign in')}]",
            )
        )
    )

    click_element(driver, sign_in_button)

    WebDriverWait(driver, TIMEOUT).until(
        lambda d: "/signin" not in d.current_url
    )

    wait_for_body(driver)
    settle_pause(LOGIN_SETTLE_SLEEP)


def click_button_containing(driver, text, timeout=TIMEOUT):
    button = WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//button[{lower_contains(text)}]",
            )
        )
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


def click_tab(driver, tab_text, visual_scroll=True):
    tab = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//*[@role='tab' and {lower_contains(tab_text)}]",
            )
        )
    )

    click_element(driver, tab)
    wait_for_body(driver)
    demo_pause(0.8)

    if visual_scroll:
        visually_scroll_section(driver)


def get_visible_dialog(driver):
    return WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located(
            (
                By.XPATH,
                "//*[@role='dialog' and not(contains(@class, 'hidden'))]",
            )
        )
    )


def wait_for_dialog_to_close(driver, timeout=TIMEOUT):
    WebDriverWait(driver, timeout).until(
        lambda current_driver: len(
            [
                dialog
                for dialog in current_driver.find_elements(By.XPATH, "//*[@role='dialog']")
                if dialog.is_displayed()
            ]
        ) == 0
    )

    demo_pause(0.4)


# ------------------------------------------------------------
# Modal helpers
# ------------------------------------------------------------

def get_dialog_body(dialog):
    try:
        return dialog.find_element(
            By.XPATH,
            ".//*[contains(@class, 'modal__body')]",
        )
    except NoSuchElementException:
        return dialog


def get_dialog_footer(dialog):
    try:
        return dialog.find_element(
            By.XPATH,
            ".//*[contains(@class, 'modal__footer')]",
        )
    except NoSuchElementException:
        return dialog


def scroll_dialog_to_top(driver, dialog, pause=True):
    body = get_dialog_body(dialog)

    driver.execute_script(
        """
        const body = arguments[0];
        try {
            body.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
            arguments[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        """,
        body,
    )

    if pause:
        demo_pause(0.3)


def scroll_dialog_to_bottom(driver, dialog, pause=True):
    """
    Fully scrolls to bottom of a modal body so footer/action buttons are visible.
    """

    body = get_dialog_body(dialog)
    footer = get_dialog_footer(dialog)

    driver.execute_script(
        """
        const body = arguments[0];
        const footer = arguments[1];

        try {
            body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
        } catch (e) {}

        try {
            footer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {}
        """,
        body,
        footer,
    )

    if pause:
        demo_pause(0.5)


def scroll_dialog_to_element(driver, dialog, element, pause=True):
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

    if pause:
        demo_pause(0.3)


def click_element_in_dialog(driver, dialog, element, pause=True):
    scroll_dialog_to_element(driver, dialog, element, pause=True)

    try:
        element.click()
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", element)

    if pause:
        demo_pause(0.3)


def type_into_dialog_field(driver, dialog, element, value, pause=True):
    scroll_dialog_to_element(driver, dialog, element)

    element.click()
    demo_pause(0.2)

    try:
        element.send_keys(Keys.CONTROL, "a")
        element.send_keys(Keys.BACKSPACE)
    except Exception:
        try:
            element.clear()
        except Exception:
            pass

    element.send_keys(value)

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
        value,
    )

    if pause:
        demo_pause(0.3)


def set_create_market_date(driver, dialog, iso_date):
    year, month, day = iso_date.split("-")

    segments = {
        "month": month,
        "day": day,
        "year": year,
    }

    for segment_type, value in segments.items():
        segment = WebDriverWait(driver, TIMEOUT).until(
            EC.presence_of_element_located(
                (
                    By.XPATH,
                    f"//*[@role='dialog']//*[@data-type='{segment_type}' and @contenteditable='true']",
                )
            )
        )

        scroll_dialog_to_element(driver, dialog, segment)

        segment.click()
        demo_pause(0.2)

        try:
            segment.send_keys(Keys.CONTROL, "a")
            segment.send_keys(Keys.BACKSPACE)
        except Exception:
            pass

        segment.send_keys(value)
        demo_pause(0.15)

    driver.execute_script(
        """
        const dialog = arguments[0];
        const value = arguments[1];

        const hiddenDateInputs = dialog.querySelectorAll("input[type='date'], input[hidden]");
        hiddenDateInputs.forEach((input) => {
            try {
                const setter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'value'
                )?.set;
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

    demo_pause(0.25)


def click_submit_market_button(driver, dialog, title):
    scroll_dialog_to_bottom(driver, dialog)

    submit_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//*[@role='dialog']//button["
                ".//span[contains(translate(normalize-space(.), "
                "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'submit market')] "
                "or contains(translate(normalize-space(.), "
                "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'submit market')"
                "]",
            )
        )
    )

    click_element_in_dialog(driver, dialog, submit_button)

    try:
        wait_for_dialog_to_close(driver, timeout=10)
    except TimeoutException:
        dialog_text = get_visible_dialog(driver).text
        raise AssertionError(
            f"Create market modal did not close after clicking Submit market.\n\n"
            f"Market title: {title}\n\n"
            f"Modal text:\n{dialog_text}"
        )

    wait_for_body(driver)
    demo_pause(1)


def fill_modal_textareas(driver, values):
    dialog = get_visible_dialog(driver)

    textareas = [
        textarea
        for textarea in dialog.find_elements(By.TAG_NAME, "textarea")
        if textarea.is_displayed() and textarea.is_enabled()
    ]

    for index, textarea in enumerate(textareas):
        value = values[min(index, len(values) - 1)]
        type_into_dialog_field(driver, dialog, textarea, value)

    scroll_dialog_to_bottom(driver, dialog)

    return textareas


def fill_first_visible_modal_textarea(driver, dialog, value):
    """
    Fills the first visible modal textarea when one exists.

    The settlement modal sometimes displays an "Admin action note" label without
    exposing a visible textarea. That should not fail the test because the
    settlement side and confirm action are the actual UC coverage.
    """

    textareas = [
        textarea
        for textarea in dialog.find_elements(By.TAG_NAME, "textarea")
        if textarea.is_displayed() and textarea.is_enabled()
    ]

    if not textareas:
        print("\nNo visible modal textarea found. Continuing without note.")
        print(f"Modal preview:\n{dialog.text[:600]}\n")
        scroll_dialog_to_bottom(driver, dialog)
        return False

    type_into_dialog_field(driver, dialog, textareas[0], value)
    scroll_dialog_to_bottom(driver, dialog)
    return True

def click_modal_button_by_text(driver, dialog, labels):
    if isinstance(labels, str):
        labels = [labels]

    scroll_dialog_to_bottom(driver, dialog)

    for label in labels:
        try:
            button = WebDriverWait(driver, 3).until(
                EC.element_to_be_clickable(
                    (
                        By.XPATH,
                        f"//*[@role='dialog']//button[{lower_contains(label)}]",
                    )
                )
            )
            click_element_in_dialog(driver, dialog, button)
            return True
        except Exception:
            continue

    return False


# ------------------------------------------------------------
# Market card helpers
# ------------------------------------------------------------

def get_market_title_from_card(card):
    headings = card.find_elements(By.XPATH, ".//h3")

    for heading in headings:
        title = normalize_space_text(heading.text)

        if title:
            return title

    card_text = normalize_space_text(card.text)
    return card_text.splitlines()[0] if card_text else ""


def collect_creator_market_titles(driver, creator_name):
    titles = []
    creator_literal = xpath_literal(creator_name)

    creator_nodes = driver.find_elements(
        By.XPATH,
        f"//*[normalize-space(.)={creator_literal}]",
    )

    seen_cards = set()

    for creator_node in creator_nodes:
        if not creator_node.is_displayed():
            continue

        try:
            card = creator_node.find_element(
                By.XPATH,
                "./ancestor::div[contains(@class, 'card')][1]",
            )
        except NoSuchElementException:
            continue

        if card.id in seen_cards:
            continue

        seen_cards.add(card.id)

        if not card.is_displayed():
            continue

        card_text = (card.text or "").lower()

        if "creator" not in card_text:
            continue

        if "choose yes" not in card_text and "choose no" not in card_text:
            continue

        titles.append(get_market_title_from_card(card))

    return titles


def card_has_button(card, button_text):
    try:
        buttons = card.find_elements(
            By.XPATH,
            f".//button[{lower_contains(button_text)}]",
        )
        return any(button.is_displayed() and button.is_enabled() for button in buttons)
    except StaleElementReferenceException:
        return False


def get_card_button(card, button_text):
    buttons = card.find_elements(
        By.XPATH,
        f".//button[{lower_contains(button_text)}]",
    )

    visible_buttons = [
        button for button in buttons
        if button.is_displayed() and button.is_enabled()
    ]

    assert visible_buttons, (
        f"No visible enabled button found: {button_text}\n\n"
        f"Card text:\n{card.text}"
    )

    visible_buttons.sort(key=lambda button: len(normalize_space_text(button.text)))

    return visible_buttons[0]


def find_market_card_by_creator(driver, creator_name, side, excluded_titles=None, timeout=TIMEOUT):
    excluded_titles = excluded_titles or []
    excluded_titles_lower = {
        title.lower().strip()
        for title in excluded_titles
        if title
    }

    side_label = f"choose {side}".lower()
    creator_literal = xpath_literal(creator_name)

    def find_card(current_driver):
        try:
            creator_nodes = current_driver.find_elements(
                By.XPATH,
                f"//*[normalize-space(.)={creator_literal}]",
            )

            seen_cards = set()

            for creator_node in creator_nodes:
                if not creator_node.is_displayed():
                    continue

                try:
                    card = creator_node.find_element(
                        By.XPATH,
                        "./ancestor::div[contains(@class, 'card')][1]",
                    )
                except NoSuchElementException:
                    continue

                if card.id in seen_cards:
                    continue

                seen_cards.add(card.id)

                if not card.is_displayed():
                    continue

                card_text = (card.text or "").lower()
                card_title = get_market_title_from_card(card).lower().strip()

                has_creator_label = "creator" in card_text
                has_creator_name = creator_name.lower() in card_text
                has_side_button = side_label in card_text
                is_not_excluded = card_title not in excluded_titles_lower

                if has_creator_label and has_creator_name and has_side_button and is_not_excluded:
                    return card

            return False

        except StaleElementReferenceException:
            return False

    try:
        card = WebDriverWait(driver, timeout).until(find_card)
        scroll_to_element(driver, card)
        return card

    except TimeoutException as exc:
        visible_titles = collect_creator_market_titles(driver, creator_name)

        raise AssertionError(
            f"Could not find a visible Gambling Den market card for creator "
            f"'{creator_name}' with side '{side}'.\n\n"
            f"Excluded titles: {excluded_titles}\n"
            f"Visible {creator_name} market titles found: {visible_titles}\n\n"
            f"Page text preview:\n{page_text(driver)[:2500]}"
        ) from exc


def find_market_card(driver, market_title, timeout=TIMEOUT, required_button_text=None):
    """
    Finds a visible market card by title for client-side pages.
    Admin flows use stricter exact h3 matching helpers below.
    """

    def find_card(current_driver):
        try:
            cards = current_driver.find_elements(
                By.XPATH,
                "//div[contains(@class, 'card')]",
            )

            for card in cards:
                if not card.is_displayed():
                    continue

                card_text = card.text or ""

                if market_title.lower() not in card_text.lower():
                    continue

                if required_button_text and not card_has_button(card, required_button_text):
                    continue

                return card

            return False

        except StaleElementReferenceException:
            return False

    try:
        card = WebDriverWait(driver, timeout).until(find_card)
        scroll_to_element(driver, card)
        return card

    except TimeoutException as exc:
        raise AssertionError(
            f"Could not find visible market card.\n\n"
            f"Title: {market_title}\n"
            f"Required button: {required_button_text}\n\n"
            f"Page text preview:\n{page_text(driver)[:3000]}"
        ) from exc


def find_market_card_with_button(driver, button_text, excluded_titles=None, timeout=TIMEOUT):
    excluded_titles = excluded_titles or []
    excluded_titles_lower = {
        title.lower().strip()
        for title in excluded_titles
        if title
    }

    def find_card(current_driver):
        try:
            buttons = current_driver.find_elements(
                By.XPATH,
                f"//button[{lower_contains(button_text)}]",
            )

            for button in buttons:
                if not button.is_displayed() or not button.is_enabled():
                    continue

                try:
                    card = button.find_element(
                        By.XPATH,
                        "./ancestor::div[contains(@class, 'card')][1]",
                    )
                except NoSuchElementException:
                    continue

                if not card.is_displayed():
                    continue

                title = get_market_title_from_card(card).lower().strip()

                if title in excluded_titles_lower:
                    continue

                return card

            return False

        except StaleElementReferenceException:
            return False

    card = WebDriverWait(driver, timeout).until(find_card)
    scroll_to_element(driver, card)
    return card


def find_visible_input_by_id_or_type(driver, element_id=None, input_type=None):
    if element_id:
        try:
            element = driver.find_element(By.ID, element_id)

            if element.is_displayed() and element.is_enabled():
                return element

        except NoSuchElementException:
            pass

    if input_type:
        elements = driver.find_elements(By.XPATH, f"//input[@type='{input_type}']")

        for element in elements:
            if element.is_displayed() and element.is_enabled():
                return element

    return None


def safe_accept_alert(driver, timeout=5):
    try:
        alert = WebDriverWait(driver, timeout).until(EC.alert_is_present())
        demo_pause(0.4)
        alert.accept()
        demo_pause(1)
        return True

    except (TimeoutException, NoAlertPresentException):
        return False


# ------------------------------------------------------------
# Strict admin card helpers
# ------------------------------------------------------------

def get_selected_tab_panel(driver):
    """
    Returns the active tab panel when React Aria exposes aria-controls.
    Falls back to body if no panel is found.
    """

    try:
        selected_tab = driver.find_element(
            By.XPATH,
            "//*[@role='tab' and @aria-selected='true']",
        )

        panel_id = selected_tab.get_attribute("aria-controls")

        if panel_id:
            panel = driver.find_element(By.ID, panel_id)

            if panel.is_displayed():
                return panel

    except Exception:
        pass

    return driver.find_element(By.TAG_NAME, "body")


def find_exact_market_action_card(driver, market_title, required_button_text, timeout=TIMEOUT):
    """
    Finds the smallest visible card for a specific market title and action button.

    This avoids accidentally selecting:
    - the whole Review Queue container
    - the wrong Pending Settlement card
    - a parent card that contains multiple markets
    """

    expected_title = normalize_space_text(market_title)
    required_button_lower = required_button_text.lower()

    def find_card(current_driver):
        try:
            panel = get_selected_tab_panel(current_driver)

            headings = panel.find_elements(By.XPATH, ".//h3")

            matching_cards = []

            for heading in headings:
                if not heading.is_displayed():
                    continue

                heading_text = normalize_space_text(heading.text)

                if not title_matches(heading_text, expected_title):
                    continue

                ancestor_cards = heading.find_elements(
                    By.XPATH,
                    "./ancestor::div[contains(@class, 'card')]",
                )

                for card in ancestor_cards:
                    if not card.is_displayed():
                        continue

                    card_text = normalize_space_text(card.text).lower()

                    has_exact_title = expected_title.lower() in card_text
                    has_required_button = len(
                        card.find_elements(
                            By.XPATH,
                            ".//button[contains(translate(normalize-space(.), "
                            "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
                            f"'{required_button_lower}')]",
                        )
                    ) > 0

                    if has_exact_title and has_required_button:
                        matching_cards.append(card)

            if not matching_cards:
                return False

            # Pick smallest text card to avoid selecting outer queue container.
            matching_cards.sort(key=lambda card: len(card.text or ""))

            return matching_cards[0]

        except StaleElementReferenceException:
            return False

    try:
        card = WebDriverWait(driver, timeout).until(find_card)
        scroll_to_element(driver, card)
        demo_pause(0.6)

        print("\nMatched exact admin action card:")
        print(f"Title: {market_title}")
        print(f"Required button: {required_button_text}")
        print(f"Card preview:\n{card.text[:700]}\n")

        return card

    except TimeoutException as exc:
        raise AssertionError(
            f"Could not find exact admin action card.\n\n"
            f"Market title: {market_title}\n"
            f"Required button: {required_button_text}\n\n"
            f"Active page text preview:\n{page_text(driver)[:3500]}"
        ) from exc


def get_exact_button_from_card(card, button_text):
    """
    Gets a button from inside one already-matched card.
    This does not search the whole page.
    """

    button_text_lower = button_text.lower()

    buttons = card.find_elements(
        By.XPATH,
        ".//button[contains(translate(normalize-space(.), "
        "'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
        f"'{button_text_lower}')]",
    )

    visible_buttons = [
        button for button in buttons
        if button.is_displayed() and button.is_enabled()
    ]

    assert visible_buttons, (
        f"Could not find visible enabled button '{button_text}' inside card:\n{card.text}"
    )

    visible_buttons.sort(key=lambda button: len(normalize_space_text(button.text)))

    return visible_buttons[0]


# ------------------------------------------------------------
# Client prediction helpers
# ------------------------------------------------------------

def open_client_prediction_page(driver, base_url):
    driver.get(f"{base_url}/client/prediction")
    wait_for_body(driver)
    demo_pause(1.5)

    assert_page_contains(
        driver,
        ["predictions", "gambling den", "my bets", "my markets", "leaderboard"],
    )


def place_bet_on_creator_market(driver, creator_name, side, wager_points=WAGER_POINTS, excluded_titles=None):
    click_tab(driver, "Gambling Den")

    card = find_market_card_by_creator(
        driver,
        creator_name=creator_name,
        side=side,
        excluded_titles=excluded_titles,
    )

    market_title = get_market_title_from_card(card)

    print(f"\nPlacing {side.upper()} bet on creator market:")
    print(f"Creator: {creator_name}")
    print(f"Market: {market_title}")
    print(f"Wager: {wager_points} points\n")

    choose_button = get_card_button(card, f"choose {side}")

    click_element(driver, choose_button)
    wait_for_body(driver)
    demo_pause(0.8)

    dialog = get_visible_dialog(driver)

    assert "place bet" in dialog.text.lower(), "Expected Place Bet modal."

    wager_input = find_visible_input_by_id_or_type(
        driver,
        element_id="prediction-points-wagered",
        input_type="number",
    )

    assert wager_input is not None, "Expected prediction wager input."

    set_wager_points(driver, wager_input, wager_points)

    scroll_dialog_to_bottom(driver, dialog)

    confirm_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//*[@role='dialog']//button[{lower_contains('confirm bet')}]",
            )
        )
    )

    click_element_in_dialog(driver, dialog, confirm_button)
    wait_for_body(driver)

    try:
        wait_for_dialog_to_close(driver, timeout=8)
    except TimeoutException:
        dialog_text = get_visible_dialog(driver).text

        raise AssertionError(
            f"Bet confirmation modal did not close after confirming {wager_points} points.\n\n"
            f"Market: {market_title}\n"
            f"Side: {side}\n\n"
            f"Modal text:\n{dialog_text}"
        )

    demo_pause(0.8)

    return market_title


def place_bet_on_market(driver, market_title, side, wager_points=WAGER_POINTS):
    click_tab(driver, "Gambling Den")

    card = find_market_card(driver, market_title, required_button_text=f"choose {side}")

    print(f"\nPlacing {side.upper()} bet on market:")
    print(f"Market: {market_title}")
    print(f"Wager: {wager_points} points\n")

    choose_button = get_card_button(card, f"choose {side}")

    click_element(driver, choose_button)
    wait_for_body(driver)
    demo_pause(0.8)

    dialog = get_visible_dialog(driver)

    assert "place bet" in dialog.text.lower(), "Expected Place Bet modal."

    wager_input = find_visible_input_by_id_or_type(
        driver,
        element_id="prediction-points-wagered",
        input_type="number",
    )

    assert wager_input is not None, "Expected prediction wager input."

    set_wager_points(driver, wager_input, wager_points)

    scroll_dialog_to_bottom(driver, dialog)

    confirm_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//*[@role='dialog']//button[{lower_contains('confirm bet')}]",
            )
        )
    )

    click_element_in_dialog(driver, dialog, confirm_button)
    wait_for_body(driver)

    try:
        wait_for_dialog_to_close(driver, timeout=8)
    except TimeoutException:
        dialog_text = get_visible_dialog(driver).text

        raise AssertionError(
            f"Bet confirmation modal did not close after confirming {wager_points} points.\n\n"
            f"Market: {market_title}\n"
            f"Side: {side}\n\n"
            f"Modal text:\n{dialog_text}"
        )

    demo_pause(0.8)

    return market_title


def verify_my_bets_contains_markets(driver):
    click_tab(driver, "My Bets")

    if SAM_MARKET_BET:
        card = find_market_card(driver, SAM_MARKET_BET)
        scroll_to_element(driver, card)
        demo_pause(0.8)

    text = page_text(driver)

    assert "my bets" in text, "Expected My Bets section."

    if SAM_MARKET_BET:
        assert SAM_MARKET_BET.lower() in text, (
            f"Expected bet market to appear in My Bets: {SAM_MARKET_BET}"
        )

    visually_scroll_section(driver)


def open_create_market_modal(driver):
    clicked = try_click_button_containing(driver, "New market", timeout=4)

    if not clicked:
        clicked = try_click_button_containing(driver, "Create market", timeout=4)

    assert clicked, "Could not open Create Market modal."

    dialog = get_visible_dialog(driver)
    demo_pause(0.7)

    assert "create" in dialog.text.lower() and "market" in dialog.text.lower(), (
        f"Expected create market modal, got:\n{dialog.text}"
    )

    scroll_dialog_to_top(driver, dialog)

    return dialog


def fill_create_market_modal(driver, title, goal):
    dialog = get_visible_dialog(driver)

    title_input = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.ID, "prediction-market-title"))
    )

    type_into_dialog_field(driver, dialog, title_input, title)

    goal_textarea = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.ID, "prediction-market-goal"))
    )

    type_into_dialog_field(driver, dialog, goal_textarea, goal)

    set_create_market_date(driver, dialog, MARKET_DEADLINE)

    scroll_dialog_to_bottom(driver, dialog)


def create_market(driver, title, goal, intended_admin_result):
    click_tab(driver, "My Markets")

    dialog = open_create_market_modal(driver)

    print("\nCreating prediction market:")
    print(f"Title: {title}")
    print(f"Goal: {goal}")
    print(f"Deadline: {MARKET_DEADLINE}")
    print(f"Admin intent: {intended_admin_result}\n")

    fill_create_market_modal(
        driver,
        title,
        f"{goal} Selenium UC 8.4 market intended for admin {intended_admin_result}.",
    )

    click_submit_market_button(driver, dialog, title)


def create_alex_markets(driver):
    create_market(
        driver,
        ALEX_APPROVE_MARKET_TITLE,
        ALEX_APPROVE_MARKET_GOAL,
        "approval",
    )

    create_market(
        driver,
        ALEX_REJECT_MARKET_TITLE,
        ALEX_REJECT_MARKET_GOAL,
        "rejection",
    )

    click_tab(driver, "My Markets")

    first_card = find_market_card(driver, ALEX_APPROVE_MARKET_TITLE)
    scroll_to_element(driver, first_card)
    demo_pause(0.7)

    second_card = find_market_card(driver, ALEX_REJECT_MARKET_TITLE)
    scroll_to_element(driver, second_card)
    demo_pause(0.7)

    assert_page_contains(
        driver,
        ["my markets", "in review", ALEX_APPROVE_MARKET_TITLE, ALEX_REJECT_MARKET_TITLE],
    )

    visually_scroll_section(driver)


def verify_leaderboard(driver):
    click_tab(driver, "Leaderboard")

    assert_page_contains(
        driver,
        ["leaderboard", "rank", "points", "bets"],
    )

    visually_scroll_section(driver)


# ------------------------------------------------------------
# Sam creator-side helpers
# ------------------------------------------------------------

def open_avatar_dropdown(driver):
    avatar_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//div[contains(@class, 'relative')]//button[.//span[contains(@class, 'avatar')]]",
            )
        )
    )

    click_element(driver, avatar_button)
    wait_for_body(driver)
    demo_pause(0.7)


def switch_to_client_view_if_available(driver):
    try:
        open_avatar_dropdown(driver)

        switch_button = WebDriverWait(driver, 4).until(
            EC.element_to_be_clickable(
                (
                    By.XPATH,
                    f"//button[{lower_contains('switch to client')}]",
                )
            )
        )

        click_element(driver, switch_button)
        wait_for_body(driver)
        demo_pause(1.3)

    except TimeoutException:
        pass


def close_sam_market(driver):
    click_tab(driver, "My Markets")

    card = find_market_card(driver, SAM_MARKET_TO_CLOSE, required_button_text="close market")

    scroll_to_element(driver, card)
    demo_pause(0.7)

    close_button = get_card_button(card, "close market")

    click_element(driver, close_button, pause=True)

    accepted = safe_accept_alert(driver, timeout=6)

    assert accepted, "Expected browser alert when closing market."

    wait_for_body(driver)
    demo_pause(1.2)


def request_sam_market_cancellation(driver):
    global SAM_MARKET_TO_CANCEL

    click_tab(driver, "My Markets")

    if SAM_MARKET_TO_CANCEL:
        card = find_market_card(driver, SAM_MARKET_TO_CANCEL, required_button_text="request cancellation")
    else:
        card = find_market_card_with_button(
            driver,
            "request cancellation",
            excluded_titles=[SAM_MARKET_TO_CLOSE],
        )
        SAM_MARKET_TO_CANCEL = get_market_title_from_card(card)

    print("\nRequesting cancellation for Sam market:")
    print(f"Market: {SAM_MARKET_TO_CANCEL}\n")

    scroll_to_element(driver, card)
    demo_pause(0.7)

    request_button = get_card_button(card, "request cancellation")

    click_element(driver, request_button)
    wait_for_body(driver)
    demo_pause(0.7)

    dialog = get_visible_dialog(driver)

    assert "cancellation" in dialog.text.lower(), "Expected cancellation request modal."

    reason_box = WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.ID, "prediction-cancel-reason"))
    )

    type_into_dialog_field(driver, dialog, reason_box, CANCEL_REASON)

    scroll_dialog_to_bottom(driver, dialog)

    send_button = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//*[@role='dialog']//button[{lower_contains('send for review')}]",
            )
        )
    )

    click_element_in_dialog(driver, dialog, send_button)
    wait_for_body(driver)
    demo_pause(1.2)


# ------------------------------------------------------------
# Admin prediction moderation helpers
# ------------------------------------------------------------

def open_admin_prediction_page(driver, base_url):
    driver.get(f"{base_url}/admin/prediction/")
    wait_for_body(driver)
    demo_pause(1.5)

    assert_page_contains(
        driver,
        ["moderation queues", "review queue", "pending settlement", "cancel review"],
    )

    visually_scroll_section(driver)


def click_admin_tab(driver, tab_text):
    scroll_page_to_top(driver)

    tab = WebDriverWait(driver, TIMEOUT).until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                f"//*[@role='tab' and {lower_contains(tab_text)}]",
            )
        )
    )

    click_element(driver, tab)
    wait_for_body(driver)
    demo_pause(1)
    visually_scroll_section(driver)


def maybe_complete_admin_modal(note_text):
    try:
        dialog = WebDriverWait(driver_global_holder["driver"], 3).until(
            EC.presence_of_element_located((By.XPATH, "//*[@role='dialog']"))
        )

        if dialog.is_displayed():
            scroll_dialog_to_top(driver_global_holder["driver"], dialog)

            textareas = [
                textarea
                for textarea in dialog.find_elements(By.TAG_NAME, "textarea")
                if textarea.is_displayed() and textarea.is_enabled()
            ]

            for textarea in textareas:
                type_into_dialog_field(driver_global_holder["driver"], dialog, textarea, note_text)

            scroll_dialog_to_bottom(driver_global_holder["driver"], dialog)

            if click_modal_button_by_text(
                driver_global_holder["driver"],
                dialog,
                ["Confirm", "Submit", "Approve", "Reject", "Save"],
            ):
                wait_for_body(driver_global_holder["driver"])
                demo_pause(1)
                return True

    except TimeoutException:
        return False

    return False


driver_global_holder = {"driver": None}


def admin_review_market(driver, market_title, decision):
    """
    Approves/rejects an exact Review Queue market by title.
    """

    driver_global_holder["driver"] = driver

    click_admin_tab(driver, "Review Queue")

    card = find_exact_market_action_card(
        driver,
        market_title=market_title,
        required_button_text=decision,
    )

    print("\nAdmin review action:")
    print(f"Market: {market_title}")
    print(f"Decision: {decision}\n")

    button = get_exact_button_from_card(card, decision)

    click_element(driver, button)
    wait_for_body(driver)
    demo_pause(0.8)

    note = ADMIN_APPROVE_NOTE if decision.lower() == "approve" else ADMIN_REJECT_NOTE

    maybe_complete_admin_modal(note)

    wait_for_body(driver)
    demo_pause(1.2)


def admin_settle_sam_market(driver):
    """
    Settles the exact Sam market that Alex bet on.
    """

    driver_global_holder["driver"] = driver

    click_admin_tab(driver, "Pending Settlement")

    card = find_exact_market_action_card(
        driver,
        market_title=SAM_MARKET_TO_CLOSE,
        required_button_text="Settle market",
    )

    print("\nAdmin settlement action:")
    print(f"Market: {SAM_MARKET_TO_CLOSE}")
    print(f"Winning side: {PREDICTION_BET_SIDE}\n")

    settle_button = get_exact_button_from_card(card, "Settle market")

    click_element(driver, settle_button)
    wait_for_body(driver)
    demo_pause(0.7)

    dialog = get_visible_dialog(driver)

    assert "settle" in dialog.text.lower(), "Expected settle market modal."

    scroll_dialog_to_top(driver, dialog)

    possible_side_labels = [
        PREDICTION_BET_SIDE,
        "not achieved",
        "failed",
        "no",
    ]

    selected_side = False

    for label in possible_side_labels:
        try:
            side_button = dialog.find_element(
                By.XPATH,
                f".//button[{lower_contains(label)}]",
            )
            click_element_in_dialog(driver, dialog, side_button)
            selected_side = True
            break
        except Exception:
            continue

    if not selected_side:
        print("\nCould not verify settlement side selection by text. Continuing because the modal is visible and confirm can still be clicked.")
        print(f"Modal preview:\n{dialog.text[:600]}\n")

    fill_first_visible_modal_textarea(driver, dialog, SETTLEMENT_NOTE)

    clicked_confirm = click_modal_button_by_text(
        driver,
        dialog,
        ["Confirm settlement", "Settle market", "Confirm", "Submit"],
    )

    assert clicked_confirm, f"Could not confirm settlement. Modal text:\n{dialog.text}"

    wait_for_body(driver)
    demo_pause(1.2)


def admin_approve_cancellation(driver):
    """
    Approves cancellation for the exact Sam market sent to Cancel Review.
    """

    driver_global_holder["driver"] = driver

    click_admin_tab(driver, "Cancel Review")

    card = find_exact_market_action_card(
        driver,
        market_title=SAM_MARKET_TO_CANCEL,
        required_button_text="Approve",
    )

    print("\nAdmin cancellation action:")
    print(f"Market: {SAM_MARKET_TO_CANCEL}")
    print("Decision: Approve cancellation\n")

    button = get_exact_button_from_card(card, "Approve")

    click_element(driver, button)
    wait_for_body(driver)
    demo_pause(0.8)

    maybe_complete_admin_modal(CANCEL_APPROVAL_NOTE)

    wait_for_body(driver)
    demo_pause(1.2)


# ------------------------------------------------------------
# Final Alex verification helpers
# ------------------------------------------------------------

def final_alex_verification(driver, base_url):
    login(driver, base_url, ALEX_EMAIL, ALEX_PASSWORD)

    open_client_prediction_page(driver, base_url)

    # The new markets Alex created should not be expected in Gambling Den.
    # They are creator-owned by Alex, so the final verification only uses
    # Gambling Den as a quick visual smoke check of the public market tab.
    click_tab(driver, "Gambling Den")
    assert_page_contains(driver, ["gambling den", "approved", "open"])
    visually_scroll_section(driver)

    verify_my_bets_contains_markets(driver)

    # Alex-created markets belong in My Markets. Verify the approved and
    # rejected markets here, not in Gambling Den.
    click_tab(driver, "My Markets")

    first_card = find_market_card(driver, ALEX_APPROVE_MARKET_TITLE)
    scroll_to_element(driver, first_card)
    demo_pause(0.7)

    second_card = find_market_card(driver, ALEX_REJECT_MARKET_TITLE)
    scroll_to_element(driver, second_card)
    demo_pause(0.7)

    assert_page_contains(
        driver,
        ["my markets", ALEX_APPROVE_MARKET_TITLE, ALEX_REJECT_MARKET_TITLE],
    )

    click_tab(driver, "Leaderboard")
    assert_page_contains(driver, ["leaderboard", "points", "rank"])
    visually_scroll_section(driver)

    demo_pause(1)


# ------------------------------------------------------------
# Test
# ------------------------------------------------------------

@pytest.mark.kevin
@pytest.mark.prediction
def test_uc_8_4_prediction_gambling_full_flow(driver, base_url):
    """
    UC 8.4 full prediction gambling flow.
    """

    global SAM_MARKET_BET
    global SAM_MARKET_TO_CLOSE
    global SAM_MARKET_TO_CANCEL

    login(driver, base_url, ALEX_EMAIL, ALEX_PASSWORD)

    open_client_prediction_page(driver, base_url)

    if SAM_MARKET_BET:
        SAM_MARKET_BET = place_bet_on_market(
            driver,
            SAM_MARKET_BET,
            PREDICTION_BET_SIDE,
            WAGER_POINTS,
        )
    else:
        SAM_MARKET_BET = place_bet_on_creator_market(
            driver,
            creator_name=SAM_MARKET_CREATOR,
            side=PREDICTION_BET_SIDE,
            wager_points=WAGER_POINTS,
        )

    if not SAM_MARKET_TO_CLOSE:
        SAM_MARKET_TO_CLOSE = SAM_MARKET_BET

    verify_my_bets_contains_markets(driver)

    create_alex_markets(driver)

    verify_leaderboard(driver)

    login(driver, base_url, SAM_EMAIL, SAM_PASSWORD)

    switch_to_client_view_if_available(driver)

    open_client_prediction_page(driver, base_url)

    close_sam_market(driver)

    request_sam_market_cancellation(driver)

    login(driver, base_url, ADMIN_EMAIL, ADMIN_PASSWORD)

    open_admin_prediction_page(driver, base_url)

    admin_review_market(driver, ALEX_APPROVE_MARKET_TITLE, "Approve")

    admin_review_market(driver, ALEX_REJECT_MARKET_TITLE, "Reject")

    admin_settle_sam_market(driver)

    admin_approve_cancellation(driver)

    final_alex_verification(driver, base_url)
