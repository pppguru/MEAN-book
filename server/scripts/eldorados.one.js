// Example run: node ./pre.script.js --script=./eldorados.one.js --env=development 9788241920356

import {fetchInventoryAndPrice} from '../components/eldorados';
module.exports = (args) => {
     (async function () {
          const [isbn] = args;
          await fetchInventoryAndPrice(isbn);
     }()).then(() => console.log(`Script done with operation:`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};