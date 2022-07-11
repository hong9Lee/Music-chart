# music-chart
- vibe.naver.com 음원 사이트의 TOP100 리스트를 API 형태로 제공
- node-schedule, sequelize 모듈을 사용해 1시간에 한번씩 DB에 Insert
- Node.js, express, sequelize, MySQL

## 1. puppeteer 모듈을 사용해 음원 순위 크롤링
```
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
```

## 2. node-schedule 모듈, sequelize bulkCreate 사용해 Insert 작업 
```
schedule.scheduleJob('1 30 * * * *', async () => { // 1시간에 한번씩 수집
  await models.MusicList.bulkCreate((scrapData), {
    validate    : true,
    transaction : transaction
  }).then(async () => {
    await transaction.commit();
    ...
  })
})
```
## 3. 음원 리스트 JSON 방식으로 제공
```
[
    {
        "id": 1,
        "rank": "1",
        "artist": "IVE(아이브)",
        "title": "LOVE DIVE",
        "createdAt": "2022-07-07T14:35:32.000Z",
        "updatedAt": "2022-07-07T14:35:32.000Z"
    },
    {
        "id": 2,
        "rank": "2",
        "artist": "나연 (TWICE)",
        "title": "POP!",
        "createdAt": "2022-07-07T14:35:32.000Z",
        "updatedAt": "2022-07-07T14:35:32.000Z"
    },
    ...
]
```

