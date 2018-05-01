// Example run: node ./pre.script.js --script=./users.to.algolia.js --env=development 5

import {addObjectsToAlgolia} from '../components/algolia';
import User from '../api/user/user.model';

module.exports = (args) => {
     (async function () {
          let users = await User.find({role: {$ne: 'admin'}}).lean();
          await addObjectsToAlgolia('users', users);
     }()).then(() => console.log(`Script done with operation:`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};