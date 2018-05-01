'use strict';

const controller = require('./genres.controller');
const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.patch('/:id', controller.update);

module.exports = router;
