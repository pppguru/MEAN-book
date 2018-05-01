import emailService from '../../email';
import User from '../../../api/user/user.model';
import Notification from '../../../api/notification/notifications.model';
import {getUserName} from '../../utils';

export default async function (doc) {
     console.log('*** CONVERSATION STARTED ***');
     const participants = await Promise.all(_.map(doc.participants, id => User.findById(id, 'email firstName lastName businessName role notifications').lean()));
     const initiator = _.first(participants);
     const receivers = _.tail(participants);

     if (_.isEmpty(receivers)) return;

     await new Notification({source: initiator._id, destination: receivers[0]._id, type: 'conversation'}).save();

     const receiversToNotify = _.filter(receivers, 'notifications.message');

     if (_.isEmpty(receiversToNotify)) return;

     const emailData = _.map(receivers, user => ({
          user: getUserName({user, fullName: false}),
          initiator: getUserName({user: initiator, fullName: false}),
          domain: config.domain,
          message: doc.message
     }));

     emailService.sendTemplate('conversation-started', _.map(receivers, 'email'), emailData);
};
