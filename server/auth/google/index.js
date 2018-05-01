'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';

function addRedirectToSession(req, res, next) {
     req.session.redirect = req.query.redirect;
     req.session.remember = req.query.remember;
     next();
}

var router = express.Router();

router
     .get('/', addRedirectToSession, passport.authenticate('google', {
          failureRedirect: '/',
          scope: [
               'profile',
               'email'
          ],
          session: false
     }))
     .get('/callback', passport.authenticate('google', {
          failureRedirect: '/',
          session: false
     }), setTokenCookie);

export default router;
