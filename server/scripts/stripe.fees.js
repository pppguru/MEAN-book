// Example run: node ./pre.script.js --script=./stripe.fees.js --env=development calculate fees 230

import * as stripeCalc from '../components/utils/index';
module.exports = (args) => {
     const [operation, entity, amount] = args;
     (async function () {
          switch (operation) {
               case 'calculate':
                    switch (entity) {
                         case 'fees':
                              const fees = await stripeCalc.calculateBookisServiceFee({base: +amount});
                              console.log('service: ', fees);
                              console.log('processing: ', await stripeCalc.calculateStripeProcessingFee({base: +amount + +fees.buyer}));
                              break;
                    }
                    break;
               default:
                    break;
          }
     }()).then(() => console.log(`Script done with operation: ${operation} ${entity} ${amount}`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};