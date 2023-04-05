import admin from "../../fixtures/admin.json";
import selectors from "../../fixtures/selectors.json";

describe("Тестируем вход в админку", () => {
  beforeEach(() => {
    cy.visit(selectors.admin.urlAdmin);
  });

  it("Вход с невалидным логином", () => {
    cy.authorization(admin.invalid.login, admin.valid.password);
    cy.contains(selectors.admin.authorisationError).should("be.visible");
  });

  it("Вход с невалидным паролем", () => {
    cy.authorization(admin.valid.login, admin.invalid.password);
    cy.contains(selectors.admin.authorisationError).should("be.visible");
  });

  it("Вход с пустым логином", () => {
    cy.authorization(admin.empty.login, admin.valid.password);
    cy.get(selectors.admin.email)
      .then((element) => element[0].checkValidity())
      .should("be.false");
  });

  it("Вход с пустым паролем", () => {
    cy.authorization(admin.valid.login, admin.empty.password);
    cy.contains(selectors.admin.authorisationError).should("be.visible");
  });
});