'use strict';

import express from 'express';
import passport from 'passport';
import {signToken} from '../auth.service';
import Constant from '../../api/constants/constants.model';

const router = express.Router();

router.post('/', (req, res, next) => {
     passport.authenticate('local', (err, user, info) => {
          let error = err || info;
          if (error) {
               return res.status(401).json(error);
          }
          if (!user) {
               return res.status(404).json({message: 'Something went wrong, please try again.'});
          }
          if (!user.active && !req.body.requestedReactivation) {
               return res.status(401).json({message: 'Your account is deactivated.'});
          }
          if (!user.active && req.body.requestedReactivation) {
               user.active = true;
               user.save();
          }
          const expiration = req.body.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 5;
          let token = signToken(user._id, user.role, expiration);
          res.json({token, role: user.role});
     })(req, res, next);
});

router.post('/unlock', async (req, res) => {
     const {rootPassword} = await Constant.findOne({}).lean();
     res.status(req.body.pass === rootPassword ? 200 : 401).end();
});

export default router;
