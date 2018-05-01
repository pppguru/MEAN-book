'use strict';

const controller = require('./export.controller');

const router = require('express-async-router').AsyncRouter();

router.get('/waitinglist', controller.waitinglist);

module.exports = router;
