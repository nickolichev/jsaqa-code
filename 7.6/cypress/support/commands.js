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

Cypress.Commands.add("login", (login, password) => {
  cy.contains("Log in").click();
  cy.get("#mail").type(login);
  cy.get("#pass").type(password);
  cy.contains("Submit").click();
  cy.contains("Добро пожаловать " + login).should("be.visible");
});

Cypress.Commands.add(
  "add_Favorites",
  (title, button_add, button_delete, favorites) => {
    cy.contains("Books list").click();
    cy.contains(title).should("be.visible");
    cy.get(button_add).click();
    cy.contains(button_delete).should("be.visible");
    cy.get(favorites).click();
    cy.contains(title).should("be.visible");
  }
);

Cypress.Commands.add(
  "delete_Favorites",
  (title, button_delete, bookList, button_add) => {
    cy.contains("Favorites").click();
    cy.contains(title).should("be.visible");
    cy.get(button_delete).click();
    cy.contains(title).should("not.exist");
    cy.reload();
    cy.contains(bookList).click();
    cy.contains(title).should("be.visible");
    cy.contains(button_add).should("be.visible");
  }
);
