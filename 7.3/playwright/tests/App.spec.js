/* eslint-disable no-unused-vars */
const { test, expect } = require("@playwright/test");
const { chromium } = require("@playwright/test");
const { getUserData } = require("../user");
const path = require("path");
const screenshotsPath = path.join(process.cwd(), "screenshots");


test.setTimeout(70000);  

async function takeScreenshot(page, testName, folderName) {
  const testScreenshotsPath = path.join(screenshotsPath, folderName);
  const filePath = path.join(testScreenshotsPath, `${testName}.png`);
  await page.screenshot({ path: filePath });
}

test.describe("Авторизация на сайте", () => {
  let browser;
  let context;
  let page;

  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: false,
      devtools: true,
      screenshot: {
        dir: screenshotsPath,
        fullPage: true
      }
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.beforeEach(async () => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.afterEach(async () => {
    await context.close();
  });

  test("Успешная авторизация", async () => {
    const { email, password } = getUserData();
    // Go to https://netology.ru/
    await page.goto("https://netology.ru/");
    await takeScreenshot(page, "#1 Главная страница", "test #1");

    // Клик по кнопке "Войти"
    await page.click("a[class*='Header--loginLink'][href*='modal=sign_in']", { force: true });
    await takeScreenshot(page, "#2 Нажали на кнопку Войти", "test #1");

    // Заполняем поле "Email"
    await page.waitForSelector("input[type='email']");
    await page.type("input[class=''][type='email']", email);
    await expect(await page.inputValue("input[type='email']")).toBe(email); 
    await takeScreenshot(page, "#3 Заполнили поле Email", "test #1");

    // Заполняем поле "Password"
    await page.waitForSelector("input[type='password']");
    await page.type("input[type='password']", password);
    await takeScreenshot(page, "#4 Заполнили поле Password", "test #1");

    // Клик по кнопке "Войти" под полями авторизации
    await page.click("button[data-testid='login-submit-btn']");
    await takeScreenshot(page, "#5 Клик по кнопке Войти под полями авторизации", "test #1");

    // Если авторизация успешна, выполняется переход на страницу https://netology.ru
    // Ситуация с редиректом непонятная. То он есть (эта часть теста выполоняется успешно), 
    // то его нет( и тогда тест падает по этой строке)
    await expect(page).toHaveURL("https://netology.ru");
    await takeScreenshot(page, "#6 Редирект", "test #1");

    // Редирект на страницу профиля
    await expect(page).toHaveURL("https://netology.ru/profile");
    await page.waitForTimeout(10000); 
    const myElement = await page.locator("h2:has-text('Мои курсы и профессии')");
    await expect(myElement).toHaveText("Мои курсы и профессии", { timeout: 5000, state: "visible" });
    await takeScreenshot(page, "#7 Страница профайла", "test #1");
  });

  test("Неуспешная авторизация", async () => {
    // Go to https://netology.ru/
    await page.goto("https://netology.ru/");
    await takeScreenshot(page, "#1 Главная страница", "test #2");

    // Клик по кнопке "Войти"
    await page.click("a[class*='Header--loginLink'][href*='modal=sign_in']", { force: true });
    await takeScreenshot(page, "#2 Нажали на кнопку Войти", "test #2");

    // Заполняем поле "Email" невалидным значением
    await page.waitForSelector("input[type='email']");
    await page.type("input[class=''][type='email']", "nikolichev@yhoo.com");
    await takeScreenshot(page, "#3 Заполнили поле Email", "test #2");
    
    // Заполняем поле "Password" невалидным значением
    await page.waitForSelector("input[type='password']");
    await page.type("input[type='password']", "password");
    await takeScreenshot(page, "#4 Заполнили поле Password", "test #2");
    
    // Клик по кнопке "Войти" под полями авторизации
    await page.click("button[data-testid='login-submit-btn']");
    await takeScreenshot(page, "#5 Клик по кнопке Войти под полями авторизации", "test #2");
    
    // В случае неуспешной авторизации остаемся на этой странице 
    await expect(page).toHaveURL("https://netology.ru/?modal=sign_in");
    const myElement = await page.locator("div[data-testid='login-error-hint']");
    await expect(myElement).toHaveText("Вы ввели неправильно логин или пароль", { timeout: 5000, state: "visible" });
    await takeScreenshot(page, "#7 Страница авторизации с ошибкой ввода данных", "test #2");
  });
});
