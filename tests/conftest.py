import pytest
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

def make_driver():
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()))

def login(driver, email, password, redirect):
    driver.get(f"{BASE_URL}/signin")
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "email")))
    driver.find_element(By.NAME, "email").send_keys(email)
    driver.find_element(By.NAME, "password").send_keys(password)
    driver.find_element(By.XPATH, "//button[text()='Sign In']").click()
    WebDriverWait(driver, 10).until(EC.url_contains(redirect))

@pytest.fixture
def client_driver():
    driver = make_driver()
    login(driver, "alex@example.com", "Rishik@1", "/client")
    yield driver
    driver.quit()

@pytest.fixture
def coach_driver():
    driver = make_driver()
    login(driver, "sam@example.com", "Rishik@1", "/coach")
    yield driver
    driver.quit()

@pytest.fixture
def admin_driver():
    driver = make_driver()
    login(driver, "liam@example.com", "Rishik@1", "/admin")
    yield driver
    driver.quit()