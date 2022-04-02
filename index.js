const puppeteer = require('puppeteer');
const Cheerio = require('cheerio');
const express =  require('express');    
const { data } = require('cheerio/lib/api/attributes');

const app = express();
const hostname = '0.0.0.0'
const port = 3000;


app.get('/getscrapeddata', async (req, res) => {
    res.status(200).json( await getData())
  })

  app.get('/', async (req, res) => {
    res.status(200).send('running');
  })
  

async function getData(){
    var data = {};
    const browser = await puppeteer.launch({
        headless: true, 
        args: ['--no-sandbox'] });
    const page = await browser.newPage();
    console.log('tab created');
    await page.goto('https://upcomingnft.net/most-popular-events/', { waitUntil: 'networkidle0' });
    console.log('page fetched');
    const htmlData = await page.evaluate(() => document.querySelector('*').outerHTML);
    data['upcomingnft'] = getUpcomingnftData(htmlData);



    return data;
}

async function getUpcomingnftData(htmlData){
    // const url = 'https://upcomingnft.net/most-popular-events/';
    // const browser = await puppeteer.launch({
    //     headless: true, 
    //     args: ['--no-sandbox'] });
    // const page = await browser.newPage();
    // console.log('tab created');
    // await page.goto(url, { waitUntil: 'networkidle0' });
    // console.log('page fetched');
    // const htmlData = await page.evaluate(() => document.querySelector('*').outerHTML);

    // console.log(htmlData);
    var $ = Cheerio.load(htmlData);
    // $('#movietable', htmlData);
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
            // console.dir(element)
        })
        formatedData.push(childData);
    });
    console.log('data scraped');
    return formatedData;

} 

app.listen(process.env.PORT || 3000, () => {
    console.log(`server running at http://${hostname}:${port}/`)
  })