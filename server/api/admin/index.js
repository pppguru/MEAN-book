'use strict';

import books from './books';
import users from './users';
import reviews from './reviews';
import replies from './replies';
import requests from './requests';
import schools from './schools';
import genres from './genres';
import constants from './constants';
import waitinglist from './waitinglist';
import exports from './exports';
import notification from './notification';
const router = require('express-async-router').AsyncRouter();

router.use('/books', books);
router.use('/users', users);
router.use('/reviews', reviews);
router.use('/replies', replies);
router.use('/requests', requests);
router.use('/schools', schools);
router.use('/genres', genres);
router.use('/waitinglists', waitinglist);
router.use('/constants', constants);
router.use('/exports', exports);
router.use('/notifications', notification);

module.exports = router;
