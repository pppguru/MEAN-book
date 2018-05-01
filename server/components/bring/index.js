'use strict';

import rp from 'request-promise';

async function getShippingMethods(userZip, sellerZip, mesures) {
     try {
          const qs = {
               clientUrl: 'https://bookis.com',
               weightInGrams: +mesures.weight || 350, //Weight of package in grams
               width: +mesures.width ? +mesures.width / 100 : 2,
               length: +mesures.thickness ? +mesures.thickness / 100 : 15,
               height: +mesures.height ? +mesures.height / 100 : 10,
               from: '0484', //sellerZip
               to: '5600', //userZip
               product: ['servicepakke', 'bpakke_dor-dor', 'ekspress09', 'pa_doren', 'a-post', 'b-post']
          };
          console.log('Qs :', qs);
          const response = await rp({uri: 'https://api.bring.com/shippingguide/products/all.json', qs});
          return _.get(JSON.parse(response), 'Product');
     } catch (err) {
          console.log('Bring Err :', err);
     }
}

export {
     getShippingMethods
};
