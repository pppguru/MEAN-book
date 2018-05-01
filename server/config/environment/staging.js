'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
module.exports = {
     // Server IP
     ip: process.env.OPENSHIFT_NODEJS_IP
     || process.env.ip
     || undefined,

     // Server port
     port: process.env.OPENSHIFT_NODEJS_PORT
     || process.env.PORT
     || 8080,

     // MongoDB connection options
     mongo: {
          uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds135440-a0.mlab.com:35440,ds135440-a1.mlab.com:35440/${process.env.DB_NAME}?replicaSet=rs-ds135440`
     },

     //seed db on start
     seedDB: {
          users: false,
          books: false,
          genres: false
     }
};
