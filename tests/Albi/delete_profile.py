from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

BASE_URL = "http://localhost:5173"

def make_driver():
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()))

def login(driver, email, password, redirect):
    driver.get(f"{BASE_URL}/signin")

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, "email"))
    )

    driver.find_element(By.NAME, "email").send_keys(email)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.XPATH, "//button[text()='Sign In']").click()

    WebDriverWait(driver, 10).until(
        EC.url_contains(redirect)
    )
  

def delete_profile_flow(driver, email, password, redirect):
    login(driver, email, password, redirect)
    
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='navbar-profile-icon']"))
    ).click()

    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='Settings']"))
    ).click()

    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='delete-account']"))
    ).click()

    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-testid='delete-confirm']"))
    ).click()
    

 
driver = make_driver()

delete_profile_flow(driver)


time.sleep(10)




driver.quit()