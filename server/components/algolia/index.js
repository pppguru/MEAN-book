import algolia from 'algoliasearch';

import Book from '../../api/book/book.model';
import Author from '../../api/author/author.model';
import Genre from '../../api/genre/genre.model';

const client = algolia(config.ALGOLIA_APP_ID, config.ALGOLIA_ADMIN_KEY);
export const bookTransformer = book => _.pickBy({
     objectID: book._id,
     title: book.title,
     publisher: book.publisher,
     rate: _.get(book, 'rating.avg'),
     maleRate: _.get(book, 'rating.male.avg'),
     femaleRate: _.get(book, 'rating.female.avg'),
     subtitle: book.subtitle,
     audience: book.audience,
     year: book.year,
     format: book.format,
     image: _.get(book, 'image.full'),
     genre: _.map(book.genre, String),
     available: _.size(book.sales),
     isbn_short: _.get(book, 'isbn.short'), //eslint-disable-line camelcase
     isbn_full: _.get(book, 'isbn.full'), //eslint-disable-line camelcase
     author: _.map(_.compact(book.author), a => ({
          _id: a._id,
          displayName: a.corporateName || `${a.firstName} ${a.lastName}`
     }))
}, v => !_.isNil(v));
const indexes = {
     books: {
          index: client.initIndex('books'),
          transformer: bookTransformer
     },
     users: {
          index: client.initIndex('users'),
          transformer: user => ({
               objectID: user._id,
               name: user.businessName || `${user.firstName} ${user.lastName}`,
               email: user.email,
               image: user.imageUrl
          })
     },
     sales: {
          index: client.initIndex('sales'),
          transformer: sale => ({
               objectID: sale._id,
               seller: sale.seller.businessName || `${sale.seller.firstName} ${sale.seller.lastName}`,
               price: sale.price,
               condition: sale.condition,
               book: _.omit(bookTransformer(sale.book), ['publisher', 'subtitle', 'isbn_short', 'isbn_full'])
          })
     }
};

export function addObjectsToAlgolia(index, data) {
     if (config.env === 'development') return;
     return indexes[index].index.addObjects(_.map(_.castArray(data), indexes[index].transformer))
          .then(d => {
            //    console.log('Created!');
               return d;
          })
          .catch(err => {
               console.log('Algolia add objects Err :', err);
          });
}

export function removeObjectsFromAlgolia(index, data) {
     if (config.env === 'development') return;
     return indexes[index].index.deleteObjects(_.map(_.castArray(data), '_id'))
          .then(d => {
               console.log('Deleted!');
               return d;
          })
          .catch(() => {
               console.log('Algolia remove objects Err :');
          });
}

export function updateAlgoliaObject(indexName, objectID, data) {
     if (config.env === 'development') return;
     const updateObject = {
          action: 'partialUpdateObject',
          indexName,
          body: {objectID}
     };
     _.extend(updateObject.body, data);
     return client.batch([updateObject]);
}

////////---------------------------------------------------------///////////////
export async function updateAlgoliaObjectForBook(book) {
    let transferredBook = bookTransformer(book);
    let result = await updateAlgoliaObject('books', book._id.toString(), {
        author: transferredBook.author,
        genre: transferredBook.genre
    });
}
export async function updateAlgoliaObjectFromAllExistingBooks() {
    let fetch = 1000;
    let count = await Book.find().count();
    let fetched = 0;

    console.log('******************START Update Algolia*************');
    while (fetched < count) {
        var t0 = new Date().getTime();

        let books = await Book.find({}, '_id isbn title publisher rating subtitle audience year format image genre author sales')
            .skip(fetched).limit(fetch).populate('author').lean();

        for (let book of books) {
            await updateAlgoliaObjectForBook(book);
        }
        
        fetched += books.length;

        var t1 = new Date().getTime();
        console.log('------Algolia Books Updated : ' +  fetched + ' in ' + (t1 - t0) / 1000 + ' seconds');
    }

    console.log('******************END Update Algolia*************');
}
