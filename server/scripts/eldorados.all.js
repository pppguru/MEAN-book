// Example run: node ./pre.script.js --script=./eldorados.all.js --env=development

import {fetchAllInventoryAndPrice} from '../components/eldorados';
module.exports = (args) => {
     (async function () {
          await fetchAllInventoryAndPrice();
     }()).then(() => console.log(`Script done with operation:`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};
