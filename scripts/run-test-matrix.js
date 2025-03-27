// scripts/run-test-matrix.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Define browsers to test
const browsers = ['chrome', 'firefox', 'edge'];
// If on macOS, add Safari
if (process.platform === 'darwin') {
  browsers.push('safari');
}

// Results object to keep track of test results
const results = {};

console.log('Starting test matrix across browsers...');

// Run tests for each browser
for (const browser of browsers) {
  console.log(`\n=== Running tests for ${browser} ===`);
  
  try {
    // Run tests for this browser
    execSync(`npm run test:${browser}`, { stdio: 'inherit' });
    results[browser] = { success: true, errorMessage: null };
    console.log(`✓ Tests for ${browser} completed successfully`);
  } catch (error) {
    results[browser] = { success: false, errorMessage: error.message };
    console.error(`✗ Tests for ${browser} failed: ${error.message}`);
  }
}

// Generate report
console.log('\n=== Browser Compatibility Test Report ===');
for (const browser of browsers) {
  const status = results[browser].success ? '✓ PASS' : '✗ FAIL';
  console.log(`${browser.padEnd(10)}: ${status}`);
}

console.log('\nTest matrix complete!');

// Save report to file
const reportDir = path.join(process.cwd(), 'selenium', 'reports');
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

const report = {
  date: new Date().toISOString(),
  browsers: results,
  summary: {
    total: browsers.length,
    passed: Object.values(results).filter(r => r.success).length,
    failed: Object.values(results).filter(r => !r.success).length
  }
};

fs.writeFileSync(
  path.join(reportDir, `test-matrix-report-${new Date().toISOString().replace(/:/g, '-')}.json`),
  JSON.stringify(report, null, 2)
);

// Exit with appropriate code
const allPassed = Object.values(results).every(r => r.success);
process.exit(allPassed ? 0 : 1);
