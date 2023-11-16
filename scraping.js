const puppeteer = require("puppeteer");

async function scrapeEmail(url) {
  //.company-all-details
  //.business-email-id a[href^="mailto:"]
  let emailSelector = ".company-all-details";
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
          Email: element
            .querySelector('.business-email-id a[href^="mailto:"]')
            .textContent.trim(),
          //business-contact a[href^="tel:"]
          Contact: element
            .querySelector('.business-contact a[href^="tel:"]')
            .textContent.trim(),
        };
      });
    });
    return {
      Email: elements[0].Email,
      Contact: elements[0].Contact,
    };
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
