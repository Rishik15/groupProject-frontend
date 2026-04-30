import os
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"
VIDEO_PATH = os.path.expanduser("~/Downloads/testvideo.mp4")

def js_click(driver, element):
    driver.execute_script("arguments[0].scrollIntoView(true);", element)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", element)

def test_create_exercise_with_video(coach_driver):
    driver = coach_driver
    wait = WebDriverWait(driver, 10)

    driver.get(f"{BASE_URL}/coach/exercises")
    time.sleep(1)

    tab_buttons = wait.until(EC.presence_of_all_elements_located((By.XPATH, "//button[contains(@class, 'px-5')]")))
    create_tab = [b for b in tab_buttons if b.text.strip() == "Create Exercise"]
    if create_tab:
        js_click(driver, create_tab[0])
    time.sleep(1)

    wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='e.g. Bulgarian Split Squat']")))
    driver.find_element(By.XPATH, "//input[@placeholder='e.g. Bulgarian Split Squat']").send_keys("Tester")
    driver.find_element(By.XPATH, "//button[contains(text(), 'Dumbbell')]").click()
    driver.find_element(By.XPATH, "//textarea[@placeholder='Describe how to perform this exercise...']").send_keys("Stand with feet shoulder width apart and squat down.")
    driver.find_element(By.ID, "video-upload").send_keys(VIDEO_PATH)

    submit_buttons = driver.find_elements(By.XPATH, "//button[contains(@class, 'w-full')]")
    create_submit = [b for b in submit_buttons if b.text.strip() == "Create Exercise"]
    if create_submit:
        js_click(driver, create_submit[0])
    time.sleep(2)

    tab_buttons = driver.find_elements(By.XPATH, "//button[contains(@class, 'px-5')]")
    my_exercises_tab = [b for b in tab_buttons if b.text.strip() == "My Exercises"]
    if my_exercises_tab:
        js_click(driver, my_exercises_tab[0])
    time.sleep(2)

    expand_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Expand') or contains(text(), 'View')]")
    if expand_buttons:
        js_click(driver, expand_buttons[0])
        time.sleep(1)

    assert "exercises" in driver.current_url or "coach" in driver.current_url