import emailService from '../../email';
import Request from '../../../api/request/request.model';
import ReqMessage from '../../../api/request/message/req.messages.model';
import Wishlist from '../../../api/wishlist/wishlist.model';
import Sale from '../../../api/sale/sale.model';
import * as auth from '../../../auth/auth.service';

export default async function ({_id}) {
     console.log('new requested handler');

     /* Populate fields required for email template */
     const req = await Request.findById(_id)
          .populate({path: 'sale', populate: {path: 'book', model: 'Book', populate: {path: 'author', model: 'Author'}}})
          .populate('user', 'firstName lastName businessName email')
          .populate('seller', 'firstName lastName businessName email role').lean();

     /* Mark sale state as requested */
     Sale.updateOne({_id: req.sale._id}, {status: 'requested'}).exec();

     if (req.message) {
          new ReqMessage({user: req.user._id, request: req._id, message: req.message}).save();
     }

     Wishlist.findOneAndUpdate({active: true, book: req.sale.book._id, user: req.user._id}, {book: req.sale.book._id, user: req.user._id}, {upsert: true, setDefaultsOnInsert: true}).exec();
     const token = auth.signToken(req.seller._id, req.seller.role, 60 * 60 * 24);
     const emailData = {
          reviewUrl: `${config.domain}?jwt=${token}&redirect=myzone.salesbooth.pending`,
          seller: req.seller.role === 'user' ? req.seller.firstName : req.seller.businessName,
          user: `${req.user.firstName} ${req.user.lastName}`,
          imageUrl: req.sale.book.image.full,
          title: req.sale.book.title,
          message: req.message || '',
          price: `${req.sale.price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} NOK`, // eslint-disable-line space-infix-ops
          author: getAuthor(req.sale.book.author),
          year: req.sale.book.year
     };
     emailService.sendTemplate('book-request', req.seller.email, emailData);
};

function getAuthor(value) {
     if (_.isEmpty(_.compact(value)) || !value) return 'N/A';
     return _.map(value, el => {
          if (el.corporateName) return el.corporateName;
          return `${el.firstName} ${el.lastName}`;
     }).join(', ');
}
