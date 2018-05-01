// Example run: node ./pre.script.js --script=./bokbasen.book.js --env=development 9788241920356

import {getBook} from '../components/bokbasen';
module.exports = (args) => {
     (async function () {
          const [isbn] = args;
          await getBook(isbn);
     }()).then(() => console.log(`Script done with operation:`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};