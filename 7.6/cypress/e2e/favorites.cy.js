beforeEach(() => {
  cy.visit("/booksNode");
  cy.login("bropet@mail.ru", "123");
});

describe("Добавляем книги в Favorites", () => {
  it('Добавляем книгу "И не сказал ни единого слова" ', () => {
    cy.add_Favorites(
      "И не сказал ни единого слова",
      "a:nth-child(1) > div > div.card-footer > button",
      "Delete from favorite",
      "h4"
    );
  });

  it('Добавляем книгу "Война и мир"', () => {
    cy.add_Favorites(
      "И не сказал ни единого слова",
      "a:nth-child(2) > div > div.card-footer > button",
      "Delete from favorite",
      "h4"
    );
  });

  it('Добавляем книгу "Мы были солдатами... и были молоды"', () => {
    cy.add_Favorites(
      "И не сказал ни единого слова",
      "a:nth-child(3) > div > div.card-footer > button",
      "Delete from favorite",
      "h4"
    );
  });
});

describe("Удаляем книги из Favorites", () => {
  it('Удаляем книгу "И не сказал ни единого слова"', () => {
    cy.delete_Favorites(
      "И не сказал ни единого слова",
      "a:nth-child(1) > div > div.card-footer > button",
      "Books list",
      "Add to favorite"
    );
  });

  it('Удаляем книгу "Война и мир"', () => {
    cy.delete_Favorites(
      "Война и мир",
      "a:nth-child(1) > div > div.card-footer > button",
      "Books list",
      "Add to favorite"
    );
  });

  it('Удаляем книгу "Мы были солдатами... и были молоды"', () => {
    cy.delete_Favorites(
      "Мы были солдатами... и были молоды",
      "a:nth-child(1) > div > div.card-footer > button",
      "Books list",
      "Add to favorite"
    );
  });
});
it("Не видим раздел Favorites, если пользователь не авторизован", () => {
  cy.contains("Favorites").should("be.visible");
  cy.contains("Log out").click();
  cy.contains("Favorites").should("not.exist");
});

it("Управление Favorites доступно под чужим логином", () => {
  cy.add_Favorites(
    "И не сказал ни единого слова",
    "a:nth-child(1) > div > div.card-footer > button",
    "Delete from favorite",
    "h4"
  );
  cy.contains("Log out").click();
  cy.login("test@test.com", "test");
  cy.delete_Favorites(
    "И не сказал ни единого слова",
    "a:nth-child(1) > div > div.card-footer > button",
    "Books list",
    "Add to favorite"
  );
});
