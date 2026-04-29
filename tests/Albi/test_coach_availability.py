from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from login import login
import pytest
import time
from datetime import datetime

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


def test_edit_avaialblity(driver):
    wait = open_coach_profile(driver)
    
    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    ).click()
    
    driver.execute_script("window.scrollBy(0, 500);")

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='day-select-trigger']"))
    ).click()

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='day-option-Mon']"))
    ).click()

    start_inputs = wait.until(
        EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, "[data-testid^='start-time-']")
        )
    )

    first_start = start_inputs[0]

    first_start.click()

    active = driver.switch_to.active_element
    active.send_keys("09")
    active.send_keys(Keys.TAB)
    active.send_keys("00")
    
    end_inputs = driver.find_elements(
        By.CSS_SELECTOR, "[data-testid^='end-time-']"
    )

    first_end = end_inputs[0]

    first_end.click()

    active = driver.switch_to.active_element
    active.send_keys("17")
    active.send_keys(Keys.TAB)
    active.send_keys("00")
    driver.execute_script("window.scrollTo(0, 0);")
    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    ).click()
        
def test_add_availability(driver):
    wait = open_coach_profile(driver)
    
    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    ).click()
    driver.execute_script("window.scrollBy(0, 550);")

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='add']"))
    ).click()
    driver.execute_script("window.scrollTo(0, 0);")
    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    ).click()
        
def test_remove_availability(driver):
    wait = open_coach_profile(driver)
    
    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    ).click()
    
    elements = driver.find_elements(By.CSS_SELECTOR, "[data-testid^='remove-']")
    
    driver.execute_script("window.scrollBy(0, 500);")

    elements[0].click()
    driver.execute_script("window.scrollTo(0, 0);")

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='edit-button']"))
    ).click()
    
    return