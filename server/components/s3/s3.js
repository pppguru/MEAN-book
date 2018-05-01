'use strict';

import s3 from 's3';
import fs from 'fs';
import StreamingS3 from 'streaming-s3';
import request from 'request';

const {s3: {bucket: BUCKET, region, accessKeyId, secretAccessKey, ACL}} = config;
const streamOptions = {
     concurrentParts: 5,
     waitTime: 25000,
     retries: 5,
     maxPartSize: 50 * 1024 * 1024
};

const client = s3.createClient({
     maxAsyncS3: 20,
     s3RetryCount: 3,
     s3RetryDelay: 1000,
     multipartUploadThreshold: 20971520, // (20 MB)
     multipartUploadSize: 15728640, // (15 MB)
     s3Options: {accessKeyId, secretAccessKey, region}
});

const genS3Path = (role, userId, name) => `${role}s/${userId}/${name}.png`;
const genLink = key => `//${client.s3.endpoint.hostname}/${BUCKET}/${key}`;

const upload = (params, localFile) => new Promise((resolve, reject) => {
     const uploader = client.uploadFile(params);
     uploader.on('error', err => reject(err));
     uploader.on('end', () => {
          fs.unlink(localFile, err => {
               if (err) {
                    console.log('Err :', err);
               }
          });
          resolve(genLink(params.s3Params.Key));
     });
});

function streamToS3(url, Key, Bucket = BUCKET) {
     return new Promise((resolve, reject) => {
          const streamer = new StreamingS3(request.get(url), {accessKeyId, secretAccessKey, region}, {Bucket, Key, ACL, ContentType: 'image/png'}, streamOptions);
          streamer.begin();
          streamer.on('finished', () => resolve(genLink(Key)));
          streamer.on('error', err => {
               console.log('Err :', Key, err);
               reject(err);
          });
     });
}

async function uploadImage(localFile, Key, Bucket = BUCKET) {
     const params = {localFile, s3Params: {ContentType: 'image/png', Bucket, Key, ACL}};
     return await upload(params, localFile);
}

const listObjects = params => new Promise((resolve, reject) => {
     const listObject = client.listObjects(params);
     listObject.on('error', err => reject(err));
     listObject.on('end', data => resolve(data));
});

async function listImages(Prefix) {
     const params = {s3Params: {Bucket: BUCKET, Prefix}};
     return await listObjects(params);
}

export {
     uploadImage,
     genLink,
     listImages,
     genS3Path,
     streamToS3
};
