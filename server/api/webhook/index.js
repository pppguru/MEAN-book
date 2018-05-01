'use strict';

const controller = require('./stripe.controller');

const router = require('express-async-router').AsyncRouter();

router.post('/stripe/connected', controller.stripeConnectedEvents);
router.post('/stripe', controller.stripeEvents);

module.exports = router;
