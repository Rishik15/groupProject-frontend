import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

def click_meal_plans_tab(driver, wait):
    driver.get(f"{BASE_URL}/client/nutrition")
    time.sleep(2)
    tab = wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'tabs__tab') and contains(text(), 'Meal Plans')]")))
    driver.execute_script("arguments[0].click();", tab)
    time.sleep(1)

def test_view_meal_plans(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 15)
    click_meal_plans_tab(driver, wait)
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Library')]")))
    driver.find_element(By.XPATH, "//button[contains(text(), 'Library')]").click()
    time.sleep(1)
    assert "nutrition" in driver.current_url

def test_view_assigned_plans(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 15)
    click_meal_plans_tab(driver, wait)
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'My Plans')]")))
    driver.find_element(By.XPATH, "//button[contains(text(), 'My Plans')]").click()
    time.sleep(1)
    expand_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Expand')]")
    if expand_buttons:
        expand_buttons[0].click()
        time.sleep(1)
    assert "nutrition" in driver.current_url

def test_expand_and_edit_plan(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 15)
    click_meal_plans_tab(driver, wait)
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'My Plans')]")))
    driver.find_element(By.XPATH, "//button[contains(text(), 'My Plans')]").click()
    time.sleep(1)
    edit_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Edit')]")
    if edit_buttons:
        edit_buttons[0].click()
        time.sleep(1)
    assert "nutrition" in driver.current_url

def test_create_meal_plan(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 15)
    click_meal_plans_tab(driver, wait)
    wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Create Plan')]")))
    driver.find_element(By.XPATH, "//button[contains(text(), 'Create Plan')]").click()
    time.sleep(1)

    wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Example: High Protein Week']")))
    driver.find_element(By.XPATH, "//input[@placeholder='Example: High Protein Week']").send_keys("Test Meal Plan")

    date_inputs = driver.find_elements(By.XPATH, "//input[@type='date']")
    date_inputs[0].send_keys("04/28/2026")
    date_inputs[1].send_keys("05/04/2026")

    driver.find_element(By.XPATH, "//button[contains(text(), 'Add')]").click()
    time.sleep(1)

    driver.find_element(By.XPATH, "//button[contains(text(), 'Save Plan')]").click()
    time.sleep(2)

    assert "nutrition" in driver.current_url

def test_log_meal(client_driver):
    driver = client_driver
    wait = WebDriverWait(driver, 10)
    driver.get(f"{BASE_URL}/client/nutrition")
    time.sleep(2)
    btn = wait.until(EC.presence_of_element_located((By.XPATH, "//span[text()='Log Meal']")))
    driver.execute_script("arguments[0].click();", btn)
    time.sleep(1)
    wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='e.g. Homemade oatmeal']")))
    driver.find_element(By.XPATH, "//input[@placeholder='e.g. Homemade oatmeal']").send_keys("Chicken Rice Bowl")
    number_inputs = driver.find_elements(By.XPATH, "//input[@type='number' and @min='0']")
    number_inputs[0].send_keys("500")
    number_inputs[1].send_keys("40")
    number_inputs[2].send_keys("60")
    number_inputs[3].send_keys("15")
    date_input = driver.find_element(By.XPATH, "//input[@type='date']")
    date_input.send_keys("04/28/2026")
    driver.execute_script("arguments[0].click();", driver.find_element(By.XPATH, "//button[@data-slot='button' and contains(@class, 'bg-[#5E5EF4]')]"))
    time.sleep(2)
    assert "nutrition" in driver.current_url