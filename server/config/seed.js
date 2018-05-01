/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Book from '../api/book/book.model';
import User from '../api/user/user.model';
import Genre from '../api/genre/genre.model';
import Request from '../api/request/request.model';
import BookRating from '../api/book/rating/book.rating.model';

(async function seed() {//eslint-disable-line no-extra-parens
     let users;//eslint-disable-line no-unused-vars
     let books;//eslint-disable-line no-unused-vars
     let genres;//eslint-disable-line no-unused-vars
     let requests;//eslint-disable-line no-unused-vars
     let ratings;//eslint-disable-line no-unused-vars

     if (_.get(config, 'seedDB.users')) {
          await User.find({}).remove();
          users = await User.create([{
               provider: 'local',
               firstName: 'Test',
               lastName: 'User',
               email: 'test@bookis.com',
               imageUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/maggie-lindemann-pretty-girl-1475155655.jpg?resize=768:*&crop=1xw:0.666564039408867xh;center,top',
               about: 'cool person',
               gender: 'female',
               password: 'test'
          }, {
               provider: 'local',
               firstName: 'Marco',
               lastName: 'Polo',
               email: 'marco@polo.com',
               imageUrl: '//upload.wikimedia.org/wikipedia/commons/thumb/5/54/Marco_Polo_portrait.jpg/250px-Marco_Polo_portrait.jpg',
               about: 'this man is awesome',
               gender: 'male',
               password: 'marco'
          }, {
               provider: 'local',
               firstName: 'Daniel',
               lastName: 'Subasic',
               email: 'daniel@suba.com',
               imageUrl: 'http://image.dnevnik.hr/media/images/768x432/Nov2015/61160609-danijel-subasic.jpg',
               about: 'Bad goalkeeper',
               gender: 'male',
               password: 'daniel'
          }, {
               provider: 'local',
               role: 'admin',
               firstName: 'Admin',
               lastName: 'Alison',
               about: 'admin guy',
               gender: 'male',
               email: 'admin@bookis.com',
               password: 'admin'
          }]);
     }

     if (_.get(config, 'seedDB.books')) {
          await Book.find({}).remove();
          books = await Book.create([{
               /*['new', 'refurbished', 'like new', 'very good', 'good', 'acceptable']*/
               user: users[0]._id,
               isbn: 'ISBN-1234',
               title: 'The Martian',
               author: 'Andy Weir',
               price: 199,
               imageUrl: 'http://images.randomhouse.com/cover/9781101905005',
               description: 'Book about mars',
               year: 1990,
               comment: 'this is a new book, best buy for sure',
               format: 'paperback',
               condition: 'new'
          }, {
               user: users[0]._id,
               isbn: 'ISBN-5678',
               title: 'Hunger games',
               author: 'Suzanne Collins',
               price: 1050,
               imageUrl: 'http://www.womenshealthmag.com/sites/womenshealthmag.com/files/styles/slideshow-desktop/public/images/hunger-games.jpg?itok=Ub6D_WKm',
               description: 'Book about hunger ppls',
               year: 1898,
               comment: 'this book is refurbished',
               format: 'hardcover',
               condition: 'refurbished'
          }, {
               user: users[0]._id,
               isbn: 'ISBN-765765',
               title: 'Game of the thrones',
               author: 'George R.R. Martin',
               price: 888,
               imageUrl: 'https://thoughtcatalog.files.wordpress.com/2013/10/agameofthronesnewhc.jpeg?w=409&h=624',
               description: 'Book about throne',
               year: 2005,
               comment: 'this book is awesome, you need to buy this',
               format: 'hardcover',
               condition: 'like new'
          }, {
               user: users[0]._id,
               isbn: 'ISBN-8765',
               title: 'The power or now',
               author: 'Eckhart Tolle',
               price: 999,
               imageUrl: 'https://s-media-cache-ak0.pinimg.com/736x/eb/f2/de/ebf2ded0a118ef85ec0f4a5f10f5991a.jpg',
               description: 'Book about moment',
               year: 1999,
               comment: 'this book is good, used a little',
               format: 'paperback',
               condition: 'very good'
          }, {
               user: users[0]._id,
               isbn: 'ISBN-gfh678',
               title: 'Harry Potter',
               author: 'Jennifer Atison',
               price: 249,
               imageUrl: 'http://www.thealmightyguru.com/Reviews/HarryPotter/Images/Cover-GobletOfFire.jpg',
               description: 'Book about potter',
               year: 1985,
               comment: 'this book is old but it can be used',
               format: 'hardcover',
               condition: 'acceptable'
          }, {
               user: users[0]._id,
               isbn: 'ISBN-00987f',
               title: 'War and peace',
               author: 'Leo Tolstoy',
               price: 300,
               imageUrl: 'http://i.dailymail.co.uk/i/pix/2012/06/07/article-0-0B5D70DF000005DC-261_306x423.jpg',
               description: 'War and peace desc',
               year: 1995,
               comment: 'this book is good read, and its in solid condition',
               format: 'hardcover',
               condition: 'good'
          }, {
               user: users[0]._id,
               isbn: 'ISBN-67ht89',
               title: 'Lord of the rings',
               author: 'J R R Tolkien',
               price: 450,
               imageUrl: 'http://top101news.com/wp-content/uploads/2015/04/Lord-of-The-Rings-most-popular-books-of-all-time-e1430371742802.jpg',
               description: 'One ring to rule em all',
               year: 1992,
               comment: 'this book is classic, you really dont want miss this chance',
               format: 'hardcover',
               condition: 'good'
          }, {
               user: users[0]._id,
               isbn: 'ISBN-9875',
               title: 'The girl on the train',
               author: 'Tess Germinstone',
               price: 750,
               imageUrl: 'http://www.clermontlibrary.org/wp-content/uploads/2015/12/girl.jpg',
               description: 'Epic thriller book',
               year: 2010,
               comment: 'this book is just new, never opened',
               format: 'hardcover',
               condition: 'new'
          }, {
               user: users[0]._id,
               isbn: 'ISBN-876fdf',
               title: 'The Da Vinci code',
               author: 'Dan brown',
               price: 624,
               imageUrl: 'http://vignette1.wikia.nocookie.net/davincicode/images/0/0f/Da_Vinci_Code_poster.jpg/revision/latest?cb=20150623194856',
               description: 'Saga about some code',
               year: 2015,
               comment: 'I want to sell this new book. hurry',
               format: 'hardcover',
               condition: 'new'
          }, {
               user: users[0]._id,
               isbn: 'ISBN-dd56gu',
               title: 'Divergent',
               author: 'Veronica Roth',
               price: 99,
               imageUrl: 'https://s-media-cache-ak0.pinimg.com/736x/22/82/c9/2282c923139e37cbb891966dc0503b5c.jpg',
               description: 'Nothing to se about this antic book',
               year: 1911,
               comment: 'really old book, my gran grand grand pa used to love it',
               format: 'hardcover',
               condition: 'acceptable'
          }, {
               user: users[1]._id,
               isbn: 'ISBN-dd56gu',
               title: 'Admin Book',
               author: 'Mr. Admin',
               price: 1999,
               imageUrl: 'https://www.gadgetdaily.xyz/wp-content/uploads/2010/01/LINUX-sys-admin-book.jpg',
               description: 'All you need to know about being admin',
               year: 2016,
               comment: 'Awesome admin book',
               format: 'hardcover',
               condition: 'new'
          }, {
               user: users[2]._id,
               isbn: 'ISBN-dd565u',
               title: 'The travels of Marco Polo',
               author: 'Some guy',
               price: 1378,
               imageUrl: 'http://prodimage.images-bn.com/pimages/2940013060654_p0_v1_s1200x630.jpg',
               description: 'Book about marco polo and his ship',
               year: 2011,
               comment: 'Awesome polo book',
               format: 'hardcover',
               condition: 'new'
          }]);
     }

     if (_.get(config, 'seedDB.requests')) {
          await Request.find({}).remove();
          requests = await Request.create([{
               book: books[0],
               user: users[1],
               seller: users[0],
               seen: {user: new Date()},
               status: 'pending',
               message: 'deliver asap',
               delivery: 'shipping'
          }, {
               book: books[1],
               user: users[1],
               seller: users[0],
               status: 'pending',
               delivery: 'shipping'
          }, {
               book: books[0],
               user: users[2],
               seller: users[0],
               status: 'waiting',
               seen: {user: new Date()},
               delivery: 'shipping'
          }, {
               book: books[0],
               user: users[2],
               seller: users[0],
               status: 'waiting',
               delivery: 'shipping'
          }, {
               book: books[10],
               user: users[0],
               seller: users[1],
               status: 'pending',
               message: 'Your admin book is awesome wannt have it',
               delivery: 'shipping'
          }]);
     }

     if (_.get(config, 'seedDB.ratings')) {
          await BookRating.find({}).remove();
          ratings = await BookRating.create([{
               book: books[0],
               user: users[0],
               rate: 4
          }, {
               book: books[0],
               user: users[1],
               rate: 5
          }, {
               book: books[0],
               user: users[2],
               rate: 5
          }, {
               book: books[0],
               user: users[3],
               rate: 1
          }]);
     }

     if (_.get(config, 'seedDB.genres')) {
          await Genre.find({}).remove();
          genres = await Genre.create({
               name: 'Thriller',
               imageUrl: 'http://www.harlequin.com/media/images/books/0607-9-7807783-2456-0-bigw.jpg'
          }, {
               name: 'Sci-Fi',
               imageUrl: 'https://cdn.pastemagazine.com/www/articles/2016/09/13/best-sci-fi-tv-shows-netflix.jpg'
          }, {
               name: 'Fantasy',
               imageUrl: 'http://az616578.vo.msecnd.net/files/2016/04/24/635971370973079270-332192683_Magic-Book.jpg'
          }, {
               name: 'Horror',
               imageUrl: 'http://restitutio.org/wp-content/uploads/2016/10/horror.jpg'
          }, {
               name: 'Comedy',
               imageUrl: 'https://s-media-cache-ak0.pinimg.com/originals/f5/0d/89/f50d89d9cb54ce045441d7a6880d6375.jpg'
          }, {
               name: 'Action',
               imageUrl: 'https://www.nyfa.edu/student-resources/wp-content/uploads/2015/03/action-movie.jpg'
          }, {
               name: 'Biography',
               imageUrl: 'http://static2.businessinsider.com/image/4ea4a2276bb3f7c874000008-506-253/the-steve-jobs-biography-is-the-best-selling-book-of-the-year-for-amazon.jpg'
          });
     }

}());//eslint-disable-line padded-blocks
