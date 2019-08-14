const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.reddit.com/r/popular/';
const posts = [];
const fs = require('fs');

const getPage = async () => {
  try {
    const newPage = await puppeteer.launch();
    const blankPage = await newPage.newPage();
    const page = await blankPage.goto(url).then(() => blankPage.content());
    getCards(page);
  } catch (error) {
    console.log('error', error);
  }
};

const getCards = async page => {
  try {
    $('div.scrollerItem', page).each(function() {
      posts.push({
        title: $('h3', this).text(),
        subreddit: $('div._2mHuuvyV9doV3zwbZPtIPG > a._3ryJoIoycVkA88fy40qNJc', this).text(),
        originalPoster: $('div._2mHuuvyV9doV3zwbZPtIPG > a._2tbHP6ZydRpjI44J3syuqC', this).text(),
        linkPost:
          'https://www.reddit.com' + $('div._3-miAEojrCvx_4FQ8x3P-s > a._1UoeAeSRhOKSNdY_h3iS1O', this).attr('href')
      });
    });
    generateJSON();
  } catch (error) {
    console.log('error', error);
  }
};

const generateJSON = () => {
  try {
    fs.writeFile('./reddit.json', JSON.stringify(posts), err => {
      if (err) throw err;
      process.exit();
    });
  } catch (error) {
    console.log('error', error);
  }
};

getPage();
