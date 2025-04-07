import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: "src/components/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1200,
    viewportHeight: 800,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    }
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1200,
    viewportHeight: 800,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    }
  }
});
