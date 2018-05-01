/* eslint indent: 0 */
'use strict';
import Request from '../request/request.model';
import {payoutFunts} from '../../components/stripe/stripe.service';

export async function stripeEvents(req, res) {
     const event = req.body;
     switch (event.type) {
          case 'balance.available':
               console.log('--------------------------------');
               console.log('event: ', JSON.stringify(event, null, 2));
               const currency = 'nok';
               const amount = _.get(_.find(event.data.object.available, {currency}), 'amount');
               console.log('sent to Bookis account payout', {amount, currency});
               try {
                    await payoutFunts(undefined, {amount, currency});
               } catch (err) {
                    console.log('Err :', err);
               }
               console.log('----------------------------');
               break;
          default:
               console.log('Unhandled stripe event', event.type);
     }
     res.status(200).end();
}

export async function stripeConnectedEvents(req, res) {
     const event = req.body;
     switch (event.type) {
          case 'balance.available':
               console.log('******************************');
               console.log('Event.user_id :', event.user_id);
               console.log('event: ', JSON.stringify(event, null, 2));
               const currency = 'nok';
               const amount = _.get(_.find(event.data.object.available, {currency}), 'amount');
               console.log('sent to managed id payout', {amount, currency});
               let status;
               try {
                    await payoutFunts(event.user_id, {amount, currency});
                    status = 'transferred';
               } catch (err) {
                    status = 'transfer_failed';
                    console.log('Err :', err);
               }
               await Request.updateMany({
                    'transaction.status': 'processed',
                    'transaction.destinationPaymentAccountId': event.user_id
               }, {'transaction.status': status}).exec();
               console.log('******************************');
               break;
          default:
               console.log('Unhandled stripe event', event.type);
     }
     res.status(200).end();
}
