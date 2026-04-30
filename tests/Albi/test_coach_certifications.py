from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from login import login
import pytest
from datetime import datetime


#working
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
    
def set_issue_date(driver, wait, index, month, day, year):
    base = f"[data-testid='Issue Date{index}']"

    month_el = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, f"{base} [data-type='month']"))
    )
    day_el = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, f"{base} [data-type='day']"))
    )
    year_el = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, f"{base} [data-type='year']"))
    )

    month_el.click()
    month_el.send_keys(Keys.COMMAND, "a")
    month_el.send_keys(str(month))

    day_el.click()
    day_el.send_keys(Keys.COMMAND, "a")
    day_el.send_keys(str(day))

    year_el.click()
    year_el.send_keys(Keys.COMMAND, "a")
    year_el.send_keys(str(year))

def save(driver):
    el = driver.find_element(By.CSS_SELECTOR, "[data-testid='save']")
    el.click()
    
def set_expiration_date(driver, wait, index, month, day, year):
    base = f"[data-testid='Expires Date{index}']"

    month_el = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, f"{base} [data-type='month']"))
    )
    day_el = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, f"{base} [data-type='day']"))
    )
    year_el = wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, f"{base} [data-type='year']"))
    )

    month_el.click()
    month_el.send_keys(Keys.COMMAND, "a")
    month_el.send_keys(str(month))

    day_el.click()
    day_el.send_keys(Keys.COMMAND, "a")
    day_el.send_keys(str(day))

    year_el.click()
    year_el.send_keys(Keys.COMMAND, "a")
    year_el.send_keys(str(year))
    

def open_coach_profile(driver):
    login(driver, "sam@example.com", "Rishik@1", "/coach")
    driver.refresh()
    driver.maximize_window()

    wait = WebDriverWait(driver, 10)

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='navbar-profile-icon']"))
    ).click()

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='My Profile']"))
    ).click()

    wait.until(EC.url_contains("/profile"))

    return wait


def test_remove_certification(driver):
    wait = open_coach_profile(driver)
    
    edit_btn = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    )
    
    driver.execute_script("arguments[0].click();", edit_btn)

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='edit-certifications']"))
    ).click()
    
    name_inputs = wait.until(
        EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, "[data-testid^='certification-name-']")
        )
    )

    index = name_inputs[0].get_attribute("data-testid").split("-")[-1]

    wait.until(
        EC.element_to_be_clickable(
            (By.CSS_SELECTOR, f"[data-testid='delete-cert-{index}']")
        )
    ).click()
    save(driver)

    return

def test_update_first_certification(driver):
    wait = open_coach_profile(driver)

    edit_btn = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    )
    driver.execute_script("arguments[0].click();", edit_btn)

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='edit-certifications']"))
    ).click()

    certifications = wait.until(
        EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, "[data-testid^='certification-name-']")
        )
    )

    first = certifications[0]
    index = first.get_attribute("data-testid").split("-")[-1]

    name = driver.find_element(
        By.CSS_SELECTOR, f"[data-testid='certification-name-{index}']"
    )
    name.click()
    name.send_keys(Keys.COMMAND, "a")
    name.send_keys("Updated Name")

    provider = driver.find_element(
        By.CSS_SELECTOR, f"[data-testid='provider-name-{index}']"
    )
    provider.click()
    provider.send_keys(Keys.COMMAND, "a")
    provider.send_keys("Updated Provider")

    description = driver.find_element(
        By.CSS_SELECTOR, f"[data-testid='description-name-{index}']"
    )
    description.click()
    description.send_keys(Keys.COMMAND, "a")
    description.send_keys("Updated Description")

    set_issue_date(driver, wait, index, 2, 2, 2027)
    set_expiration_date(driver, wait, index, 3, 3, 2028)

    save(driver)

def test_add_certification(driver):
    wait = open_coach_profile(driver)

    edit_btn = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    )

    driver.execute_script("arguments[0].click();", edit_btn)

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='edit-certifications']"))
    ).click()

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='add-certification']"))
    ).click()

    certifications = wait.until(
        EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, "[data-testid^='certification-name-']")
        )
    )

    last_certification = certifications[-1]
    index = last_certification.get_attribute("data-testid").split("-")[-1]

    last_certification.send_keys("Example Name")

    driver.find_element(
        By.CSS_SELECTOR, f"[data-testid='provider-name-{index}']"
    ).send_keys("Example Provider")

    driver.find_element(
        By.CSS_SELECTOR, f"[data-testid='description-name-{index}']"
    ).send_keys("Example Description")


    set_issue_date(driver, wait, index, 1, 1, 2026)
    set_expiration_date(driver, wait, index, 2, 2, 2026)
    save(driver)
    