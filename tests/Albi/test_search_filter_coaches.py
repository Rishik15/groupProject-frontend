from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from login import login
import pytest
from selenium.webdriver.common.keys import Keys

BASE_URL = "http://localhost:5173"

#working

@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()

    prefs = {
        "credentials_enable_service": False,
        "profile.password_manager_enabled": False,
        "profile.password_manager_leak_detection": False,
    }

    options.add_experimental_option("prefs", prefs)
    options.add_argument("--disable-save-password-bubble")
    options.add_argument("--disable-features=PasswordLeakDetection")

    d = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )

    yield d
    d.quit()


def search_coaches(driver, text):
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/coaches")

    search_bar = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='search']"))
    )

    search_bar.click()
    search_bar.clear()
    search_bar.send_keys(text)


def filter_coaches(driver):
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/coaches")

    filter_btn = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='filters']"))
    )
    filter_btn.click()

    strength = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Strength']"))
    )
    strength.click()

    slider = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='max_price']"))
    )

    slider.click()

    for _ in range(5):
        slider.send_keys(Keys.ARROW_LEFT)

    certified_checkbox = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//label[.//span[text()='Certified only']]"))
    )
    certified_checkbox.click()


def test_search_filter_coaches(driver):
    search_coaches(driver, "Sam")
    # filter_coaches(driver)
