const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "1e1pt4",
  retries: 1,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    baseUrl: "http://qamid.tmweb.ru",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "**/cypress/integration/**/*.spec.js",
  },
});
