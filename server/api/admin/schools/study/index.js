'use strict';

const controller = require('./study.controller');
import courses from './course';

const router = require('express-async-router').AsyncRouter({mergeParams: true});

router.get('/', controller.index);
router.post('/', controller.create);
router.delete('/:studyId', controller.remove);
router.put('/:studyId', controller.edit);
router.use('/:studyId/courses', courses);

module.exports = router;
