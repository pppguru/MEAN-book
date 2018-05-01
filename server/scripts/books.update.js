// Example run: node ./pre.script.js --script=./books.update.js --env=development 7

import {addOrUpdateNewBooks} from '../components/bokbasen';
module.exports = (args) => {
     (async function () {
         const [days] = args;
          await addOrUpdateNewBooks(days);  //Fetch 7 days updated books
     }()).then(() => console.log(`Script done with operation:`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};