const jestPuppeteerConfig = require("./jest-puppeteer.config");
const jestConfig = require("./jest.config");
let page;

describe("Github page tests", () => {
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("https://github.com/team");
  });

  afterEach(() => {
    page.close();
  });

  test("The h1 header content'", async () => {
    const firstLink = await page.$("header div div a", {
      visible: true,
    });
    await firstLink.click();
    await page.waitForSelector("h1", {
      visible: true,
      timeout: 10000,
    });
    const title2 = await page.title();
    expect(title2).toMatch(
      /GitHub: Let’s build from here · GitHub|GitHub for teams · Build like the best teams on the planet · GitHub/
    );
  }, 35000);

  test("The first link attribute", async () => {
    // jest.setTimeout(35000);
    const actual = await page.$eval("a", (link) => link.getAttribute("href"), {
      visible: true,
    });
    expect(actual).toEqual("#start-of-content");
  }, 10000);

  test("The page contains Get started with Team", async () => {
    // jest.setTimeout(35000);
    const btnSelector = ".btn-large-mktg.btn-mktg";
    await page.waitForSelector(btnSelector, {
      visible: true,
      timeout: 10000,
    });
    const actual = await page.$eval(btnSelector, (link) => link.textContent);
    expect(actual).toContain("Get started with Team");
  }, 25000);
});

beforeEach(async () => {
  page = await browser.newPage();
});

afterEach(() => {
  page.close();
});

jest.setTimeout(15000);

test("The h1 header content Marketplace", async () => {
  page.setDefaultTimeout(10000);
  await page.goto("https://github.com/marketplace");
  const firstLink = await page.$("div.MarketplaceHeader div.container-lg a");
  await firstLink.click();
  await page.waitForSelector("h1", { visible: true, timeout: 10000 });
  const title2 = await page.title({ timeout: 10000 });
  expect(title2).toEqual(
    "GitHub Marketplace · to improve your workflow · GitHub"
  );
});

test("The h1 header content Features", async () => {
  // page = await browser.newPage();
  await page.goto("https://github.com/features");
  const firstLink = await page.$("div > div > div:nth-child(1) > a");
  await firstLink.click();
  await page.waitForSelector("h1", { visible: true });
  const title2 = await page.title({ timeout: 10000 });
  expect(title2).toMatch(/Features \| GitHub · GitHub|GitHub Codespaces/);
});

test("The h1 header content Blog", async () => {
  // page = await browser.newPage();
  await page.goto("https://github.blog");
  const firstLink = await page.$("div.container-xl a");
  await firstLink.click();
  await page.waitForSelector("h1", { visible: true });
  const title2 = await page.title({ timeout: 10000 });
  expect(title2).toMatch(
    /Why Python keeps growing, explained \| The GitHub Blog|GitHub Desktop 3\.2: Preview your pull request \| The GitHub Blog/
  );
});

describe("Netology page tests", () => {
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("https://netology.ru/", {
      waitUntil: "domcontentloaded",
      timeout: 40000,
    });
  });

  afterEach(() => {
    page.close();
  });

  test("The h1 header content Catalog", async () => {
    const selector = "[data-testid='header-navigatorBtn']";
    await page.waitForSelector(selector, { visible: true, timeout: 15000 });
    const firstLink = await page.$(selector);
    await firstLink.click();
    await page.waitForSelector(selector, { visible: true, timeout: 15000 });
    const title2 = await page.title();
    expect(title2).toEqual(
      "Нетология — обучение современным профессиям онлайн"
    );
  });

  test("The h1 header content Media", async () => {
    const selector = "a[href='https://netology.ru/blog/']";
    await page.waitForSelector(selector, { visible: true, timeout: 15000 });
    const secondLink = await page.$(selector);
    await secondLink.click();
    await page.waitForSelector("h1", {
      visible: true,
      timeout: 15000,
    });
    const title2 = await page.title();
    expect(title2).toEqual("Медиа Нетологии: об образовании в диджитале");
  });

  test("The h1 header content Free", async () => {
    const selector = "a[href='/free']";
    await page.waitForSelector(selector, { visible: true, timeout: 15000 });
    const secondLink = await page.$(selector);
    await secondLink.click();
    await page.waitForSelector("h1", {
      visible: true,
      timeout: 15000,
    });
    const title2 = await page.title();
    expect(title2).toEqual(
      "Бесплатные онлайн курсы, вебинары и гайды – обучение в Нетологии"
    );
  });
});
