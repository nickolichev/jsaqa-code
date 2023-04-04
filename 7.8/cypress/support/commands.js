// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Cypress.Commands.add("login", (login, password) => {
//   cy.contains("Log in").click();
//   cy.get("#mail").type(login);
//   cy.get("#pass").type(password);
//   cy.contains("Submit").click();
//   cy.contains("Добро пожаловать " + login).should("be.visible");
// });

import selectors from "../fixtures/selectors.json";

Cypress.Commands.add("authorization", (login, password) => {
  cy.get(selectors.admin.email).type(login);
  cy.get(selectors.admin.password).type(password);
  cy.get(selectors.admin.buttonLoginIn).click();
});

Cypress.Commands.add("mainPage", () => {
  cy.get(selectors.movi.title).should("be.visible");
  cy.get(selectors.movi.poster).should("have.length", 3);
  cy.get(selectors.movi.halls).should("have.length", 4);
});
