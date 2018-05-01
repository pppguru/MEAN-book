'use strict';
// @flow

export default class StudentController {
     selected;
     schools;
     semesters;
     range;
     studyService;
     bookService;
     wishlistService;
     userService;
     books;
     picked;
     Modal;
     me;
     /*@ngInject*/
     constructor(studyService, schoolService, bookService, userService, Modal, Auth, wishlistService) {
          schoolService.getSchools();
          this.me = Auth.getCurrentUserSync;//eslint-disable-line no-sync
          this.picked = {};
          this.Modal = Modal;
          this.schools = schoolService.getData();
          this.studies = studyService.getData();
          this.studyService = studyService;
          this.bookService = bookService;
          this.userService = userService;
          this.wishlistService = wishlistService;
          this.books = bookService.getData('studentBooks');
          this.wishlist = userService.getWishList('all');
          this.range = _.range;
          this.selected = {
               conditions: [],
               formats: [],
               rate: {
                    min: 1,
                    max: 5
               },
               delivery: ['shipping', 'meetup'],
               buying: []
          };
          this.search();
     }

     getStudies(name, selectedSchool) {
          this.picked.school = selectedSchool._id;
          this.studyService.getStudies(this.picked.school);
     }

     getSemesters(name, selectedStudy) {
          this.picked.study = selectedStudy._id;
          this.semesters = selectedStudy.semesters ? _.range(1, selectedStudy.semesters + 1) : [];
     }

     getCourses(name, selectedClass) {
          this.picked.semester = selectedClass;
     }

     toggleAll() {
          const hadSelected = !this.hasSelectedBooks();
          _.each(this.books, book => {
               book.selected = hadSelected;
          });
     }

     hasSelectedBooks() {
          return _.some(this.books, 'selected');
     }

     sum() {
          return _.sumBy(_.filter(this.books, 'selected'), 'price.amount');
     }

     search() {
          this.bookService.getStudentBooks(this.picked);
     }

     addToWishList({book}) {
          const wasLoggedIn = !!this.me()._id;
          const promise = wasLoggedIn ? Promise.resolve() : this.Modal.login();
          promise
               .then(() => wasLoggedIn ? Promise.resolve() : this.userService.getUserWishList(this.me()))
               .then(() => Promise[this.inWishlist(book._id) ? 'reject' : 'resolve']('Wishlisted'))
               .then(() => this.wishlistService.createWishList(book))
               .then(wl => this.wishlist.push({book: {_id: book._id}}))
               .catch(err => console.log(err));
     }

     inWishlist(id) {
          return _.includes(_.map(this.wishlist, 'book._id'), id);
     }

}
