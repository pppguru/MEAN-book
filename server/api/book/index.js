'use strict';

import * as auth from '../../auth/auth.service';
const controller = require('./book.controller');
import multer from 'multer';

const router = require('express-async-router').AsyncRouter();
const upload = multer({dest: 'uploads/'});

router.get('/', controller.index);
router.get('/:id/suggested', controller.getSuggested);
router.get('/:id/isbn', controller.getISBN);
router.get('/recommended', controller.getRecommended);
router.get('/kids/recommended', controller.getKidsRecommended);
router.get('/kids/popular', controller.getKidsPopular);
router.get('/students', controller.getStudentsBooks);
router.get('/autocomplete', controller.autocomplete);
router.get('/:id', controller.show);
// router.post('/', auth.isAuthenticated(), controller.create);
router.post('/bulk', auth.isAuthenticated(), upload.single('file'), controller.bulk);
router.post('/bulk/validate', auth.isAuthenticated(), upload.single('file'), controller.validate);
// router.put('/:id', controller.upsert);
// router.patch('/:id', controller.patch);
// router.delete('/:id', controller.destroy);

module.exports = router;
