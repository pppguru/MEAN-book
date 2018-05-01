// Example run: node ./pre.script.js --script=./insert.into.azure.table.js --env=development

import {insertIntoTable, connect} from '../components/azure';
import User from '../api/user/user.model';

module.exports = (args) => {
     (async function () {
          let user = await User.findOne().lean();
          const status = await connect();
          insertIntoTable({table: 'Users', data: user});
     }()).then(() => console.log(`Script done with operation:`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};