import Request from '../../../api/request/request.model';
import Sale from '../../../api/sale/sale.model';
import ReqMessage from '../../../api/request/message/req.messages.model';
import {releaseCharge} from '../../../components/stripe/stripe.service';

export default async function ({_id}) {
     console.log('expired handler');

     /* Populate fields required for email template */
     const req = await Request.findById(_id).populate('sale');
     /* Remove item from book sales */

     try {
          await releaseCharge(req.transaction.chargeId);
          req.transaction.status = 'refunded';
     } catch (err) {
          req.transaction.status = 'refund_failed';
     }
     await req.save();

     Sale.updateOne({_id: req.sale._id}, {status: 'available'}).exec();

     new ReqMessage({request: req._id, message: 'Request for this book has expired', type: 'notification'}).save();
};
