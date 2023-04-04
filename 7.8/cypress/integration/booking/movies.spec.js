import data from "../../fixtures/seats.json";
import admin from "../../fixtures/admin.json";
import selectors from "../../fixtures/selectors.json";

// describe("Тестируем отображение главной страницы", () => {
//   beforeEach(() => {
//     cy.visit("/");
//   });
//   it("Корректно отображается главная страница в каждый выбранный день", () => {
//     cy.get(selectors.movi.today).should("exist");
//     cy.mainPage;

//     cy.get(selectors.movi.days)
//       .not(selectors.movi.today)
//       .each(($el) => {
//         cy.wrap($el).click();
//         cy.wrap($el).should("exist", selectors.movi.dateChosen);
//         cy.mainPage;
//       });
//   });
// });

// describe("Тестируем вход в админку", () => {
//   beforeEach(() => {
//     cy.visit(selectors.admin.urlAdmin);
//   });

//   it("Вход с валидными данными", () => {
//     cy.authorization(admin.valid.login, admin.valid.password);
//     cy.contains(selectors.admin.successfulLogin).should("be.visible");
//   });

//   it("Вход с невалидным логином", () => {
//     cy.authorization(admin.invalid.login, admin.valid.password);
//     cy.contains(selectors.admin.authorisationError).should("be.visible");
//   });

//   it("Вход с невалидным паролем", () => {
//     cy.authorization(admin.valid.login, admin.invalid.password);
//     cy.contains(selectors.admin.authorisationError).should("be.visible");
//   });

//   it("Вход с пустым логином", () => {
//     cy.authorization(admin.empty.login, admin.valid.password);
//     cy.get(selectors.admin.email)
//       .then((element) => element[0].checkValidity())
//       .should("be.false");
//   });

//   it("Вход с пустым паролем", () => {
//     cy.authorization(admin.valid.login, admin.empty.password);
//     cy.contains(selectors.admin.authorisationError).should("be.visible");
//   });
// });

describe("Тестируем функцию бронирования билетов", () => {
  it("Бронируем места в доступном зале", () => {
    let elementsWithText = [];
    let nameHall;
    cy.visit(selectors.admin.urlAdmin);
    // авторизуемся в админке
    cy.authorization(admin.valid.login, admin.valid.password);
    // проверяется наличие сообщения об успешной авторизации
    cy.contains(selectors.admin.successfulLogin).should("be.visible");
    // в админке, в разделе "ОТКРЫТЬ ПРОДАЖИ" ищем залы со статусом "Продажа билетов открыта!!!"
    // и при соблюдении данного условия добавляем залы в массив
    cy.get(selectors.admin.startSales)
      .within(() => {
        cy.get(selectors.admin.halls).each((halls) => {
          cy.wrap(halls).click();
          cy.get(selectors.admin.selectorTicketSalesOpen)
            .should("exist")
            .then((available) => {
              if (available.text().includes("Продажа билетов открыта!!!")) {
                elementsWithText.push(halls);
              }
            });
        });
      })
      .then(() => {
        // сохраняем в переменную первый элемент из массива
        const firstElement = elementsWithText[0];
        cy.get(firstElement)
          .invoke("attr", "value")
          .then((value) => {
            // сохраняем название зала, сохраненного в массив
            nameHall = value;
            cy.url().then((url) => {
              if (url !== selectors.movi.urlSessions) {
                cy.visit(selectors.movi.urlSessions);
              }
              cy.contains(value).click();
              // на странице афиши проверяем, что выбранный зал есть в афише
              cy.get(selectors.movi.selectedHall).contains(value);
            });
          });
      });
    cy.get(selectors.movi.selectedHall).then(($hall) => {
      if (!$hall.find(selectors.movi.noSession).length) {
        // если в выбранную дату нет доступных сеансов, то продолжаем искать дату с доступным сеансом
        cy.get(selectors.movi.haveSession).click();
      }
      cy.get(selectors.movi.days).then(($days) => {
        // создаем массив, затем в нем будем выбирать дату с доступным сеансом
        const daysArray = Array.from($days);
        // кликаем по второму элементу, так как первый элемент  уже проверен
        cy.wrap(daysArray[1]).click();
        // проверяем наличие доступного сеанса в зале
        cy.get(selectors.movi.selectedHall).then(($hall) => {
          if (!$hall.find(selectors.movi.noSession).length) {
            // выбираем сеанс, если он доступен
            cy.get(selectors.movi.haveSession).click();
            return false;
          } else {
            // если доступного сеанса нет, выбираем следующую дату
            cy.wrap(daysArray[2]).click();
            cy.get(selectors.movi.selectedHall).then(($hall) => {
              if (!$hall.find(selectors.movi.noSession).length) {
                // выбираем сеанс
                cy.get(selectors.movi.haveSession).click();
                return false;
              }
            });
          }
        });
      });
      // проверяем что выполнен переход на страницу выбора мест в требуемом зале
      cy.get(selectors.movi.infoHall).contains(nameHall).should("be.visible");
      // проверям, что кнопка "Забронировать" находится в статусе "Disabled" пока места не выбраны
      cy.get(selectors.movi.bookDisabled).should("be.disabled");
    });
    // выбираем места с использованием тестовых данных
    data.forEach((testSeats) => {
      testSeats.seats.forEach((seat) => {
        const seats = `${selectors.movi.rowSeat}`
          .replace("{row}", seat.row)
          .replace("{seat}", seat.seat);
        cy.get(seats).click();
      });
    });
    // проверяем, что все места перешли в статус "Выбрано"
    data.forEach((testSeats) => {
      testSeats.seats.forEach((seat) => {
        const seats = `${selectors.movi.rowSeat}`
          .replace("{row}", seat.row)
          .replace("{seat}", seat.seat);
        cy.get(seats).get(selectors.movi.selectedSeat);
      });
    });
    // проверям, что кнопка "Забронировать" находится в статусе "Enable" когда места выбраны
    cy.get(selectors.movi.bookEnable).should("not.have.attr", "disabled");
    // бронируем выбранные места
    cy.get(selectors.movi.bookEnable).click();
    // проверяем что выполнен переход на страницу оплаты с детализацией заказа
    cy.contains(selectors.movi.order);
    // проверяем, что все забронированные места отражены в заказе
    let expectedSeats = [];
    data.forEach((testSeats) => {
      let seats = testSeats.seats.map((seat) => `${seat.row}/${seat.seat}`);
      expectedSeats = expectedSeats.concat(seats);
    });
    cy.get(selectors.movi.ticketDetails).should(
      "contain",
      expectedSeats.join(", ")
    );
    // проверям, что кнопка "Получить код бронирования" находится в статусе "Enable"
    cy.get(selectors.movi.bookingButton).should("not.have.attr", "disabled");
  });
});
