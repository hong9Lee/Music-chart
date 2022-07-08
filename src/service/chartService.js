const scrap = require('../scrap/scrap');
const models = require("../../models");
const schedule = require("node-schedule");
const logger = require("../../config/logger")

module.exports = {
    list : async (req, res) => {
        try {
            res.status(200).json(await models.MusicList.findAll());
        } catch (err) {
            logger.error(`=> [GET_LIST] EXECUTE MusicList.findAll() ERROR !! => ${err}`);
            res.status(500).json("Server Error");
        }
    },

    batch : () => {
        schedule.scheduleJob('1 30 * * * *', async () => { // 1시간에 한번씩 수집
            logger.info(`[MUSIC LIST INSERT BATCH START]`);
            try {
                const transaction = await models.sequelize.transaction();

                /**
                 * DBC Table 음원 삭제
                 */
                logger.info(`=> EXECUTE DESTROY DATA`);
                await models.MusicList.destroy({
                    where       : {},
                    truncate    : true,
                    transaction : transaction
                }).then(() => {
                    logger.info(`=> [DESTROY DATA] SUCCESS`);
                }).catch((err) => {
                    transaction.rollback();
                    logger.error(`=> [DESTROY DATA] ERROR !! => ${err}`);
                })

                /**
                 * 음원 리스트 데이터 bulkInsert
                 */
                let scrapData = await scrap();
                await models.MusicList.bulkCreate((scrapData), {
                    validate    : true,
                    transaction : transaction
                }).then(async () => {
                    await transaction.commit()
                    logger.info(`=> [BULK_CREATE] COMMIT`);
                }).catch(err => {
                    transaction.rollback();
                    logger.error(`=> [BULK_CREATE] ERROR !! => ${err}`);
                })
            } catch (err) {
                logger.error(`=> [scheduleJob] Error !! => ${err}`);
            }
        })
    }
};
