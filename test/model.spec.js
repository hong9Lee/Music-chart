const scrap = require('../src/scrap/scrap');
const chai = require('chai');
const models = require("../models/index");
const {sequelize} = require("../models/index");
const expect = chai.expect;

before('데이터 베이스 연결', () => {
    sequelize.sync({force : false}).then(() => {
        console.log('데이터 베이스 연결 성공');
    }).catch(err => {
        console.error(err);
    });
})

describe('Scrap Data Test', function (){
    it('음원 순위 데이터 크롤링 테스트', async () => {
        await scrap().then((res) => {
            expect(res.length).to.be.equal(100);
        });
    }).timeout(null);
});

describe('Sequelize Test', () => {
    it('테이블 생성 & 검색 테스트', async () => {
        await models.MusicList.create({
            id     : 1,
            rank   : 1,
            artist : "jason",
            title  : "happy"
        });

        const success = await models.MusicList.findOne({
            where: { rank: '1' }
        });

        expect(success.dataValues.artist).to.be.equal('jason');
    });
});
