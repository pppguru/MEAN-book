'use strict';

const controller = require('./req.messages.controller');
import * as auth from '../../../auth/auth.service';

const router = require('express-async-router').AsyncRouter({mergeParams: true});

router.get('/', controller.index);
router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;
