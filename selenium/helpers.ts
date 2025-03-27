// selenium/helpers.ts
import { WebDriver, By, until, WebElement } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';

// Navigate to a page
export const navigateTo = async (driver: WebDriver, route: string = '/'): Promise<void> => {
  global.debug(`Navigating to ${global.baseUrl}${route}`);
  await driver.get(`${global.baseUrl}${route}`);
  await driver.wait(async () => {
    const readyState = await driver.executeScript('return document.readyState');
    return readyState === 'complete';
  }, 10000, 'Page did not load completely');
};

// Find a visible element
export const findVisibleElement = async (
  driver: WebDriver,
  selector: string,
  timeout: number = 5000
): Promise<WebElement> => {
  global.debug(`Looking for element: ${selector}`);
  const element = await driver.wait(until.elementLocated(By.css(selector)), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
};

// Take a screenshot
export const takeScreenshot = async (driver: WebDriver, name: string): Promise<string> => {
  global.debug(`Taking screenshot: ${name}`);
  
  const screenshot = await driver.takeScreenshot();
  const dir = path.join(process.cwd(), 'selenium', 'screenshots', global.browserType);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const filepath = path.join(dir, `${name}.png`);
  fs.writeFileSync(filepath, screenshot, 'base64');
  return filepath;
};

// Find element by text
export const findElementByText = async (
  driver: WebDriver,
  tagName: string,
  text: string,
  timeout: number = 5000
): Promise<WebElement | null> => {
  global.debug(`Looking for ${tagName} with text: "${text}"`);
  
  try {
    const elements = await driver.findElements(By.css(tagName));
    
    for (const element of elements) {
      const elementText = await element.getText();
      if (elementText === text) {
        return element;
      }
    }
    
    return null;
  } catch (error) {
    global.debug(`Error finding ${tagName} with text: "${text}"`);
    return null;
  }
};

// Scroll to element
export const scrollToElement = async (driver: WebDriver, element: WebElement): Promise<void> => {
  await driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"})', element);
  await driver.sleep(500); // Wait for scroll to complete
};

// Click element
export const clickElement = async (driver: WebDriver, element: WebElement): Promise<void> => {
  await driver.wait(until.elementIsEnabled(element), 5000);
  await element.click();
};

// Check if element exists
export const elementExists = async (driver: WebDriver, selector: string): Promise<boolean> => {
  try {
    await driver.findElement(By.css(selector));
    return true;
  } catch (error) {
    return false;
  }
};