// Example run: node ./pre.script.js --script=./users.reset.js --env=development

import Users from '../api/user/user.model';

module.exports = () => {
     (async function () {
          await Users.updateMany({}, {
               $set: {
                    'accounts.payment': [],
                    'accounts.payout': [],
                    'following': [],
                    'followers': [],
                    'numeric.following': 0,
                    'numeric.followers': 0
               },
               $unset: {
                    'paymentAccount': '',
                    'paymentCustomer': ''
               }
          }).exec();
     }()).then(() => console.log(`Script done with operation:`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};