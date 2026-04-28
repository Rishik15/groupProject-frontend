from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

def test_login_client(client_driver):
    assert "/client" in client_driver.current_url

def test_login_coach(coach_driver):
    assert "/coach" in coach_driver.current_url

def test_login_admin(admin_driver):
    assert "/admin" in admin_driver.current_url

def test_logout(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 10)

    dropdown = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.mt-0\\.5")))
    dropdown.click()

    sign_out = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Sign out']")))
    sign_out.click()

    wait.until(EC.url_contains("/signin"))
    assert "/signin" in driver.current_url