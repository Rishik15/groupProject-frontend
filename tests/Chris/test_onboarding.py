import time
import random
import string
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

def make_driver():
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()))

def random_email():
    suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
    return f"test_{suffix}@test.com"

def register(driver, name, email, password, role="client"):
    wait = WebDriverWait(driver, 10)
    driver.get(f"{BASE_URL}/register")
    wait.until(EC.presence_of_element_located((By.NAME, "name")))
    if role == "coach":
        driver.find_element(By.XPATH, "//*[contains(text(), 'Coach')]").click()
    else:
        driver.find_element(By.XPATH, "//*[contains(text(), 'Train')]").click()
    driver.find_element(By.NAME, "name").send_keys(name)
    driver.find_element(By.NAME, "email").send_keys(email)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.XPATH, "//button[contains(text(), 'Create Account')]").click()

def js_click(driver, element):
    driver.execute_script("arguments[0].scrollIntoView(true);", element)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", element)


def test_client_onboarding():
    driver = make_driver()
    wait = WebDriverWait(driver, 10)

    try:
        register(driver, "Test Client", random_email(), "TestPass@123", role="client")

        # Step 1 — Goals
        wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'What are your goals')]")))
        js_click(driver, driver.find_element(By.XPATH, "//*[contains(text(), 'Lose Weight')]"))
        js_click(driver, driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]"))

        # Step 2 — Profile info
        wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Tell us about yourself')]")))
        js_click(driver, driver.find_element(By.XPATH, "//*[contains(text(), 'Beginner')]"))

        inputs = driver.find_elements(By.XPATH, "//input[@type='number']")
        if len(inputs) >= 2:
            inputs[0].clear()
            inputs[0].send_keys("70")
            inputs[1].clear()
            inputs[1].send_keys("180")

        dob = driver.find_element(By.XPATH, "//input[@type='date' or contains(@placeholder, 'mm')]")
        dob.send_keys("01/01/1995")

        js_click(driver, driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]"))

        # Step 3 — Summary
        wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), \"You're all set\")]")))
        js_click(driver, driver.find_element(By.XPATH, "//button[contains(text(), 'Get Started')]"))

        wait.until(EC.url_contains("/client"))
        assert "/client" in driver.current_url

    finally:
        driver.quit()


def test_coach_onboarding():
    driver = make_driver()
    wait = WebDriverWait(driver, 10)

    try:
        register(driver, "Test Coach", random_email(), "TestPass@123", role="coach")

        # Step 1 — Primary specialties
        wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Primary Specialties')]")))
        js_click(driver, driver.find_element(By.XPATH, "//*[contains(text(), 'Strength Training')]"))
        js_click(driver, driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]"))

        # Step 2 — Secondary specialties
        wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Secondary Specialties')]")))
        js_click(driver, driver.find_element(By.XPATH, "//*[contains(text(), 'Yoga & Pilates')]"))
        js_click(driver, driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]"))

        # Step 3 — Who do you coach
        wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Who do you coach')]")))
        js_click(driver, driver.find_element(By.XPATH, "//h3[contains(text(), 'Beginners')]"))
        js_click(driver, driver.find_element(By.XPATH, "//span[contains(text(), 'Virtual / Online')]"))

        price_input = driver.find_element(By.XPATH, "//input[@placeholder='50']")
        price_input.clear()
        price_input.send_keys("50")

        js_click(driver, driver.find_element(By.XPATH, "//button[contains(text(), 'Add Block')]"))
        js_click(driver, driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]"))

        # Step 4 — Certifications
        wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Certifications')]")))

        num_certs = driver.find_element(By.XPATH, "//input[@placeholder='0']")
        num_certs.clear()
        num_certs.send_keys("1")
        time.sleep(1)

        wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='e.g., NASM CPT']")))
        driver.find_element(By.XPATH, "//input[@placeholder='e.g., NASM CPT']").send_keys("NASM CPT")
        driver.find_element(By.XPATH, "//input[@placeholder='e.g., National Academy of Sports Medicine']").send_keys("NASM")

        textareas = driver.find_elements(By.XPATH, "//textarea")
        textareas[0].send_keys("Certified personal trainer credential.")

        date_inputs = driver.find_elements(By.XPATH, "//input[@type='date']")
        date_inputs[0].send_keys("01/01/2020")
        date_inputs[1].send_keys("01/01/2025")

        exp_input = driver.find_element(By.XPATH, "//input[@placeholder='e.g., 5']")
        exp_input.clear()
        exp_input.send_keys("5")

        textareas = driver.find_elements(By.XPATH, "//textarea")
        textareas[-1].send_keys("Experienced coach with 5 years of training clients.")

        js_click(driver, driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]"))

        # Step 5 — Summary
        wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Submit Application')]")))
        js_click(driver, driver.find_element(By.XPATH, "//button[contains(text(), 'Submit Application')]"))

        wait.until(EC.url_contains("/coach"))
        assert "/coach" in driver.current_url

    finally:
        driver.quit()