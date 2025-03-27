// selenium/setup.ts
import { WebDriver } from 'selenium-webdriver';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';
import path from 'path';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';
import { Builder } from 'selenium-webdriver';

// Global declarations
declare global {
  var driver: WebDriver;
  var nextServer: ChildProcess | null;
  var baseUrl: string;
  var debug: (message: string) => void;
  var browserType: string;
}

// Create a browser instance based on environment variable
async function createDriver(): Promise<WebDriver> {
  const browserType = (process.env.WEBDRIVER_BROWSER || 'chrome').toLowerCase();
  
  if (browserType === 'firefox') {
    const options = new firefox.Options();
    // For Firefox headless mode
    options.addArguments('-headless');
    return new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();
  } else {
    // Default to Chrome
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    return new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }
}

// Setup before all tests
beforeAll(async () => {
  // Configure debug logging
  global.debug = (message: string) => {
    console.log(`[DEBUG] ${message}`);
  };
  
  global.browserType = (process.env.WEBDRIVER_BROWSER || 'chrome').toLowerCase();
  global.debug(`Setting up tests using browser: ${global.browserType}`);
  
  try {
    // For Linux systems, ensure DISPLAY is set
    if (process.platform === 'linux') {
      if (!process.env.DISPLAY) {
        process.env.DISPLAY = ':99';
        global.debug(`Setting DISPLAY=${process.env.DISPLAY} for Linux`);
      } else {
        global.debug(`Using existing DISPLAY=${process.env.DISPLAY}`);
      }
    }
    
    // Check if the dev server is already running
    let isServerRunning = false;
    try {
      const response = await fetch('http://localhost:3000');
      isServerRunning = response.status === 200;
      global.debug('Dev server already running');
    } catch (error) {
      global.debug('Dev server not detected, will start a new one');
      isServerRunning = false;
    }

    // Start Next.js server if needed
    if (!isServerRunning) {
      global.debug('Starting Next.js development server...');
      
      global.nextServer = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        detached: true
      });
      
      // Wait for server to start
      let serverReady = false;
      const maxRetries = 15;
      let retries = 0;
      
      while (!serverReady && retries < maxRetries) {
        try {
          const response = await fetch('http://localhost:3000');
          if (response.status === 200) {
            serverReady = true;
            global.debug('Server is now ready');
          }
        } catch (error) {
          global.debug(`Server not ready yet, retry ${retries + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          retries++;
        }
      }
      
      if (!serverReady) {
        throw new Error('Could not connect to Next.js server after multiple attempts');
      }
    }

    // Set base URL
    global.baseUrl = 'http://localhost:3000';
    global.debug(`Base URL set to ${global.baseUrl}`);

    // Create WebDriver
    global.driver = await createDriver();
    global.debug('WebDriver created successfully');
    
    // Test initial page load
    await global.driver.get(global.baseUrl);
    global.debug('Initial page load complete');
    
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  // Save final screenshot
  if (global.driver) {
    try {
      const screenshot = await global.driver.takeScreenshot();
      const screenshotsDir = path.join(process.cwd(), 'selenium', 'screenshots', global.browserType);
      
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(screenshotsDir, `final-state.png`), screenshot, 'base64');
      global.debug('Final screenshot saved');
    } catch (error) {
      global.debug(`Failed to take final screenshot: ${error}`);
    }
  }

  // Close WebDriver
  if (global.driver) {
    global.debug('Closing WebDriver...');
    try {
      await global.driver.quit();
      global.debug('WebDriver closed successfully');
    } catch (error) {
      global.debug(`Error closing WebDriver: ${error}`);
    }
  }

  // Stop Next.js server if we started it
  if (global.nextServer) {
    global.debug('Stopping Next.js server...');
    try {
      // On Windows, process.kill() behaves differently
      if (process.platform === 'win32') {
        global.nextServer.kill();
      } else if (global.nextServer.pid !== undefined) {
        process.kill(-global.nextServer.pid);
      } else {
        global.debug('Cannot stop server: Process ID is undefined');
      }
      global.debug('Next.js server stopped');
    } catch (error) {
      global.debug(`Error stopping Next.js server: ${error}`);
    }
    global.nextServer = null;
  }
});