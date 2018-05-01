// Example run: node ./pre.script.js --script=./books.repair.js --env=development

import { repairExistingBooksWithLessAPICall } from '../components/bokbasen';
module.exports = (args) => {
    (async function() {
        await repairExistingBooksWithLessAPICall();
    }()).then(() => console.log(`Script done with operation:`))
        .catch((err) => console.log('Error', err))
        .then(() => process.exit());
};