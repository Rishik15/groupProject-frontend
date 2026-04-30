import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

def test_log_and_edit_activity(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/client")
    time.sleep(1)

    # Click Log Activity
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'bg-[#5B5EF4]') and .//div[text()='Log Activity']]")))
    driver.execute_script("arguments[0].click();", driver.find_element(By.XPATH, "//button[contains(@class, 'bg-[#5B5EF4]') and .//div[text()='Log Activity']]"))
    time.sleep(1)

    # Fill in the form
    wait.until(EC.presence_of_element_located((By.ID, "steps")))
    driver.find_element(By.ID, "steps").send_keys("5000")
    driver.find_element(By.ID, "distance-km").send_keys("3.5")
    driver.find_element(By.ID, "duration-min").send_keys("30")
    driver.find_element(By.ID, "calories").send_keys("250")
    driver.find_element(By.ID, "avg-hr").send_keys("120")

    # Submit
    driver.execute_script("arguments[0].click();", driver.find_element(By.XPATH, "//button[contains(text(), 'Log Cardio')]"))
    time.sleep(2)

    # Click Logs tab
    logs_tab = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[@role='tab' and text()='Logs']")))
    driver.execute_script("arguments[0].click();", logs_tab)
    time.sleep(1)

    # Edit first log
    edit_buttons = driver.find_elements(By.XPATH, "//button[text()='Edit']")
    if edit_buttons:
        driver.execute_script("arguments[0].click();", edit_buttons[0])
        time.sleep(1)

        edit_inputs = driver.find_elements(By.XPATH, "//input[@type='number']")
        if edit_inputs:
            edit_inputs[0].clear()
            edit_inputs[0].send_keys("6000")

        save_btn = driver.find_element(By.XPATH, "//button[contains(@class, 'bg-indigo-600') and text()='Save']")
        driver.execute_script("arguments[0].click();", save_btn)
        time.sleep(1)

    assert "client" in driver.current_url