'use strict';

const controller = require('./export.controller');
import * as auth from '../../auth/auth.service';

const router = require('express-async-router').AsyncRouter();

router.get('/template', auth.isAuthenticated(), controller.template);
router.get('/invalids', auth.isAuthenticated(), controller.invalids);

module.exports = router;
