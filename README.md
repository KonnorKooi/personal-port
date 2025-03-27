# Personal Portfolio

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Portfolio Components

This portfolio includes several key components:

1. **Navigation Bar**
   - Logo and name display
   - Theme toggle button (dark/light mode)
   - Help button with project information panel

2. **Full-Page Sections**
   - Hero sections with background images and text overlays
   - Responsive design for different screen sizes

3. **Projects Showcase**
   - Card-based layout with project information
   - Links to live projects
   - Hover effects and animations

4. **Social Media Links**
   - Links to professional social profiles
   - Card-based design with icons and background images
   - External links that open in new tabs

5. **Resume Section**
   - Displays different resume versions
   - Links to Google Docs

6. **Theme Switching**
   - Toggle between dark and light modes
   - Persistent theme preference via localStorage

## Multi-Browser Selenium Testing

This project includes automated UI testing using Selenium WebDriver with support for multiple browsers. The tests validate core functionality of the portfolio site in both Chrome and Firefox.

### Critical: Display Setup for Linux Systems

**On Linux systems, you MUST run the display setup script before running tests.**

```bash
# Make the script executable
chmod +x selenium/setup-xvfb.sh

# Run the display setup script
npm run setup:xvfb
```

This setup script installs and starts Xvfb (X Virtual Framebuffer), which is essential for headless browsers to work properly. Even though Chrome and Firefox run in "headless" mode without a visible window, they still need an X server environment to render content internally.

**Why this is necessary:** Without a virtual display, browsers cannot initialize their rendering engines properly, resulting in the "unable to connect to renderer" error.

The script:
1. Sets up a virtual display on `:99`
2. Installs necessary dependencies for browser rendering
3. Makes this virtual display available for applications

### Installing WebDrivers

Before running tests, you need to install the appropriate WebDrivers for each browser:

```bash
# Install WebDrivers for all supported browsers
npm run install:drivers
```

This script automatically detects your installed browsers and installs the correct WebDriver versions. For Chrome, it ensures that the ChromeDriver version matches your installed Chrome version, which is required for compatibility.

### Running Tests

To run the Selenium tests:

```bash
# Run tests with Chrome
npm run test:chrome

# Run tests with Firefox
npm run test:firefox

# Run tests on all supported browsers
npm run test:all
```

### Test Results

Test results are printed to the console. Additionally, screenshots are captured at various stages of the tests and saved to the `selenium/screenshots/{browser}` directory for visual verification. This allows you to compare how your site renders in different browsers.

### What's Being Tested

The Selenium tests verify key functionality:

1. **Page Loading Test**
   - Verifies that the site loads correctly
   - Captures a screenshot of the homepage

2. **Navbar Test**
   - Confirms navbar visibility and structure
   - Verifies name display ("Konnor Kooi")
   - Captures navbar screenshot

3. **Projects Section Test**
   - Locates the Projects heading
   - Verifies project cards are displayed
   - Captures screenshot of the projects section

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.