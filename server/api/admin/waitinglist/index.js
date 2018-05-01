'use strict';

const controller = require('./waitinglist.controller');

const router = require('express-async-router').AsyncRouter();

router.get('/', controller.getWaitinglist);

module.exports = router;
