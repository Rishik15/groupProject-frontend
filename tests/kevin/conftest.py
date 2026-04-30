import os
import time

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


TIMEOUT = 12
DEMO_SLEEP = float(os.getenv("DEMO_SLEEP", "1"))
LOGIN_SETTLE_SLEEP = float(os.getenv("LOGIN_SETTLE_SLEEP", "3"))


def demo_pause(multiplier=1):
    time.sleep(max(0, DEMO_SLEEP * float(multiplier)))


def settle_pause(seconds):
    time.sleep(max(0, float(seconds)))


@pytest.fixture
def base_url():
    return os.getenv("BASE_URL", "http://localhost:5173")


@pytest.fixture
def driver():
    options = Options()
    options.add_argument("--start-maximized")

    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()


def login(driver, base_url, email, password):
    driver.get(f"{base_url}/signin")

    wait = WebDriverWait(driver, TIMEOUT)

    email_input = wait.until(
        EC.presence_of_element_located((By.NAME, "email"))
    )
    password_input = wait.until(
        EC.presence_of_element_located((By.NAME, "password"))
    )

    email_input.clear()
    email_input.send_keys(email)

    password_input.clear()
    password_input.send_keys(password)

    sign_in_button = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(normalize-space(.), 'Sign In')]")
        )
    )
    sign_in_button.click()

    wait.until(lambda d: "/signin" not in d.current_url)
    settle_pause(LOGIN_SETTLE_SLEEP)


@pytest.fixture
def client_driver(driver, base_url):
    login(
        driver,
        base_url,
        os.getenv("CLIENT_EMAIL", "alex@example.com"),
        os.getenv("CLIENT_PASSWORD", "Rishik@1"),
    )
    return driver


@pytest.fixture
def coach_driver(driver, base_url):
    login(
        driver,
        base_url,
        os.getenv("COACH_EMAIL", "taylor@example.com"),
        os.getenv("COACH_PASSWORD", "Rishik@1"),
    )
    return driver
