'use strict';

const controller = require('./genre.controller');

const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.get('/maingenres', controller.getMainGenres);

module.exports = router;
