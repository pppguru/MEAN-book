/* eslint-disable global-require, import/no-extraneous-dependencies */
require('babel-polyfill');

require('babel-register')({
     plugins: ['transform-promise-to-bluebird'],
     presets: [['env', {
          targets: {
               node: 6
          }
     }]],
     compact: false
});