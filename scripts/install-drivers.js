// scripts/install-drivers.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Detect Chrome version and install matching ChromeDriver
function installChromeDriver() {
  console.log('Installing ChromeDriver...');
  try {
    // Get Chrome version
    let chromeVersion = '';
    let chromeCmd = '';
    
    if (process.platform === 'linux') {
      chromeCmd = 'google-chrome --version';
    } else if (process.platform === 'darwin') {
      chromeCmd = '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --version';
    } else if (process.platform === 'win32') {
      chromeCmd = 'reg query "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\BLBeacon" /v version';
    }
    
    try {
      const output = execSync(chromeCmd).toString();
      // Extract version number (major version only)
      const match = output.match(/[\d]+\.[\d]+\.[\d]+\.[\d]+/);
      if (match) {
        chromeVersion = match[0].split('.')[0]; // Get major version
      }
    } catch (e) {
      console.log('Could not detect Chrome version, using latest ChromeDriver');
    }
    
    // Install matching ChromeDriver
    if (chromeVersion) {
      console.log(`Detected Chrome version: ${chromeVersion}`);
      execSync(`npm install chromedriver@^${chromeVersion} --save-dev`, { stdio: 'inherit' });
    } else {
      execSync('npm install chromedriver --save-dev', { stdio: 'inherit' });
    }
    
    console.log('ChromeDriver installed successfully');
  } catch (error) {
    console.error('Error installing ChromeDriver:', error);
  }
}

// Install geckodriver for Firefox
function installGeckodriver() {
  console.log('Installing geckodriver for Firefox...');
  try {
    execSync('npm install geckodriver --save-dev', { stdio: 'inherit' });
    console.log('geckodriver installed successfully');
  } catch (error) {
    console.error('Error installing geckodriver:', error);
  }
}

// Add this function:
function installEdgeDriver() {
  console.log('Installing Microsoft Edge WebDriver...');
  try {
    // Edge WebDriver is handled via MSEDGEDRIVER_VERSION environment variable
    // or automatically by selenium-webdriver
    console.log('Edge WebDriver will be managed by selenium-webdriver');
    console.log('Make sure Microsoft Edge is installed on your system');
  } catch (error) {
    console.error('Error setting up Edge WebDriver:', error);
  }
}

// And call it in your command handler:
if (browser === 'all' || browser === 'edge') {
  installEdgeDriver();
}

// Install drivers based on command
const browser = process.argv[2] || 'all';

if (browser === 'all' || browser === 'chrome') {
  installChromeDriver();
}

if (browser === 'all' || browser === 'firefox') {
  installGeckodriver();
}

console.log('Driver installation complete!');