'use strict';

import * as controller from './verifications.controller';
import * as auth from '../../../auth/auth.service';

var router = require('express-async-router').AsyncRouter();

router.patch('/email', auth.validateToken(), controller.verifyEmail);
router.post('/email', controller.resendVerificationEmail);

module.exports = router;
