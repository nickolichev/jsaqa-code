const puppeteer = require("puppeteer");
// const chai = require("chai");
// const expect = chai.expect;
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const {
  goToMainPage,
  chosenElement,
  clickElement,
  visibleElement,
  disabledElement,
  enableElement,
  movieDate,
  costCalculation,
} = require("/Users/Web interface testing automation/jsaqa-code/7.5/puppeteer-2/lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

When(
  "user goes to the main page of the service {string}",
  { timeout: 30000 },
  async function (url) {
    const page = await goToMainPage(url, this.browser);
    this.page = page;
  }
);

Then("user selects session {string}", async function (date) {
  await clickElement(this.page, `a:nth-child(${date})`);
});

Given("save the date of the selected session", async function () {
  await clickElement(this.page, "a:nth-child(3)");
  this.movieDateResult = await movieDate(
    this.page,
    "a.page-nav__day.page-nav__day_chosen"
  );
});

Then("user then sees that the session date is selected", async function () {
  return await chosenElement(this.page, "a.page-nav__day.page-nav__day_chosen");
});

Then(
  "user checks that the movie {string} is in the repertoire",
  async function (movieName) {
    await visibleElement(this.page, "h2.movie__title", movieName);
  }
);

Then(
  "user checks for the existence of the desired session on the selected date and time {string}",
  async function (time) {
    await visibleElement(this.page, 'a[data-seance-start="1260"]', time);
  }
);

Then(
  "that the session at the specified time is available for selection",
  async function () {
    await enableElement(this.page, 'a[data-seance-start="1260"]');
  }
);

When("user selects session time {string}", async function (time) {
  await clickElement(this.page, `a[data-seance-start="${time}"]`);
});

Then(
  "go to the page for choosing seats in the hall with the film {string}",
  async function (movieName) {
    await visibleElement(this.page, "h2", movieName);
  }
);

Then(
  'check that the "Забронировать" button is in the status "Disabled"',
  async function () {
    await disabledElement(this.page, "button.acceptin-button");
  }
);

Then(
  "user selects places {string} and {string} in the {string} row",
  async function (seat_5, seat_6, row_10) {
    await clickElement(
      this.page,
      `div > div > div:nth-child(${row_10}) > span:nth-child(${seat_5})`
    );
    await clickElement(
      this.page,
      `div > div > div:nth-child(${row_10}) > span:nth-child(${seat_6})`
    );
  }
);

Given(
  'Places {string} and {string} in the {string} row changed to "Selected" status',
  async function (seat_5, seat_6, row_10) {
    await chosenElement(
      this.page,
      `.buying-scheme__row:nth-of-type(${row_10}) > .buying-scheme__chair_selected:nth-of-type(${seat_5})`
    );
    await chosenElement(
      this.page,
      `.buying-scheme__row:nth-of-type(${row_10}) > .buying-scheme__chair_selected:nth-of-type(${seat_6})`
    );
  }
);

Then('the "Забронировать" button is in the "Enable" status', async function () {
  await enableElement(this.page, "button.acceptin-button");
});

Then("user is booking the selected seats", async function () {
  await clickElement(this.page, "button.acceptin-button");
});

Then(
  "go to the payment page {string} with order details",
  async function (order) {
    await visibleElement(this.page, "h2", order);
  }
);

Given(
  "information about the order is checked: movie {string}",
  async function (movieName) {
    await visibleElement(this.page, "div > p:nth-child(1)", movieName);
  }
);

Given(
  "information about the order is checked: row_seats {string}",
  async function (row_seats) {
    await visibleElement(this.page, "div > p:nth-child(2)", row_seats);
  }
);

Given(
  "information about the order is checked: hall {string}",
  async function (hall) {
    await visibleElement(this.page, "div > p:nth-child(3)", hall);
  }
);

Given(
  "information about the order is checked: screening date",
  async function () {
    await visibleElement(
      this.page,
      "div > p:nth-child(4)",
      this.movieDateResult
    );
  }
);

Given(
  "information about the order is checked: screening time {string}",
  async function (time) {
    await visibleElement(this.page, "div > p:nth-child(5)", time);
  }
);

Given(
  "information about the order is checked: order amount {string}",
  async function (amount) {
    await visibleElement(this.page, "div > p:nth-child(6)", amount);
  }
);

Given(
  'button "Получить код бронирования" is in the "Enable"',
  async function () {
    await enableElement(this.page, "button.acceptin-button");
  }
);

Then(
  "user selects regular places: {string} in the {string} row and {string} in the {string} row",
  async function (seat_5, row_3, seat_4, row_4) {
    await clickElement(
      this.page,
      `div > div > div:nth-child(${row_3}) > span:nth-child(${seat_5})`
    );
    await clickElement(
      this.page,
      `div > div > div:nth-child(${row_4}) > span:nth-child(${seat_4})`
    );
  }
);

Then(
  "user selects VIP places: {string} in the {string} row and {string} in the {string} row",
  async function (seat_4, row_3, seat_5, row_4) {
    await clickElement(
      this.page,
      `div > div > div:nth-child(${row_3}) > span:nth-child(${seat_4})`
    );
    await clickElement(
      this.page,
      `div > div > div:nth-child(${row_4}) > span:nth-child(${seat_5})`
    );
  }
);

Given(
  "calculation of the order amount based on the price for a regular seat, the price for a VIP seat and selected seats",
  async function () {
    this.orderAmount = await costCalculation(
      this.page,
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
  }
);

Then(
  "check the cost of the order on the payment page with the previously saved amount",
  async function () {
    await visibleElement(this.page, "div > p:nth-child(6)", this.orderAmount);
  }
);

Then(
  "user selects place {string} in the {string} row",
  async function (seat_4, row_7) {
    await clickElement(
      this.page,
      `div > div > div:nth-child(${row_7}) > span:nth-child(${seat_4})`
    );
  }
);
