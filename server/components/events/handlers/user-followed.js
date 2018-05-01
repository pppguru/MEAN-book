import User from '../../../api/user/user.model';
import Notification from '../../../api/notification/notifications.model';
import emailService from '../../email';

export default async function ({user, follower}) {
     try {
          console.log('*** USER FOLLOWED ***');

          const pop = '-password -salt';
          const [userDB, followerDB, exists] = await Promise.all([
               User.findById(user, pop).lean(),
               User.findById(follower, pop).lean(),
               Notification.findOne({source: follower, destination: user, type: 'following'})
          ]);

          if (!_.get(userDB, 'notifications.followsMe')) return;

          if (exists) return;

          await new Notification({source: followerDB, destination: userDB, type: 'following'}).save();

          const emailData = {
               user: userDB.role === 'user' ? userDB.firstName : userDB.businessName,
               domain: config.domain,
               follower: followerDB.role === 'user' ? `${followerDB.firstName} ${followerDB.lastName}` : followerDB.businessName
          };

          emailService.sendTemplate('user-followed', userDB.email, emailData);
     } catch (err) {
          console.log('Err :', err);
     }

};
