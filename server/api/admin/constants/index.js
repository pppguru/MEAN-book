'use strict';

const controller = require('./constants.controller');
const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.patch('/', controller.update);

module.exports = router;
