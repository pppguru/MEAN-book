// Example run: node ./pre.script.js --script=./books.bulk.update.to.algolia.js --env=development

import {updateAlgoliaObjectFromAllExistingBooks} from '../components/algolia';

module.exports = (args) => {
     (async function () {
         await updateAlgoliaObjectFromAllExistingBooks();
     }()).then(() => console.log(`Script done with operation:`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};