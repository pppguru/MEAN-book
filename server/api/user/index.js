'use strict';

import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';
import verifications from './verifications';
import multer from 'multer';

const router = require('express-async-router').AsyncRouter();
const upload = multer({dest: 'uploads/'});

router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/near', controller.near);
router.post('/password/email', controller.sendResetEmail);
router.post('/password/reset', auth.validateToken(), controller.resetPasswordWithToken);
router.post('/password/set', auth.isAuthenticated(), controller.setPassword);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', controller.show);
router.get('/:id/stats', controller.stats);
router.get('/:id/sales', controller.getUserSales);
router.get('/:id/conversations', auth.isAuthenticated(), controller.getUserConversations);
router.get('/:id/requests', auth.isAuthenticated(), controller.getUserRequests);
router.get('/:id/requests/incoming', auth.isAuthenticated(), controller.getUserIncomingRequests);
router.get('/:id/requests/incoming/aggregation', auth.isAuthenticated(), controller.getUserIncomingRequestsAggregation);
router.get('/:id/requests/sent', auth.isAuthenticated(), controller.getUserSentRequests);
router.get('/:id/requests/sent/aggregation', auth.isAuthenticated(), controller.getUserSentRequestsAggregation);
router.get('/:id/wishlist', auth.isAuthenticated(), controller.getUserWishList);
router.get('/:id/waitinglist', auth.isAuthenticated(), controller.getUserWaitinglist);
router.get('/:id/wishlist/public', controller.getUserPublicWishList);
router.get('/:id/bookshelf', auth.isAuthenticated(), controller.getUserBookshelf);
router.get('/:id/bookshelf/public', controller.getUserPublicBookshelf);
router.get('/:id/bookshelf/aggregation', auth.isAuthenticated(), controller.getUserBookshelfAggregation);
router.post('/', controller.create);
router.post('/:id/accounts', auth.isAuthenticated(), controller.createAccount);
router.post('/:id/payout', auth.isAuthenticated(), controller.payout);
router.delete('/:id/accounts/:accountId', auth.isAuthenticated(), controller.deleteAccount);
router.patch('/:id/accounts/:accountId', auth.isAuthenticated(), controller.setAsDefaultAccount);
router.put('/:id', auth.isAuthenticated(), controller.updateCurrentUser);
router.patch('/:id/profile', upload.single('file'), auth.isAuthenticated(), controller.uploadProfileImage);
router.patch('/:id/notifications', auth.isAuthenticated(), controller.updateNotification);
router.patch('/:id/following', auth.isAuthenticated(), controller.toggleFollowing);
router.patch('/:id/deactivate', auth.isAuthenticated(), controller.deactivate);
router.use('/verifications', verifications);

module.exports = router;
