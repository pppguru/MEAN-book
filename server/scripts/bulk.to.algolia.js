// Example run: node ./pre.script.js --script=./bulk.to.algolia.js --env=development 5

import {addObjectsToAlgolia} from '../components/algolia';
import Book from '../api/book/book.model';
import Author from '../api/author/author.model';
import Genre from '../api/genre/genre.model';

module.exports = (args) => {
     (async function () {
          let [fetch] = args;
          let count = await Book.find().count();
          let fetched = 0;

          while (fetched < count) {

               let books = await Book.find({}, '_id isbn title publisher rating subtitle audience year format image genre author sales')
                    .skip(fetched).limit(fetch).populate('author').lean();

               console.log('******************START*************', fetched, count);
               await addObjectsToAlgolia('books', books);

               fetched += books.length;

          }

     }()).then(() => console.log(`Script done with operation:`))
          .catch((err) => console.log('Error', err))
          .then(() => process.exit());
};