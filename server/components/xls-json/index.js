'use strict';

import convert from 'xls-to-json';

const xlsToJson = (input, output = null, sheet = 'Sheet1') => new Promise((resolve, reject) => {
     convert({input, output}, (err, json) => {
          if (err) return reject('Something went wrong');
          return resolve(json);
     });
});

export {
     xlsToJson
};
