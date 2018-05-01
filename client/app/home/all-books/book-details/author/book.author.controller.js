'use strict';
// @flow

export default class BookAuthorController {
     books;
     author;
     /*@ngInject*/
     constructor(author, authorService) {
          this.author = author;
          authorService.getAuthorBooks({author}).then(books => {
               this.books = books;
          });
     }
}
