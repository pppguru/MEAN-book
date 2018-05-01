'use strict';

const controller = require('./school.controller');
import studies from './study';

const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.use('/:id/studies', studies);

module.exports = router;
