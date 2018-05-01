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
          uri: 'mongodb://localhost/bookis-dev'
          // uri: `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds145709-a0.mlab.com:45709,ds145709-a1.mlab.com:45709/${process.env.DB_NAME}?replicaSet=rs-ds145709`
     }
};
