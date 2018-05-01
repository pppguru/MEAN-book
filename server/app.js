/**
 * Main application file
 */

'use strict';

import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import cronJob from './components/cron';

// Populate databases with sample data
if (config.seedDB) {
     require('./config/seed');
}

cronJob.startCronJobs();
import './components/bokbasen';
import './components/stripe/stripe.service';
import './components/iban';


//Create Express App
var app = express();

// Setup HTTP server
var server = http.createServer(app);

//Setup Socket IO
const io = require('socket.io')(server);
io.on('connection', socket => {
     console.log(`**** SOCKET CONNECTED ID:${socket.id} ****`);
     global.SOCKET_IO = socket;
     socket.on('disconnect', () => {
          console.log(`**** SOCKET DISCONNECTED ID:${socket.id} ****`);
     });
});
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
     app.bookisApp = server.listen(config.port, config.ip, function() {
          console.log('Express HTTP server listening on %d, in %s mode', config.port, app.get('env'));
     });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
