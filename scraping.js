const puppeteer = require("puppeteer");

async function scrapeEmail(url) {
  let emailSelector = '.business-email-id a[href^="mailto:"]';
  const browser = await puppeteer.launch({
    headless: "new", // Set to true for headless mode
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(emailSelector);
    const parsedUrl = new URL(url);

    const elements = await page.$$eval(emailSelector, (elems) => {
      return elems.map((element) => {
        return {
          Email: element.textContent.trim(),
        };
      });
    });
    return elements[0].Email;
    console.log(elements);
  } catch (error) {
    console.error("Error:", error);
    // Handle the error as needed
  } finally {
    await browser.close();
  }
}
module.exports = {
  scrapeEmail,
};
