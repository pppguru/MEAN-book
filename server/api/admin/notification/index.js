'use strict';

const controller = require('./notifications.controller');
const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);

module.exports = router;
