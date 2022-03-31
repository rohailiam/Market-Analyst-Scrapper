const puppeteer = require('puppeteer');
const Cheerio = require('cheerio');
const express =  require('express');    

const app = express();
const hostname = '0.0.0.0'
const port = 3000;


app.get('/getupcomingnft', async (req, res) => {
    res.status(200).json( await getUpcomingnftData())
  })

  app.get('/', async (req, res) => {
    res.status(200).send('running');
  })
  
async function getUpcomingnftData(){
    const url = 'https://upcomingnft.net/most-popular-events/';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log('tab created');
    await page.goto(url, { waitUntil: 'networkidle0' });
    console.log('page fetched');
    const htmlData = await page.evaluate(() => document.querySelector('*').outerHTML);

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
                childData['twitter-follower'] = $(element).text().trim();
                childData['twitter-link'] = $(element).find('a').attr('href');
            }
            if(index === 8){
                childData['discord-number'] = $(element).text().trim();
                childData['discord-link'] = $(element).find('a').attr('href');
            }
            if(index === 9){
                childData['website-link'] = $(element).find('a').attr('href');
            }
            // console.dir(element)
        })
        formatedData.push(childData);
    });
    // console.log(formatedData);
    return formatedData;

} 

// async function receive(){
//     var result =  await getUpcomingnftData();
//     console.log(result);
// }
// receive();

app.listen(process.env.PORT || 3000, () => {
    console.log(`server running at http://${hostname}:${port}/`)
  })