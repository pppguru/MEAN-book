'use strict';

import express from 'express';
import passport from 'passport';
import {setTokenCookie} from '../auth.service';

const router = express.Router();

function addRedirectToSession(req, res, next) {
     req.session.redirect = req.query.redirect;
     req.session.remember = req.query.remember;
     next();
}

router
     .get('/', addRedirectToSession, passport.authenticate('facebook', {
          scope: ['email', 'user_about_me', 'user_actions.books'],
          failureRedirect: '/',
          session: false
     }))
     .get('/callback', passport.authenticate('facebook', {
          failureRedirect: '/',
          session: false
     }), setTokenCookie);

export default router;
