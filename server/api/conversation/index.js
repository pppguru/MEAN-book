'use strict';

import * as auth from '../../auth/auth.service';
const controller = require('./conversation.controller');
const router = require('express-async-router').AsyncRouter();

router.get('/:id/messages', auth.isAuthenticated(), controller.getMessages);
// router.patch('/:id/remove', auth.isAuthenticated(), controller.remove);

module.exports = router;
