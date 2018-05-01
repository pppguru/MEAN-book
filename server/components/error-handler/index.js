'use strict';

import _ from 'lodash';
import useragent from 'useragent';
const isValidObjectId = (id) => id ? /^[a-fA-F0-9]{24}$/.test(id.toString()) : false;

const isValidationError = err => _.eq(_.get(err, 'name'), 'ValidationError');

function handleError(req, res, forcedCode) {
     return err => {
          let code = forcedCode ? forcedCode : err.code || err.statusCode;
          if (err.message === 'jwt expired') code = 401;
          if (!code || !_.isNumber(code)) {
               code = isValidationError(err) ? 422 : 500;
          }
          loggly.error(augmentError(err, req));
          return res.status(code).send(resErr(err, req));
     };
}

function resErr(err, req) {
     return {
          start: (req.bookis && new Date(req.bookis.start)) || undefined,
          duration: (req.bookis && Date.now() - req.bookis.start) || undefined,
          status: 'error',
          message: err.message,
          stack: err.stack,
          data: {}
     };
}

function augmentError(error, req) {
     _.forOwn(req.body, (v, k) => {
          if (isValidObjectId(v)) req.body[k] = v.toString();
     });
     if (!_.isObject(error)) return error;
     if (error instanceof Error) {
          error = {
               message: error.message,
               stack: error.stack
          };
     }
     return {
          originalError: error,
          details: {
               startedAt: (req.bookis && new Date(req.bookis.start)) || undefined,
               duration: (req.bookis && Date.now() - req.bookis.start) || undefined,
               body: req.body,
               user: _.toString(_.get(req, 'user._id')),
               params: req.params,
               method: req.method,
               headers: req.headers,
               URL: req.originalUrl,
               location: req.location,
               os: useragent.parse(req.headers['user-agent']).os.toString(),
               device: useragent.parse(req.headers['user-agent']).device.toString()
          }
     };
}

export {
     handleError
};
