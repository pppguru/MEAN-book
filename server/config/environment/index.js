'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
 if(!process.env[name]) {
 throw new Error('You must set the ' + name + ' environment variable');
 }
 return process.env[name];
 }*/

// All configurations will extend these options
// ============================================
var all = {
     env: process.env.NODE_ENV,
     domain: process.env.DOMAIN,
     prerender: process.env.PRERENDER_TOKEN,
     BRING_API_KEY: process.env.BRING_API_KEY,
     SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
     ALGOLIA_ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY,
     ALGOLIA_MONITORING_KEY: process.env.ALGOLIA_MONITORING_KEY,
     ALGOLIA_SEARCH_KEY: process.env.ALGOLIA_SEARCH_KEY,
     ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
     STRIPE_TEST_KEY: process.env.STRIPE_TEST_KEY,
     STRIPE_TEST_PUBLISH_KEY: process.env.STRIPE_TEST_PUBLISH_KEY,
     STRIPE_LIVE_KEY: process.env.STRIPE_LIVE_KEY,
     STRIPE_LIVE_PUBLISH_KEY: process.env.STRIPE_LIVE_PUBLISH_KEY,
     LOGGLY_TOKEN: process.env.LOGGLY_TOKEN,
     AZURE_DATABASE: process.env.AZURE_DATABASE,
     AZURE_PASSWORD: process.env.AZURE_PASSWORD,
     AZURE_USERNAME: process.env.AZURE_USERNAME,
     AZURE_SERVER: process.env.AZURE_SERVER,

     // Root path of server
     root: path.normalize(`${__dirname}/../../..`),

     // Browser-sync port
     browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

     // Server port
     port: process.env.PORT || 9000,

     // Server IP
     ip: process.env.IP || '0.0.0.0',

     // Should we populate the DB with sample data?
     seedDB: false,

     // MongoDB connection options
     mongo: {
          options: {
               db: {
                    safe: true
               }
          }
     },

     s3: {
          accessKeyId: process.env.S3_KEY,
          secretAccessKey: process.env.S3_SECRET,
          bucket: `bookis.web.${process.env.NODE_ENV}`,
          region: 'eu-west-1',
          ACL: 'public-read'
     },

     facebook: {
          clientID: process.env.FACEBOOK_ID || 'id',
          clientSecret: process.env.FACEBOOK_SECRET || 'secret',
          callbackURL: `${process.env.DOMAIN || ''}/auth/facebook/callback`
     },

     twitter: {
          clientID: process.env.TWITTER_ID || 'id',
          clientSecret: process.env.TWITTER_SECRET || 'secret',
          callbackURL: `${process.env.DOMAIN || ''}/auth/twitter/callback`
     },

     google: {
          clientID: process.env.GOOGLE_ID || 'id',
          clientSecret: process.env.GOOGLE_SECRET || 'secret',
          callbackURL: `${process.env.DOMAIN || ''}/auth/google/callback`
     },

     events: {
          SALE_REQUESTED: 'sale-requested',
          SALE_APPROVED: 'sale-approved',
          SALE_DELIVERED: 'sale-delivered',
          SALE_DECLINED: 'sale-declined',
          SALE_CANCELED: 'sale-canceled',
          REQUEST_EXPIRED: 'request-expired',
          REVIEW_CREATED: 'review-created',
          REPLY_CREATED: 'reply-created',
          REPLY_DELETED: 'reply-deleted',
          REVIEW_DELETED: 'review-deleted',
          SALE_CREATED: 'sale-created',
          SALE_DELETED: 'sale-deleted',
          USER_DEACTIVATED: 'user-deactivated',
          USER_FOLLOWED: 'user-followed',
          MESSAGE_SENT: 'message-sent',
          CONVERSATION_STARTED: 'conversation-started',
          USER_REACTIVATED: 'user-reactivated'
     }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
     all,
     require('./shared'),
     require(`./${process.env.NODE_ENV}.js`) || {});
