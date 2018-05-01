'use strict';

import * as auth from '../../auth/auth.service';
const controller = require('./sale.controller');
const router = require('express-async-router').AsyncRouter();

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.create);
router.get('/salesbybook', controller.getSalesWithBookId);
router.get('/:id', controller.show);
router.put('/:id', auth.isContentOwner('sale'), controller.update);
router.patch('/:id/remove', auth.isContentOwner('sale'), controller.remove);


module.exports = router;
