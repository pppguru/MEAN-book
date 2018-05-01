'use strict';

const controller = require('./replies.controller');
const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.delete('/:id', controller.destroy);

module.exports = router;
