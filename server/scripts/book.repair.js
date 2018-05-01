// Example run: node ./pre.script.js --script=./book.repair.js --env=development

import { repairBook } from '../components/bokbasen';
module.exports = (args) => {
    (async function() {
        const [isbn] = args;
        await repairBook(isbn);
    }()).then(() => console.log(`Script done with operation:`))
        .catch((err) => console.log('Error', err))
        .then(() => process.exit());
};