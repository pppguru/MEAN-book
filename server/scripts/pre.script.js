/* eslint-disable global-require */
// Example run: node ./pre.script.js --script=./books.update.js --env=test ivan bla 123 456
// See https://github.com/substack/node-optimist for additional options
const fs = require('fs');
const argv = require('optimist').argv;
process.env.NODE_ENV = argv.env || argv.enviroment || 'development';
const envPath = '../../.env';
console.log('Setting environment variables.');
try {
     fs.accessSync(envPath, fs.F_OK);
     require('dotenv').config({ path: envPath });
} catch (e) {
     console.error(
          `No environment file not found at ${envPath}, skipping setting environment variables.`
     );
}

if (argv.script) {
     require('../../babel.realtime.setup');
     require('../globals');
     require(argv.script)(argv._);
} else {
     console.log('Please specify script to run.');
}