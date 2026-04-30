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


def test_coach_sets_prices(driver):
    login(driver, "sam@example.com", "Rishik@1", "/coach")
    driver.refresh()

    wait = WebDriverWait(driver, 10)

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='navbar-profile-icon']"))
    ).click()

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='My Profile']"))
    ).click()

    wait.until(EC.url_contains("/profile"))

    edit_btn = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    )
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", edit_btn)
    driver.execute_script("arguments[0].click();", edit_btn)

    price = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[data-testid='price']"))
    )
    price.click()
    price.send_keys(Keys.END)

    for _ in range(20):
        price.send_keys(Keys.BACKSPACE)

    price.send_keys("5")

    save_btn = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    )
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", save_btn)
    driver.execute_script("arguments[0].click();", save_btn)

