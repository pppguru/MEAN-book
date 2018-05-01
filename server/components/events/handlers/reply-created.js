import BookReview from '../../../api/book/review/book.review.model';
import User from '../../../api/user/user.model';
import Notification from '../../../api/notification/notifications.model';
import emailService from '../../email';
import {getUserName} from '../../utils';

export default async function (rep) {
     console.log('**** REPLY CREATED ***');

     const review =  await BookReview.findById(rep.reviewId);

     review.noReplies += 1;
     review.save();

     if (review.user.toString() === rep.user.toString()) {
          console.log('Skipping self replying');
          return;
     }

     const user = await User.findById(review.user).lean();

     if (!user.notifications.commentMyReview) {
          console.log('User disabled reply notifications');
          return;
     }

     console.log('creating notification');
     await new Notification({source: rep.user, destination: review.user, review, book: review.book, type: 'reply', meta: rep.reply}).save();

     const emailData = {
          user: getUserName({user, fullName: false}),
          domain: config.domain,
          redirect: `${config.domain}/all-books/${review.book}/details`,
          reply: rep.reply
     };

     emailService.sendTemplate('reply-created', user.email, emailData);
};