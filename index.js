const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const randomUseragent = require("random-useragent");
const Cheerio = require("cheerio");
const express = require("express");

const app = express();
const port = 3000;

app.post("/post", async (req, res) => {
  var link = req.query.link;
  res.status(200).send(await scrapData(link));
});

async function scrapData(link) {
  const USER_AGENT =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36";
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN || null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ignoreHTTPSErrors: true,
    dumpio: false,
  }); 
  const page = await browser.newPage();
  const userAgent = randomUseragent.getRandom();
  const UA = userAgent || USER_AGENT;
  console.log("tab created");

  await page.setViewport({
    width: 1920 + Math.floor(Math.random() * 100),
    height: 3000 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });

  await page.setUserAgent(UA);
  await page.setJavaScriptEnabled(true);
  await page.setDefaultNavigationTimeout(0);

  await page.goto(link, { waitUntil: "networkidle0" });
  console.log("page fetched");
  const htmlData = await page.evaluate(
    () => document.querySelector("*").outerHTML
  );

  var $ = Cheerio.load(htmlData);
  var data = { name: $("span.object-header__title").text() };
  var tables = $("dl.object-kenmerken-list");
  tables.each((index, element) => {
    var chldrn = element.children;
    var key1, val1;
    chldrn.forEach((element, index) => {
      if (element.name == "dt") {
        if ($(chldrn[index]).text().trim() == "Areas") {
          key1 = "Living area";
          key1 = key1.replace(/ /g, "_");
        } else {
          key1 = $(chldrn[index]).text().trim();
          key1 = key1.replace(/ /g, "_");
        }
      }
      if (element.name == "dd") {
        val1 = $(chldrn[index]).text().trim();
        data[key1] = val1;
      }
    });
  });
  console.log("data scraped");
  await browser.close();
  return data;
}

app.get("/", async (req, res) => {
  res.status(200).send("running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server running at ${port}/`);
});
