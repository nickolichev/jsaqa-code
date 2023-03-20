const {
  goToPage,
  chosenElement,
  clickElement,
  visibleElement,
  disabledElement,
  enableElement,
  movieDate,
  costCalculation,
} = require("./lib/commands.js");

let page;
let movieDateResult;
let orderAmount;

beforeEach(async () => {
  page = await goToPage("https://qamid.tmweb.ru/client/index.php");
});

afterEach(async () => {
  if (page) {
    await page.close();
  }
});

describe("Идём в кино", () => {
  test("фильм 'Train arrival", async () => {
    // выбираем дату сеанса
    await clickElement(page, "a:nth-child(3)");
    // проверяем, что дата выбрана
    await chosenElement(page, "a.page-nav__day.page-nav__day_chosen");
    // сохраняем значение даты сеанса для последующих тестов
    movieDateResult = await movieDate(
      page,
      "a.page-nav__day.page-nav__day_chosen"
    );
    // проверяем, что в указанную дату есть сеансы с требуемым фильмом
    await visibleElement(page, "h2.movie__title", "Train arrival");
    // проверяем что для выбранного фильма есть требуемое нами время сеанса
    await visibleElement(page, 'a[data-seance-start="1260"]', "21:00");
    // проверяем, что сеанс в указанное время доступен для выбора
    await enableElement(page, 'a[data-seance-start="1260"]');
    // выбираем время сеанcа
    await clickElement(page, 'a[data-seance-start="1260"]');
    // проверяем что выполнен переход на страницу выбора мест в зале с требуемым фильмом
    await visibleElement(page, "h2", "Train arrival");
    // проверям, что кнопка "Забронировать" находится в статусе "Disabled" пока места не выбраны
    await disabledElement(page, "button.acceptin-button");
    // выбираем первое место
    await clickElement(
      page,
      "div > div > div:nth-child(10) > span:nth-child(5)"
    );
    // выбираем второе место
    await clickElement(
      page,
      "div > div > div:nth-child(10) > span:nth-child(6)"
    );
    // проверяем, что первое место перешло в статус "Выбрано"
    await chosenElement(
      page,
      ".buying-scheme__row:nth-of-type(10) > .buying-scheme__chair_selected:nth-of-type(5)"
    );
    // проверяем, что второе место перешло в статус "Выбрано"
    await chosenElement(
      page,
      ".buying-scheme__row:nth-of-type(10) > .buying-scheme__chair_selected:nth-of-type(6)"
    );
    // проверям, что кнопка "Забронировать" преходит в статус "Enable" после выбора мест
    await enableElement(page, "button.acceptin-button");
    // бронируем выбранные места
    await clickElement(page, "button.acceptin-button");
    // проверяем что выполнен переход на страницу оплаты с детализацией заказа
    await visibleElement(page, "h2", "Вы выбрали билеты:");
    // сверяем в заказе название фильма
    await visibleElement(page, "div > p:nth-child(1)", "Train arrival");
    // сверяем в заказе забронированные места
    await visibleElement(page, "div > p:nth-child(2)", "10/5, 10/6");
    // сверяем в заказе зал показа фильма
    await visibleElement(page, "div > p:nth-child(3)", "SuperHall");
    // сверяем в заказе дату сеанса
    await visibleElement(page, "div > p:nth-child(4)", movieDateResult);
    // сверяем в заказе время сеанса
    await visibleElement(page, "div > p:nth-child(5)", "21:00");
    // сверяем стоимость заказа
    await visibleElement(page, "div > p:nth-child(6)", "2000");
    // проверям, что кнопка "Получить код бронирования" находится в статусе "Enable"
    await enableElement(page, "button.acceptin-button");
  });

  test('Корректность расчета суммы заказа на "Фильм 3"', async () => {
    // выбираем дату сеанса
    await clickElement(page, "a:nth-child(4)");
    // выбираем сеанc
    await clickElement(page, 'a[data-seance-start="600"]');
    // проверяем что выполнен переход на страницу выбора мест в зале с требуемым фильмом
    await visibleElement(page, "h2", "Фильм 3");
    // выбираем 2 обычных места
    await clickElement(
      page,
      "div > div > div:nth-child(3) > span:nth-child(5)"
    );
    await clickElement(
      page,
      "div > div > div:nth-child(4) > span:nth-child(4)"
    );
    // и 2 VIP места
    await clickElement(
      page,
      "div > div > div:nth-child(3) > .buying-scheme__chair_vip"
    );
    await clickElement(
      page,
      "div > div > div:nth-child(4) > .buying-scheme__chair_vip"
    );
    // расчитываем сумму заказа на основе выбранных мест
    orderAmount = await costCalculation(
      page,
      //передаем цену билета на VIP место
      "div > div > div:nth-child(1) > p:nth-child(2)",
      //передаем цену билета на обычное место
      "div > div > div:nth-child(1) > p:nth-child(1)",
      // передаем выбранные места
      "div > div > div:nth-child(3) > .buying-scheme__chair_standart.buying-scheme__chair_selected",
      "div > div > div:nth-child(4) > .buying-scheme__chair_standart.buying-scheme__chair_selected",
      "div > div > div:nth-child(3) > .buying-scheme__chair_vip.buying-scheme__chair_selected",
      "div > div > div:nth-child(4) > .buying-scheme__chair_vip.buying-scheme__chair_selected"
    );
    // бронируем выбранные места
    await clickElement(page, "button.acceptin-button");
    // проверяем что выполнен переход на страницу оплаты с детализацией заказа
    await visibleElement(page, "h2", "Вы выбрали билеты:");
    // сверяем стоимость заказа
    await visibleElement(page, "div > p:nth-child(6)", orderAmount);
    // проверям, что кнопка "Получить код бронирования" активна для завершения заказа
    await enableElement(page, "button.acceptin-button");
  });

  test('Тестируем баг "Сервис позволяет заказать билеты на места со статусом "Занято"', async () => {
    // выбираем дату сеанса
    await clickElement(page, "a:nth-child(6)");
    // проверяем, что дата выбрана
    await chosenElement(page, "a.page-nav__day.page-nav__day_chosen");
    // сохраняем значение даты сеанса для последующих тестов
    movieDateResult = await movieDate(
      page,
      "a.page-nav__day.page-nav__day_chosen"
    );
    // выбираем сеанc на 19.00, фильм "Логан"
    await clickElement(page, 'a[data-seance-start="1140"]');
    // // проверяем что выполнен переход на страницу выбора мест в зале с требуемым фильмом
    await visibleElement(page, "h2", "Логан");
    // проверям, что кнопка "Забронировать" находится в статусе "Disabled" пока места не выбраны
    await disabledElement(page, "button.acceptin-button");
    // выбираем место со статусом "Занято"
    await clickElement(
      page,
      "div > div > div:nth-child(7) > span:nth-child(4)"
    );
    // проверям, что кнопка "Забронировать" преходит в статус "Enable" после выбора мест
    await enableElement(page, "button.acceptin-button");
    // бронируем выбранные места
    await clickElement(page, "button.acceptin-button");
    // проверяем что выполнен переход на страницу оплаты с детализацией заказа
    await visibleElement(page, "h2", "Вы выбрали билеты:");
    // сверяем в заказе название фильма
    await visibleElement(page, "div > p:nth-child(1)", "Логан");
    // сверяем в заказе забронированные места
    await visibleElement(page, "div > p:nth-child(2)", "7/4");
    // сверяем в заказе зал показа фильма
    await visibleElement(page, "div > p:nth-child(3)", "Зал 1");
    // сверяем в заказе дату сеанса
    await visibleElement(page, "div > p:nth-child(4)", movieDateResult);
    // сверяем в заказе время сеанса
    await visibleElement(page, "div > p:nth-child(5)", "19:00");
    // сверяем стоимость заказа
    await visibleElement(page, "div > p:nth-child(6)", "350");
    // проверям, что кнопка "Получить код бронирования" активна для завершения заказа
    await enableElement(page, "button.acceptin-button");
  });
});
