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


def test_view_profile_edit(driver):
    login(driver, "example@example.com", "example1", "/client")
    driver.refresh()

    wait = WebDriverWait(driver, 10)

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='navbar-profile-icon']"))
    ).click()

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='My Profile']"))
    ).click()

    wait.until(EC.url_contains("/profile"))

    # enter edit mode (fix overlap)
    edit_btn = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    )
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", edit_btn)
    driver.execute_script("arguments[0].click();", edit_btn)

    # weight input
    weight = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "input[data-testid='weight']"))
    )
    weight.click()
    weight.send_keys(Keys.END)
    for _ in range(20):
        weight.send_keys(Keys.BACKSPACE)
    weight.send_keys("120")

    # save
    save_btn = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    )
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", save_btn)
    driver.execute_script("arguments[0].click();", save_btn)

    input("pause")
    assert "/profile" in driver.current_url