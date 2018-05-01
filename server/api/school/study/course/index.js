'use strict';

const controller = require('./course.controller');

const router = require('express-async-router').AsyncRouter({mergeParams: true});

router.get('/', controller.index);

module.exports = router;
