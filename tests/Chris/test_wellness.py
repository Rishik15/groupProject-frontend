import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

def test_submit_wellness_survey(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/client")
    time.sleep(1)

    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[.//div[text()='Mental Wellness']]")))
    driver.execute_script("arguments[0].click();", driver.find_element(By.XPATH, "//button[.//div[text()='Mental Wellness']]"))
    time.sleep(1)

    wait.until(EC.presence_of_element_located((By.XPATH, "//button[text()='5']")))
    driver.find_element(By.XPATH, "//button[text()='5']").click()
    time.sleep(0.5)

    number_inputs = driver.find_elements(By.XPATH, "//input[@type='number']")
    number_inputs[0].send_keys("7.5")
    number_inputs[1].send_keys("8")

    submit = driver.find_element(By.XPATH, "//button[contains(text(), 'Submit Survey')]")
    driver.execute_script("arguments[0].click();", submit)
    time.sleep(2)

    assert "client" in driver.current_url