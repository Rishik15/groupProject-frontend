from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from login import login
import pytest


@pytest.fixture
def make_driver():
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()))



def test_delete_profile(driver, email, password, redirect):
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
delete_profile_flow(driver, "example@example.com", "example1", "/client")

time.sleep(10)




driver.quit()