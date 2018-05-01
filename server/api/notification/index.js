'use strict';

import * as auth from '../../auth/auth.service';
const controller = require('./notifications.controller');
const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);

module.exports = router;
