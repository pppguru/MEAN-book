'use strict';

const controller = require('./requests.controller');
const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.get('/aggregation', controller.aggregation);

module.exports = router;
