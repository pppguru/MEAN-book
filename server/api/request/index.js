'use strict';

import * as auth from '../../auth/auth.service';

const controller = require('./request.controller');
const router = require('express-async-router').AsyncRouter();

// router.get('/', controller.index);
// router.get('/:id', controller.show);
router.get('/methods', controller.getMethods);
router.post('/', auth.isAuthenticated(), controller.create);
router.patch('/:id/approve', auth.isContentOwner('request', 'seller'), controller.approve);
router.patch('/:id/decline', auth.isContentOwner('request', 'seller'), controller.decline);
router.patch('/:id/deliver', auth.isContentOwner('request', 'seller'), controller.deliver);
router.patch('/:id/cancel', auth.isContentOwner('request', 'user'), controller.cancel);
router.patch('/seen/:type', auth.isAuthenticated(), controller.markAsSeen);
// router.delete('/:id', controller.destroy);

module.exports = router;
