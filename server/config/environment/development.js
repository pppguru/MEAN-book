'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

     // MongoDB connection options
     mongo: {
          uri: 'mongodb://localhost/bookis-dev'
     },

     // Seed database on startup
     // seedDB: {
     //      users: true,
     //      books: true,
     //      genres: true,
     //      requests: true,
     //      ratings: true
     // }

};
