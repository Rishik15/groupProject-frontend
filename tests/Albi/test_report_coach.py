from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from login import login
import pytest

BASE_URL = "http://localhost:5173"


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


def test_report_coach(driver):
    login(driver, "alex@example.com", "Rishik@1", "/client")
    driver.refresh()

    wait = WebDriverWait(driver, 10)

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='navbar-profile-icon']"))
    ).click()

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='Settings']"))
    ).click()

    wait.until(EC.url_contains("/settings"))

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='Help & Support']"))
    ).click()

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='Report a Coach']"))
    ).click()

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='coach']"))
    ).click()

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='select']"))
    ).click()

    reason = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//*[normalize-space()='Harassment']"
        ))
    )
    driver.execute_script("arguments[0].click();", reason)


    details = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='details']"))
    )

    driver.execute_script("""
        arguments[0].value = 'Coach was being disrespectful during the session.';
        arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
        arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
    """, details)
    
    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='checkbox']"))
    ).click()

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='submit']"))
    ).click()
