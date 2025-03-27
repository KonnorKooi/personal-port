#!/bin/bash
# selenium/setup-xvfb.sh

# Check if running on Linux
if [[ "$(uname)" != "Linux" ]]; then
  echo "This script is only needed on Linux systems."
  exit 0
fi

# Check if Xvfb is installed
if ! command -v Xvfb &> /dev/null; then
  echo "Installing Xvfb and dependencies..."
  sudo apt-get update
  sudo apt-get install -y xvfb libxcomposite1 libxcursor1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0
else
  echo "Xvfb is already installed"
fi

# Kill any existing Xvfb processes
pkill Xvfb || true

# Start Xvfb
echo "Starting Xvfb on display :99..."
Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &

# Export the display
export DISPLAY=:99

echo "Xvfb started on display :99"
echo "You can now run your Selenium tests"
