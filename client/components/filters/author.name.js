'use strict';

export function author() {
     'ngInject';
     return authorFilter;

     function authorFilter(author, onlyFirst) {
          if (!author) return 'Unknown';
          return author.corporateName || (onlyFirst ? author.firstName : `${author.firstName} ${author.lastName}`);
     }
}
