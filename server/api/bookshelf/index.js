'use strict';

import * as auth from '../../auth/auth.service';
const controller = require('./bookshelf.controller');

const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isContentOwner('bookshelf'), controller.update);

module.exports = router;
