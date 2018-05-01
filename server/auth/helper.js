'use strict';

import request from 'request';
import fs from 'fs';
import path from 'path';
import {uploadImage, genS3Path} from '../components/s3';

export async function attachS3Link(user, provider) {
     const dest = path.join(__dirname, '/../..', `uploads/${user._id}`);
     await downloadImage(user.imageUrl, dest);
     const s3Path = genS3Path(user.role, user._id, `${provider}-profile-image${+new Date()}`);
     return uploadImage(dest, s3Path);
}

export function downloadImage(url, dest) {
     return new Promise((resolve, reject) => {
          request.head(url, err => {
               if (err) return reject();
               request(url).pipe(fs.createWriteStream(dest))
                    .on('close', () => resolve());
          });
     });
}
