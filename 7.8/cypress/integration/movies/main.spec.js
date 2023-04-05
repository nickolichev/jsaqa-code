import selectors from "../../fixtures/selectors.json";

describe("Тестируем отображение главной страницы", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("Корректно отображается главная страница в каждый выбранный день", () => {
    cy.get(selectors.movi.today).should("exist");
    cy.mainPage;

    cy.get(selectors.movi.days)
      .not(selectors.movi.today)
      .each(($el) => {
        cy.wrap($el).click();
        cy.wrap($el).should("exist", selectors.movi.dateChosen);
        cy.mainPage;
      });
  });
});