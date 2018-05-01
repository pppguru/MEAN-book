'use strict';

const controller = require('./users.controller');
const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.get('/merchants', controller.indexMerchants);
router.get('/aggregation', controller.aggregation);
router.delete('/:id', controller.destroy);

module.exports = router;
