'use strict';

export function BookService(BookAPI, toast, Util, Upload, $q) {
     'ngInject';
     const data = {
          books: [],
          suggested: [],
          recommended: [],
          kidsRecommended: [],
          kidsPopular: [],
          newThisWeek: [],
          studentBooks: []
     };
     let books = [];
     return {
          getData: type => data[type],
          getBooks,
          getISBN,
          getRecommended,
          getKidsRecommended,
          getKidsPopular,
          getSuggested,
          getBook,
          createBook,
          bulkBookImport,
          bulkBookValidate,
          editBook,
          removeBook,
          autocomplete,
          getStudentBooks
     };

     function getBooks() {
          return BookAPI.query().$promise
               .then(b => {
                    Util.bindArray(books, b);
                    return books;
               })
               .catch(err => console.log(err));
     }
     
     function getISBN({book, format}) {
          return BookAPI.getISBN(_.extend({id: book._id, format}, _.pick(book, ['title', 'year']))).$promise
               .then(isbn => isbn)
               .catch(err => console.log(err));
     }

     function getKidsRecommended() {
          return BookAPI.kidsRecommended().$promise
               .then(kidsRecommended => {
                    Util.bindArray(data.kidsRecommended, kidsRecommended);
                    return data.kidsRecommended;
               })
               .catch(err => console.log(err));
     }

     function getKidsPopular() {
          return BookAPI.kidsPopular().$promise
               .then(kidsPopular => {
                    Util.bindArray(data.kidsPopular, kidsPopular);
                    return data.kidsPopular;
               })
               .catch(err => console.log(err));
     }

     function getRecommended() {
          data.newThisWeek.splice(0);
          data.recommended.splice(0);
          return BookAPI.getRecommended().$promise
               .then(({recommended, newThisWeek}) => {
                    data.newThisWeek.push(...newThisWeek);
                    data.recommended.push(...recommended);
               })
               .catch(err => console.log(err));
     }

     function getSuggested({book, query = {}}) {
          _.some(['genre', 'form', 'subject', 'litterary'], el => {
               if (!_.isEmpty(book[el])) {
                    query[el] = el === 'genre' ? book[el][0]._id : book[el][0];
               }
               return !_.isEmpty(query) ? query : false;
          });
          return BookAPI.getSuggested(_.extend(query, {id: book._id})).$promise
               .then(s => {
                    Util.bindArray(data.suggested, s);
                    return s;
               })
               .catch(err => console.log(err));
     }

     function getBook(id) {
          return BookAPI.get({id}).$promise
               .then(book => book)
               .catch(err => console.log(err));
     }

     function createBook(book, collection = data.books) {
          const newBook = new BookAPI(book);
          return newBook.$save()
               .then(b => {
                    collection.unshift(b);
                    toast.simple('Book Added for sale!');
                    return b;
               })
               .catch(err => console.log(err));
     }

     function bulkBookImport({file, valid}) {
          return Upload.upload({url: 'api/books/bulk', data: {file, valid}})
               .then(res => res.data, err => console.log('err: ', err));
     }

     function bulkBookValidate(file) {
          return Upload.upload({url: 'api/books/bulk/validate', data: {file}})
               .then(res => res.data, err => console.log('err: ', err));
     }

     function editBook(book, collection = data.books) {
          let index = _.findIndex(collection, {_id: book._id});
          return BookAPI.editBook(book).$promise
               .then(b => {
                    collection[index] = b;
                    toast.simple('Book updated!');
                    return b;
               })
               .catch(err => console.log(err));
     }

     function removeBook(book, collection = data.books) {
          let index = _.findIndex(collection, {_id: book._id});
          if (!(book instanceof BookAPI)) book = new BookAPI(book);
          return book.$remove()
               .then(r => {
                    if (collection[index]) collection[index].active = false;
                    toast.simple('Book deleted!');
                    return r;
               })
               .catch(err => console.log(err));
     }

     function getStudentBooks(picked) {
          if (!_.size(picked)) {
               data.studentBooks.splice(0);
               return $q.when([]);
          }
          return BookAPI.getStudentBooks(picked).$promise
               .then(b => {
                    Util.bindArray(data.studentBooks, b);
                    return data.studentBooks;
               })
               .catch(err => console.log(err));
     }

     function autocomplete(isbnObj) {
          return BookAPI.autocomplete(isbnObj).$promise.then(book => book);
     }
}
