'use strict';

const controller = require('./course.controller');

const router = require('express-async-router').AsyncRouter({mergeParams: true});

router.get('/', controller.index);
router.post('/', controller.create);
router.delete('/:courseId', controller.remove);
router.put('/:courseId', controller.edit);

module.exports = router;
