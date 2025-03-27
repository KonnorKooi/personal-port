// selenium/browser-setup.ts
import { Builder, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import firefox from "selenium-webdriver/firefox";
import edge from "selenium-webdriver/edge";

// Get browser from environment or default to Chrome
export const getBrowserType = (): string => {
  return (process.env.WEBDRIVER_BROWSER || "chrome").toLowerCase();
};

// Create WebDriver for current browser
export async function createDriver(): Promise<WebDriver> {
  const browserType = getBrowserType();
  console.log(`Creating WebDriver for ${browserType}...`);

  let driver: WebDriver;

  switch (browserType) {
    case "firefox":
      const firefoxOptions = new firefox.Options();
      // Firefox headless is configured differently than Chrome
      firefoxOptions.addArguments("-headless");

      driver = await new Builder()
        .forBrowser("firefox")
        .setFirefoxOptions(firefoxOptions)
        .build();
      break;

    case "edge":
      const edgeOptions = new edge.Options();
      edgeOptions.addArguments("--headless=new");
      edgeOptions.addArguments("--disable-gpu");
      edgeOptions.addArguments("--no-sandbox");

      return new Builder()
        .forBrowser("MicrosoftEdge")
        .setEdgeOptions(edgeOptions)
        .build();

    case "chrome":
    default:
      const chromeOptions = new chrome.Options();
      chromeOptions.addArguments("--headless=new");
      chromeOptions.addArguments("--disable-gpu");
      chromeOptions.addArguments("--no-sandbox");
      chromeOptions.addArguments("--disable-dev-shm-usage");

      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .build();
      break;
  }

  // Set page load timeout
  await driver.manage().setTimeouts({ pageLoad: 30000, implicit: 5000 });
  return driver;
}
