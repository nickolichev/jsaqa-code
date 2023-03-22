it.skip("Add books in the Book list", () => {
  // добавляем 1-ю книгу
  cy.visit("/booksNode");
  cy.login("bropet@mail.ru", "123");
  cy.contains("Books list").click();
  cy.contains("Add new").should("be.visible");
  cy.contains("Add new").click();
  cy.contains("Book description").should("be.visible");
  cy.get("#title").type("И не сказал ни единого слова");
  cy.get("#description").type(
    "Роман немецкого писателя Генриха Бёлля, вышедший в свет в издательстве «Kiepenheuer & Witsch» в 1953 году. В романе описывается жизнь многодетной семейной пары в послевоенное время в Германии, которая живет в абсолютной нищете в тесной комнатке и несмотря ни на что борется за сохранение своей любви."
  );
  cy.get("#authors").type("Генрих Бёлль");
  cy.contains("Submit").click();
  cy.contains("Генрих Бёлль").click();
  cy.contains("Dowload book").should("be.visible");
  cy.contains("Books list").click();
  // добавляем 2-ю книгу
  cy.contains("Add new").click();
  cy.contains("Book description").should("be.visible");
  cy.get("#title").type("Война и мир");
  cy.get("#description").type(
    "Роман-эпопея Льва Николаевича Толстого, описывающий русское общество в эпоху войн против Наполеона в 1805—1812 годах. Эпилог романа доводит повествование до 1820 года."
  );
  cy.get("#authors").type("Л.Н.Толстой");
  cy.contains("Submit").click();
  cy.contains("Война и мир").click();
  cy.contains("Dowload book").should("be.visible");
  cy.contains("Books list").click();
  // добавляем 3-ю книгу
  cy.contains("Add new").click();
  cy.contains("Book description").should("be.visible");
  cy.get("#title").type("Мы были солдатами... и были молоды");
  cy.get("#description").type(
    'Мемуары генерал-лейтенанта в отставке Гарольда Мура, командовавшего 1-м батальоном 7-го кавалерийского полка 1-й кавалерийской дивизии в ходе сражения войны во Вьетнаме в долине Йа-Дранг. Соавтором Мура выступил журналист Джозеф Гэллоуэй, оказавшийся в центре этого сражения. Книга посвящена как военным США, так и погибшим бойцам 320-го, 33-го и 66-го полков Вьетнамской народной армии. Они все были солдатами. В 2002 г. была поставлена экранизация ("Мы были молоды")'
  );
  cy.get("#authors").type("Гарольд Мур");
  cy.contains("Submit").click();
  cy.contains("Мы были солдатами... и были молоды").click();
  cy.contains("Dowload book").should("be.visible");
  cy.contains("Books list").click();
});

it.skip("Remove book", () => {
  cy.visit("/booksNode");
  cy.login("bropet@mail.ru", "123");
  cy.contains("Books list").click();
  cy.get('[href="book/12aa5213-f26f-4634-862b-987caef52638"]').then(($el) => {
    $el.remove();
    cy.contains("Генрих Бёлль").should("not.exist");
  });
});
