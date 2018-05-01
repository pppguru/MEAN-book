'use strict';

export function SaleResource($resource) {
     'ngInject';

     return $resource('/api/sales/:id/:controller', {
          id: '@_id'
     }, {
          editSale: {
               method: 'PUT'
          },
          removeSale: {
               method: 'PATCH',
               params: {
                    controller: 'remove'
               }
          },
          getSalesWithBook: {
              method: 'GET',
              isArray:true,
              params: {
                  controller: 'salesbybook'
              }
          }
     });
}
