'use strict';

const controller = require('./waitinglist.controller');
import * as auth from '../../auth/auth.service';

const router = require('express-async-router').AsyncRouter();

router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;
