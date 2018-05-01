'use strict';

import * as auth from '../../auth/auth.service';
const controller = require('./author.controller');
const router = require('express-async-router').AsyncRouter();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/books', controller.authorBooks);
router.patch('/:id/following', auth.isAuthenticated(), controller.toggleFollowing);


module.exports = router;
