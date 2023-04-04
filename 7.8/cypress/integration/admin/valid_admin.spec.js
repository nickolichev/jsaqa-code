import admin from "../../fixtures/admin.json";
import selectors from "../../fixtures/selectors.json";

describe("Тестируем вход в админку", () => {
  beforeEach(() => {
    cy.visit(selectors.admin.urlAdmin);
  });

  it("Вход с валидными данными", () => {
    cy.authorization(admin.valid.login, admin.valid.password);
    cy.contains(selectors.admin.successfulLogin).should("be.visible");
  });
});