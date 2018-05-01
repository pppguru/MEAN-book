'use strict';

const controller = require('./book.controller');
const router = require('express-async-router').AsyncRouter();
import multer from 'multer';
const upload = multer({dest: 'uploads/'});

router.get('/', controller.index);
router.post('/bulk', upload.single('file'), controller.bulk);
router.put('/:id/courses/:courseId', controller.toggleCourse);
router.get('/courses/:courseId', controller.getCourseBooks);
router.get('/aggregation', controller.aggregation);

module.exports = router;
