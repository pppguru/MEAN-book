// Example run: node ./pre.script.js --script=./stripe.customers.js --env=development fetch customer cus_AQLnLlNq7sAnla

import * as stripe from '../components/stripe/stripe.service';
module.exports = (args) => {
     const [operation, entity, id] = args;
     (async function () {
          switch (operation) {
               case 'fetch':
                    switch (entity) {
                         case 'customer':
                              console.log('customer: ', await stripe.getCustomer(id));
                              break;
                         case 'managed':
                              console.log('managed: ', JSON.stringify(await stripe.getAccount(id), null, 2));
                              break;
                         case 'external':
                              console.log('managed: ', JSON.stringify(await stripe.listExternalAccounts(id, {object: 'card'}), null, 2));
                              break;
                         case 'balance':
                              console.log('balance: ', JSON.stringify(await stripe.getBalance(id), null, 2));
                              break;
                         case 'payouts':
                              console.log('payouts: ', JSON.stringify(await stripe.listPayouts(id), null, 2));
                              break;
                         default:
                              break;
                    }
                    break;
               default:
                    break;
          }
     }()).then(() => console.log(`Script done with operation: ${operation} ${entity} ${id}`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};