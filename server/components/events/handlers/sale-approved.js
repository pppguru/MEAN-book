import emailService from '../../email';
import {captureCharge} from '../../../components/stripe/stripe.service';
import Request from '../../../api/request/request.model';
import Sale from '../../../api/sale/sale.model';
import ReqMessage from '../../../api/request/message/req.messages.model';
import Notification from '../../../api/notification/notifications.model';
import * as auth from '../../../auth/auth.service';

export default async function ({_id}) {
     console.log('approved handler');

     /* Populate fields required for email template */
     const req = await Request.findById(_id)
          .populate({path: 'sale', populate: {path: 'book', model: 'Book', populate: {path: 'author', model: 'Author'}}})
          .populate('user', 'firstName lastName businessName email role')
          .populate('seller', 'firstName lastName businessName email');
     const sale = await Sale.findById(req.sale._id);

     try {
          await captureCharge(req.transaction.chargeId);
          req.transaction.status = 'processed';
          sale.status = 'captured';
          await sale.save();
     } catch (err) {
          req.transaction.status = 'failed';
     }
     await req.save();

     await new Notification({source: req.seller._id, destination: req.user._id, type: 'bought', book: req.sale.book._id}).save();

     const token = auth.signToken(req.user._id, req.user.role, 60 * 60 * 24);
     const emailData = {
          reviewUrl: `${config.domain}?jwt=${token}&redirect=myzone.orderhistory.requested`,
          user: req.user.firstName,
          title: req.sale.book.title
     };
     emailService.sendTemplate('book-approve', req.user.email, emailData);
     new ReqMessage({user: req.seller._id, request: req._id, message: `${req.seller.firstName} ${req.seller.lastName} accepted book request`, type: 'notification'}).save();
};
