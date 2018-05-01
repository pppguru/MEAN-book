'use strict';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../api/user/user.model';
import {getSaleOwnerId} from '../api/sale/sales.service';
import {getBookshelfOwnerId} from '../api/bookshelf/bookshelf.service';
import {getWishlistOwnerId} from '../api/wishlist/wishlist.service';
import {getRequestUsersIds} from '../api/request/request.service';

var validateJwt = expressJwt({
     secret: process.env.SESSION_SECRET
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
     return compose()
     // Validate jwt
          .use((req, res, next) => {
               // allow access_token to be passed through query parameter as well
               if (req.query && req.query.hasOwnProperty('access_token')) {
                    req.headers.authorization = `Bearer ${req.query.access_token}`;
               }
               // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
               if (req.query && typeof req.headers.authorization === 'undefined') {
                    req.headers.authorization = `Bearer ${req.cookies.token}`;
               }
               validateJwt(req, res, next);
          })
          // Attach user to request
          .use((req, res, next) => {
               User.findById(req.user._id)
                    .then(user => {
                         if (!user) {
                              return res.status(401).json({message: 'User not found'});
                         }
                         req.user = user;
                         next();
                         return null;
                    })
                    .catch(err => next(err));
          });
}

export function isContentOwner(entity, field) {
     return compose()
          .use(isAuthenticated())
          .use(async function checkIsContentOwner(req, res, next) {
               try {
                    if (req.user.role === 'admin' || (await isOwner({userId: req.user._id, entity, paramId: req.params.id, field}))) {
                         return next();
                    }
                    return res.sendStatus(403);
               } catch (err) {
                    return next(err);
               }
          });
}

function isOwner({userId, entity, paramId, field}) {
     switch (entity) {
          case 'sale':
               return isSaleOwner({userId, paramId});
          case 'bookshelf':
               return isBookshelfOwner({userId, paramId});
          case 'request':
               return allowedToEditRequest({userId, paramId, field});
          case 'wishlist':
               return isWishlistOwner({userId, paramId});
          default:
               return undefined;
     }
}

async function isSaleOwner({userId, paramId}) {
     const ownerId = await getSaleOwnerId({paramId});
     return String(userId) === String(ownerId);
}
async function isBookshelfOwner({userId, paramId}) {
     const ownerId = await getBookshelfOwnerId({paramId});
     return String(userId) === String(ownerId);
}
async function allowedToEditRequest({userId, paramId, field}) {
     const data = await getRequestUsersIds({paramId});
     return String(data[field]) === String(userId);
}
async function isWishlistOwner({userId, paramId}) {
     const ownerId = await getWishlistOwnerId({paramId});
     return String(userId) === String(ownerId);
}

export function validateToken() {
     return compose()
          .use((req, res, next) => {
               if (req.body && req.body.hasOwnProperty('token')) {
                    jwt.verify(req.body.token, process.env.SESSION_SECRET, (err, decoded) => {
                         if (err) return res.status(403).send('Invalid signature. Invalid or expired token. Please try again.');
                         _.extend(req.body, decoded);
                         next();
                    });
               } else {
                    res.status(403).send('Invalid URL. Please check your URL and try again.');
               }
          });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
     if (!roleRequired) {
          throw new Error('Required role needs to be set');
     }

     return compose()
          .use(isAuthenticated())
          .use((req, res, next) => {
               if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                    return next();
               } else {
                    return res.status(403).send('Forbidden');
               }
          });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(_id, role, expiresIn = 60 * 60 * 5) {
     return jwt.sign({_id, role}, process.env.SESSION_SECRET, {expiresIn});
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
     if (!req.user) {
          return res.status(404).send('It looks like you aren\'t logged in, please try again.');
     }
     const expire = JSON.parse(_.get(req, 'session.remember', false)) ? 60 * 60 * 24 * 30 : 60 * 60 * 5;
     const token = signToken(req.user._id, req.user.role, expire);
     res.cookie('token', token);
     res.redirect(_.get(req, 'session.redirect', '/'));
}
