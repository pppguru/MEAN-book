/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import {postRoute} from './components/middlewares/handlers';
import {preRoute} from './components/middlewares/loggly';
import * as auth from './auth/auth.service';

export default function(app) {
     // Insert routes below
     app.use('/:url(api|auth)/*', preRoute);
     app.use('/api/authors', require('./api/author'));
     app.use('/api/books', require('./api/book'));
     app.use('/api/sales', require('./api/sale'));
     app.use('/api/books/:id/ratings', require('./api/book/rating'));
     app.use('/api/books/:id/reviews', require('./api/book/review'));
     app.use('/api/books/:id/reviews/:reviewId/replies', require('./api/book/reply'));
     app.use('/api/genres', require('./api/genre'));
     app.use('/api/requests', require('./api/request'));
     app.use('/api/requests/:id/messages', require('./api/request/message'));
     app.use('/api/users', require('./api/user'));
     app.use('/api/schools', require('./api/school'));
     app.use('/api/wishlists', require('./api/wishlist'));
     app.use('/api/waitinglists', require('./api/waitinglist'));
     app.use('/api/bookshelfs', require('./api/bookshelf'));
     app.use('/api/exports', require('./api/export'));
     app.use('/api/constants', require('./api/constants'));
     app.use('/api/conversations', require('./api/conversation'));
     app.use('/api/messages', require('./api/message'));
     app.use('/api/notifications', require('./api/notification'));
     app.use('/api/webhooks', require('./api/webhook'));
     app.use('/api/admin', auth.hasRole('admin'), require('./api/admin'));

     app.use('/auth', require('./auth').default);

     postRoute(app);

     // All undefined asset or api routes should return a 404
     app.route('/:url(api|auth|components|app|bower_components|assets)/*')
          .get(errors[404]);

     // All other routes should redirect to the index.html
     app.route('/*')
          .get((req, res) => {
               res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
          });
}
