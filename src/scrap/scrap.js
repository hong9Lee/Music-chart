const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

let MusicChart = async () => {
    const browser = await puppeteer.launch({ headless: true }); // 브라우저를 실행한다.

    const page = await browser.newPage(); // 새로운 페이지를 연다.
    await page.setViewport({ width: 1366, height: 768 }); // 페이지의 크기를 설정한다.

    await page.goto('https://vibe.naver.com/chart/total'); // vibe 음원 순위 페이지
    const content = await page.content(); // 페이지의 HTML을 가져온다.
    const $ = cheerio.load(content); // cheerio에 HTML 로드
    const lists = $("table > tbody > tr"); // 복사한 리스트를 Selector로 <tr> 하위 리스트를 모두 가져온다.

    let chartList = [];
    lists.each((index, list) => {

        const rank = $(list).find("td.rank > span.text").text(); // 음원 순위
        const title = $(list).find("td.song > div > span > a.link_text").text(); // 제목
        const artist = $(list).find("td.artist > span > span > span > a > span.text").text(); // 가수

        chartList.push({ rank, artist, title });
    });

    await browser.close(); // 브라우저 종료
    return chartList;
}

module.exports = MusicChart;
