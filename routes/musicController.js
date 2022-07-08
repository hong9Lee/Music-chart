const express = require('express');
const router = express.Router();
const chartService = require('../src/service/chartService')
const logger = require("../config/logger");

router.get('/list', async (req, res) => {
    logger.info(`GET /list`);
    await chartService.list(req, res);
});

module.exports = router;
