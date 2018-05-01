'use strict';

export function SaleService(SaleAPI, toast, $q) {
     'ngInject';
     return {
          getSale,
          getSaleWithBookID,
          createSale,
          editSale,
          removeSale
     };

     function getSale(id) {
          if (!id) return $q.when({});
          return SaleAPI.get({id}).$promise
               .then(sale => sale)
               .catch(err => console.log(err));
     }

     function getSaleWithBookID(bookId) {
          if (!bookId) return $q.when({});
          return SaleAPI.getSalesWithBook({bookId}).$promise
                .then(b => {
                    let sales = [];
                    sales.push(...b);
                    return sales;
                })
                .catch(err => console.log(err));
     }

     function createSale(sale) {
          const newSale = new SaleAPI(sale);
          return newSale.$save()
               .then(s => {
                    toast.simple('Book added for sale!');
                    return s;
               })
               .catch(err => {
                    console.log('Err :', err);
                    toast.error('Error while adding book for sale!');
               });
     }

     function editSale(sale) {
          return SaleAPI.editSale(sale).$promise
               .then(s => {
                    toast.simple('Sale updated!');
                    return s;
               })
               .catch(err => console.log(err));
     }

     function removeSale(sale) {
          return SaleAPI.removeSale(sale).$promise
               .then(s => {
                    toast.simple('Sale removed!');
                    return s;
               })
               .catch(err => console.log(err));
     }
}
