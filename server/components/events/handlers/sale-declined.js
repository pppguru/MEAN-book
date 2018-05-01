import Sale from '../../../api/sale/sale.model';
import ReqMessage from '../../../api/request/message/req.messages.model';
import Request from '../../../api/request/request.model';
import emailService from '../../email';
import {releaseCharge} from '../../../components/stripe/stripe.service';

export default async function ({_id}) {
     console.log('declined handler');

     /* Populate fields required for email template */
     const req = await Request.findById(_id)
          .populate({path: 'sale', populate: {path: 'book', select: 'title', model: 'Book'}})
          .populate('user', 'firstName lastName businessName email')
          .populate('seller', 'firstName lastName businessName email role');

     /* Mark sale state as active again */
     Sale.updateOne({_id: req.sale._id}, {status: 'available'}).exec();

     try {
          await releaseCharge(req.transaction.chargeId);
          req.transaction.status = 'refunded';
     } catch (err) {
          req.transaction.status = 'refund_failed';
     }
     await req.save();

     new ReqMessage({user: req.seller._id, request: req._id, message: 'Book request was declined by seller', type: 'notification'}).save();

     const emailData = {
          seller: req.seller.role === 'user' ? `${req.seller.firstName} ${req.seller.lastName}` : req.seller.businessName,
          user: req.user.firstName,
          message: req.reason || '',
          reviewUrl: `${config.domain}/all-books/${req.sale.book._id}/details`,
          title: req.sale.book.title
     };

     emailService.sendTemplate('book-decline', req.user.email, emailData);
};
