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


def test_coach_contract(driver):
    login(driver, "example@client.com", "example1", "/client")
    driver.refresh()

    wait = WebDriverWait(driver, 10)

    wait.until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='Find Coaches']"))
    ).click()
    
    
    buttons = wait.until(
        EC.presence_of_all_elements_located((By.XPATH, "//button[.//text()[contains(., 'View Profile')]]"))
    )

    buttons[0].click()


    buttons = wait.until(
        EC.presence_of_all_elements_located((By.XPATH, "//button[.//text()[contains(., 'Request Coaching')]]"))
    )

    buttons[0].click()
    
    
    wait.until(
    EC.presence_of_element_located((By.NAME, "training_reason"))
    ).send_keys("I want help losing weight and staying consistent.")

    wait.until(
        EC.presence_of_element_located((By.NAME, "goals"))
    ).send_keys("Lose 15 pounds, build strength, improve endurance.")

    wait.until(
        EC.presence_of_element_located((By.NAME, "preferred_schedule"))
    ).send_keys("Weekdays after 6 PM")

    wait.until(
        EC.presence_of_element_located((By.NAME, "notes"))
    ).send_keys("No injuries. Beginner level.")
    
    buttons = wait.until(
        EC.presence_of_all_elements_located((By.XPATH, "//button[.//text()[contains(., 'Send request')]]"))
    )

    buttons[0].click()
    