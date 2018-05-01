'use strict';

import graph from 'fbgraph';

function getMyProfile(access_token) {//eslint-disable-line camelcase
     let fields = 'permissions, first_name, last_name, about, email, birthday, gender, books, location, likes{picture,name,id,category}, picture.width(1080), relationship_status, hometown, work, education, music';//eslint-disable-line max-len
     return new Promise((resolve, reject) => {
          graph.get('me', {fields, access_token}, (err, res) => {//eslint-disable-line camelcase
               if (err) return reject(err);
               resolve(res);
          });
     });
}

export {
     getMyProfile
};
