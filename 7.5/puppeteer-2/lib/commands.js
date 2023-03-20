module.exports = {
  goToPage: async function (url) {
    try {
      const page = await browser.newPage();
      await page.goto(url, {
        waitUntil: "networkidle0",
        // waitUntil: "domcontentloaded",
        // timeout: 30000,
      });
      await page.setDefaultNavigationTimeout(30000);
      // const title = await page.title();
      // console.log("Page title: " + title);
      return page;
    } catch (error) {
      throw new Error(`Page not loaded: ${url}`);
    }
  },

  goToMainPage: async function (url, browser) {
    try {
      const page = await browser.newPage();
      await page.goto(url, {
        // waitUntil: "networkidle0",
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await page.setDefaultNavigationTimeout(10000);
      // const title = await page.title();
      // console.log("Page title: " + title);
      return page;
    } catch (error) {
      throw new Error(`Page not loaded: ${url}`);
    }
  },

  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector, {
        visible: true,
        disabled: false,
      });
      await page.click(selector);
    } catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },

  chosenElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector, { visible: true });
    } catch (error) {
      throw new Error(`Selector is disabled: ${selector}`);
    }
  },

  enableElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector, {
        visible: true,
        timeout: 10000,
        disabled: false,
      });
    } catch (error) {
      throw new Error(`Element enable: ${selector}`);
    }
  },

  disabledElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector, {
        visible: true,
        timeout: 10000,
        disabled: true,
      });
    } catch (error) {
      throw new Error(`Element disabled: ${selector}`);
    }
  },

  visibleElement: async function (page, selector, text) {
    try {
      await page.waitForSelector(selector, { visible: true, timeout: 5000 });
      const element = await page.$(selector);
      const elementText = await page.evaluate(
        (element) => element.textContent,
        element
      );
      if (!elementText.includes(text)) {
        throw new Error(
          `Element with selector "${selector}" does not contain text: ${text}`
        );
      }
    } catch (error) {
      throw new Error(`Element with selector "${selector}" not found`);
    }
  },

  movieDate: async function (page, selector) {
    try {
      const timeStamp = await page.$eval(selector, (element) =>
        element.getAttribute("data-time-stamp")
      );
      const date = new Date(timeStamp * 1000);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();
      const formattedDate = `${day}-${month}-${year}`;
      return formattedDate;
    } catch (error) {
      throw new Error(`Element with selector "${selector}" not found`);
    }
  },

  // Функция для расчета стоимости заказа
  costCalculation: async function (
    page,
    selectorVIP, // селектор цены vip места
    selectorRegular, // селектор цены обычного места
    selector1,
    selector2,
    selector3,
    selector4
  ) {
    try {
      const seatPrices = await page.$$eval(
        `${selectorVIP}, ${selectorRegular}`,
        (seats) => seats.map((seat) => parseFloat(seat.textContent))
      );
      // получаем цены на билеты
      const vipPrice = Math.max(...seatPrices);
      const regularPrice = Math.min(...seatPrices);

      const seats = await page.$$(
        `${selector1}, ${selector2}, ${selector3}, ${selector4}`
      );
      // фильтруем места VIP
      const vipSeats = seats.filter(
        (seat) => seat.className && seat.className.includes("vip")
      );
      // фильтруем обычные места
      const regularSeats = seats.filter(
        (seat) => seat.className && seat.className.includes("vip")
      );
      // выполняем расчет
      const vipSeatCount = vipSeats.length;
      const regularSeatCount = regularSeats.length;
      const vipPriceTotal = vipPrice * vipSeatCount;
      const regularPriceTotal = regularPrice * regularSeatCount;
      const orderAmount = vipPriceTotal + regularPriceTotal;
      return orderAmount;
    } catch (error) {
      const selectorNotFound = error.message.match(
        /Error: failed to find element matching selector '(.*)'/
      );
      if (selectorNotFound && selectorNotFound[1] === selector1) {
        throw new Error(`Element with selector "${selector1}" not found`);
      } else if (selectorNotFound && selectorNotFound[1] === selector2) {
        throw new Error(`Element with selector "${selector2}" not found`);
      } else if (selectorNotFound && selectorNotFound[1] === selector3) {
        throw new Error(`Element with selector "${selector3}" not found`);
      } else if (selectorNotFound && selectorNotFound[1] === selector4) {
        throw new Error(`Element with selector "${selector4}" not found`);
      } else {
        throw error;
      }
    }
  },
};
