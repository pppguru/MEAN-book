// Example run: node ./pre.script.js --script=./books.reset.js --env=development

import Books from '../api/book/book.model';

module.exports = () => {
     (async function () {
          await Books.updateMany({}, {
               reviews: 0,
               'rating.avg': 0,
               'rating.votes': 0,
               sales: [],
               courses: []
          }).exec();
     }()).then(() => console.log(`Script done with operation:`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};