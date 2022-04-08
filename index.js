const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const randomUseragent = require('random-useragent');
const ProxyList = require('free-proxy');
const Cheerio = require('cheerio');
const express =  require('express');    
const { data } = require('cheerio/lib/api/attributes');


const app = express();
const port = 3000;
const proxyList = new ProxyList();


  app.get('/getupcomingnftdata', async (req, res) => {
    res.status(200).json( await getUpcomingnftData())
  });

  app.get('/gettraitsniperdata', async (req, res) => {
    res.status(200).json( await getTraitsniperData())
  })

  app.get('/geticytoolsdata', async (req, res) => {
    res.status(200).json( await getIcytoolsData())
  })

  app.get('/', async (req, res) => {
    res.status(200).send('running');
  })
  

async function getData(){

    
    // var data = {};


    // const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

    // // let proxyData = await proxyList.random();

    // const browser = await puppeteer.launch({
    //     headless: true,
    //     executablePath: process.env.CHROME_BIN || null, 
    //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
    //     ignoreHTTPSErrors: true,
    //     dumpio: false });

    // const page = await browser.newPage();

    // const userAgent = randomUseragent.getRandom();
    // const UA = userAgent || USER_AGENT;

    // console.log('tab created');

    // await page.setViewport({
    //     width: 1920 + Math.floor(Math.random() * 100),
    //     height: 3000 + Math.floor(Math.random() * 100),
    //     deviceScaleFactor: 1,
    //     hasTouch: false,
    //     isLandscape: false,
    //     isMobile: false,
    // });
    
    
    // await page.setUserAgent(UA);
    // await page.setJavaScriptEnabled(true);
    // await page.setDefaultNavigationTimeout(0);


    // Calling Upcoming NFT
    // await page.goto('https://upcomingnft.net/most-popular-events/', { waitUntil: 'networkidle0' });
    // console.log('page fetched');
    // const htmlData = await page.evaluate(() => document.querySelector('*').outerHTML);
    // data['upcomingnft'] = await getUpcomingnftData(htmlData);
    
    

    //Calling Traitsniper 
    // await page.goto('https://app.traitsniper.com/?status=unrevealed', { waitUntil: 'networkidle0' });
    // console.log('page fetched');
    // const traitSniperHTMLData = await page.evaluate(() => document.querySelector('*').outerHTML);
    // data['traitsniper'] = await getTraitsniperData(traitSniperHTMLData);



    // //Calling IcyTools 
    // await page.goto('https://icy.tools/discover', { waitUntil: 'networkidle0' });
    // console.log('page fetched');
    // await page.waitFor(3000);
    // await page.click('#__next > main > div > div > div > div > div:nth-child(1) > div > div.flex.flex-col > div > div > div > div > table > thead:nth-child(1) > tr > td:nth-child(2) > div > div > div:nth-child(9) > p > span');
    // console.log('btn clicked I think');
    // await page.waitFor(3000);
    // const icyToolsHTMLData = await page.evaluate(() => document.querySelector('*').outerHTML);
    // data['icytools'] = await getIcytoolsData(icyToolsHTMLData);





    return data;
}

async function getUpcomingnftData(){
    const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

    // let proxyData = await proxyList.random();

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_BIN || null, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        dumpio: false });

    const page = await browser.newPage();

    const userAgent = randomUseragent.getRandom();
    const UA = userAgent || USER_AGENT;

    console.log('tab created');

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


    await page.goto('https://upcomingnft.net/most-popular-events/', { waitUntil: 'networkidle0' });
    console.log('page fetched');
    const htmlData = await page.evaluate(() => document.querySelector('*').outerHTML);


    var $ = Cheerio.load(htmlData);
    var formatedData = [];
    var tableRows = $('#movietable tbody tr');
    $(tableRows).each((index, element) => {
        var chldrn = element.children;
        var childData = {};
        $(chldrn).each((index, element)=>{
                // childData[index] = $(element).text().trim();
            if(index === 2){
                childData['name'] = $(element).text().trim();
            }
            if(index === 5){
                childData['price'] = $(element).text().trim();
            }
            if(index === 6){
                childData['supply'] = $(element).text().trim();
            }
            if(index === 7){
                childData['twitterfollower'] = $(element).text().trim();
                childData['twitterlink'] = $(element).find('a').attr('href');
            }
            if(index === 8){
                childData['discordnumber'] = $(element).text().trim();
                childData['discordlink'] = $(element).find('a').attr('href');
            }
            if(index === 9){
                childData['websitelink'] = $(element).find('a').attr('href');
            }
            // console.log(childData);
        })
        formatedData.push(childData);
    });
    console.log('data scraped');
    await browser.close()
    return formatedData;
} 


async function getTraitsniperData(){
    const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

    // let proxyData = await proxyList.random();

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_BIN || null, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        dumpio: false });

    const page = await browser.newPage();

    const userAgent = randomUseragent.getRandom();
    const UA = userAgent || USER_AGENT;

    console.log('tab created');

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


    await page.goto('https://app.traitsniper.com/?status=unrevealed/', { waitUntil: 'networkidle0' });
    console.log('page fetched');
    await page.waitFor(3000);
    const htmlData = await page.evaluate(() => document.querySelector('*').outerHTML);

    console.log(htmlData);

    var $ = Cheerio.load(htmlData);
    var dataObjectFromPage = $('#__NEXT_DATA__').html();
    var websiteDateinJson = JSON.parse(dataObjectFromPage);
    var formatedTraitSniperData = websiteDateinJson['props']['pageProps']['projects'];
    await browser.close()
    return formatedTraitSniperData;
}


async function getIcytoolsData(){

    const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

    // let proxyData = await proxyList.random();

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_BIN || null, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        dumpio: false });

    const page = await browser.newPage();

    const userAgent = randomUseragent.getRandom();
    const UA = userAgent || USER_AGENT;

    console.log('tab created');

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


    await page.goto('https://icy.tools/discover', { waitUntil: 'networkidle0' });
    console.log('page fetched');

    const htmlData = await page.evaluate(() => document.querySelector('*').outerHTML);

    var $ = Cheerio.load(htmlData);
    var formatedData = [];
    var table = $('tbody').first();
    var rows = table.children();
    $(rows).each((index, element)=>{
        var chldrn = element.children;
        var childData = {}
        $(chldrn).each((index, element)=>{
            if(index === 0){
                childData['name'] = $(element).find('a div div p:first-of-type').text();
            }
            if(index === 1){
                childData['mints'] = $(element).find('a p').text();
            }
            if(index === 4){
                childData['alltimes'] = $(element).find('a div p:first-of-type').text();
            }
            if(index === 4){
                childData['opensealink'] = "$(element).find('a').attr('href')";
            }
        })
        formatedData.push(childData);
    })
    await browser.close()
    return formatedData;
}



app.listen(process.env.PORT || 3000, () => {
    console.log(`server running at ${port}/`)
});