'use strict';

import format from 'string-template';
import winston from 'winston';
require('winston-loggly-bulk');

winston.addColors({
     debug: 'blue',
     info: 'green',
     warn: 'yellow',
     error: 'red'
});

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {prettyPrint: true, colorize: true});

if (config.env === 'staging') {
     winston.add(winston.transports.Loggly, {
          token: config.LOGGLY_TOKEN,
          subdomain: 'bookis',
          tags: ['Winston-NodeJS'],
          json: true
     });
}
const DEBUG = 'debug';
const INFO = 'info';
const WARN = 'warn';
const ERROR = 'error';

function formatMessage(message) {
     try {
          return _.isObject(message) ? {Error: _.isError(message) ? message.toString() : message, stack: _.get(message, 'stack'), environment: config.env.toUpperCase()} :
               format('[{0}] - {1}', [config.env.toUpperCase(), message])
     } catch (ex) {
          console.log('EX', ex);
     }
     return message;
}

function debug(message) {
     winston.log(DEBUG, message);
}

function info(message) {
     winston.log(INFO, message);
}

function warn(message) {
     winston.log(WARN, message);
}

function error(message) {
     winston.log(ERROR, formatMessage(message));
}

export {
     debug,
     info,
     warn,
     error
};
