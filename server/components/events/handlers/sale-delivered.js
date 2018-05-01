import emailService from '../../email';
import Request from '../../../api/request/request.model';
import Book from '../../../api/book/book.model';
import Sale from '../../../api/sale/sale.model';
import moment from 'moment';
import ReqMessage from '../../../api/request/message/req.messages.model';
import Wishlist from '../../../api/wishlist/wishlist.model';
import Bookshelf from '../../../api/bookshelf/bookshelf.model';

export default async function ({_id}) {
     console.log('delivered handler');

     /* Populate fields required for email template */
     const req = await Request.findById(_id)
          .populate({path: 'sale', populate: {path: 'book', select: 'title', model: 'Book'}})
          .populate('user', 'firstName email')
          .populate('seller', 'firstName lastName businessName role').lean();

     /* Mark sale as sold */
     Sale.updateOne({_id: req.sale._id}, {status: 'sold'}).exec();

     /* Remove item from book sales */
     Book.update({_id: req.sale.book._id}, {$pullAll: {sales: [req.sale._id]}}).exec();

     const emailData = {
          user: req.user.firstName,
          seller: req.seller.role === 'user' ? `${req.seller.firstName} ${req.seller.lastName}` : req.seller.businessName,
          endDate: moment().add(2, 'days').format('MM/DD/YYYY'),
          title: req.sale.book.title
     };

     emailService.sendTemplate('book-deliver', req.user.email, emailData);

     new ReqMessage({user: req.seller._id, request: req._id, message: `${req.seller.firstName} ${req.seller.lastName} marked book as delivered`, type: 'notification'}).save();
     //Remove from wishlist
     Wishlist.update({active: true, book: req.sale.book._id, user: req.user._id}, {active: false}).exec();
     //Add to bookshelf
     Bookshelf.findOneAndUpdate({active: true, book: req.sale.book._id, user: req.user._id}, {book: req.sale.book._id, user: req.user._id}, {upsert: true, setDefaultsOnInsert: true}).exec();
};
