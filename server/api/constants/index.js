'use strict';

const controller = require('./constants.controller');
const router = require('express-async-router').AsyncRouter();

router.get('/fees', controller.index);

module.exports = router;
