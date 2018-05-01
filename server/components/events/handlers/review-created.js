import Book from '../../../api/book/book.model';
import Notification from '../../../api/notification/notifications.model';

export default async function (rev) {
     console.log('**** REVIEW CREATED ***');
     Book.updateOne({_id: rev.book}, {$inc: {reviews: 1}}).exec();
     await new Notification({source: rev.user, book: rev.book, type: 'review', meta: rev.review}).save();
};
