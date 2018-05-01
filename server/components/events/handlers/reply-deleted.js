import BookReview from '../../../api/book/review/book.review.model';

export default async function (rep) {
     console.log('**** REPLY DELETED ***');
     BookReview.updateOne({_id: rep.reviewId}, {$inc: {noReplies: -1}}).exec();
};