'use strict';

const controller = require('./book.rating.controller');
import * as auth from '../../../auth/auth.service';

const router = require('express-async-router').AsyncRouter({mergeParams: true});

router.get('/', controller.index);
router.get('/aggregation', controller.aggregate);
router.get('/:id', controller.show);
router.patch('/:rateId', auth.isAuthenticated(), controller.update);
router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;
