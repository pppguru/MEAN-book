import Book from '../../../api/book/book.model';
import Sale from '../../../api/sale/sale.model';
import Waitinglist from '../../../api/waitinglist/waitinglist.model';
import Bookshelf from '../../../api/bookshelf/bookshelf.model';
import emailService from '../../email';
import {getUserName} from '../../utils';

// import {addObjectsToAlgolia} from '../../../components/algolia';

export default async function (sale) {
     console.log('sale created event');
     const [book, waitingList, createdSale] = await Promise.all([
          Book.findById(sale.book).populate('genre').populate('author'),
          Waitinglist.find({book: sale.book, notified: false}).populate('user', 'email firstName lastName businessName role'),
          Sale.findById(sale._id).populate('seller', 'role businessName firstName lastName').lean()
     ]);
     book.sales.push(sale._id);
     book.save();
     // createdSale.book = book;
     // addObjectsToAlgolia('sales', _.castArray(createdSale));

     /* When user add book for sale, if book is not on bookshelf add it to bookshelf */
     Bookshelf.update({
          user: sale.seller,
          book: sale.book
     }, {
          $set: {user: sale.seller, book: sale.book},
          $setOnInsert: {public: false, read: false, active: true}
     }, {
          upsert: true
     }).exec();

     const emailData = _.map(waitingList, item => {
          markAsNotified(item);
          return {
               user: getUserName({user: item.user, fullName: false}),
               title: book.title,
               price: sale.price,
               domain: config.domain
          };
     });

     emailService.sendTemplate('waitinglist-notified', _.map(waitingList, 'user.email'), emailData);
};

function markAsNotified(item) {
     item.notified = true;
     item.save();
}
