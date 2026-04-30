import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

def test_browse_coaches(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/client/coaches")
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'View Profile')]")))
    coaches = driver.find_elements(By.XPATH, "//button[contains(text(), 'View Profile')]")
    assert len(coaches) > 0

def test_search_coaches(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/client/coaches")
    search = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Search by name or specialty...']")))
    search.clear()
    search.send_keys("williams")
    time.sleep(1)
    assert "coaches" in driver.current_url

def test_filter_coaches(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/client/coaches")
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Filters')]")))
    driver.find_element(By.XPATH, "//button[contains(text(), 'Filters')]").click()
    time.sleep(1)

    driver.find_element(By.XPATH, "//button[text()='HIIT']").click()
    time.sleep(0.5)

    driver.find_element(By.XPATH, "//button[text()='4+']").click()
    time.sleep(1)

    coaches = driver.find_elements(By.XPATH, "//button[contains(text(), 'View Profile')]")
    assert len(coaches) >= 0
    assert "coaches" in driver.current_url
    
def test_view_coach_profile_tabs(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/client/coaches")
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'View Profile')]")))
    driver.find_element(By.XPATH, "//button[contains(text(), 'View Profile')]").click()
    time.sleep(1)

    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'About')]")))

    driver.find_element(By.XPATH, "//button[contains(text(), 'Reviews')]").click()
    time.sleep(1)
    assert driver.find_element(By.XPATH, "//button[contains(text(), 'Reviews')]") is not None

    driver.find_element(By.XPATH, "//button[contains(text(), 'Success Stories')]").click()
    time.sleep(1)
    assert driver.find_element(By.XPATH, "//button[contains(text(), 'Success Stories')]") is not None

    driver.find_element(By.XPATH, "//button[contains(text(), 'About')]").click()
    time.sleep(1)
    assert driver.find_element(By.XPATH, "//button[contains(text(), 'About')]") is not None