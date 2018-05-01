import Book from '../../../api/book/book.model';

export default async function (rev) {
     console.log('*** REVIEW DELETED ***');
     Book.updateOne({_id: rev.book}, {$inc: {reviews: -1}}).exec();
};
