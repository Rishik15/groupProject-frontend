from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"

def test_browse_exercises(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/client/createWorkout")
    wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Search exercises...']")))

    exercises = driver.find_elements(By.XPATH, "//button[contains(text(), '+ Add to Plan')]")
    time.sleep(2)
    assert len(exercises) > 0

def test_search_exercises(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/client/createWorkout")
    search = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Search exercises...']")))
    search.send_keys("curl")

    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), '+ Add to Plan')]")))
    exercises = driver.find_elements(By.XPATH, "//button[contains(text(), '+ Add to Plan')]")
    time.sleep(2)
    assert len(exercises) > 0

def test_filter_exercises_by_category(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/client/createWorkout")
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Barbell')]")))

    driver.find_element(By.XPATH, "//button[contains(text(), 'Barbell')]").click()

    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), '+ Add to Plan')]")))
    exercises = driver.find_elements(By.XPATH, "//button[contains(text(), '+ Add to Plan')]")
    time.sleep(2)
    assert len(exercises) > 0