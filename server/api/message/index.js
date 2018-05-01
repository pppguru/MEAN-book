'use strict';

const controller = require('./messages.controller');
import * as auth from '../../auth/auth.service';

const router = require('express-async-router').AsyncRouter({mergeParams: true});

router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;
