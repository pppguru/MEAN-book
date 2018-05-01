'use strict';

import * as s3 from './s3';
import * as s3Mock from './s3.mock';

const instance = config.env === 'test' ? s3Mock : s3;

const uploadImage = instance.uploadImage;
const listImages = instance.listImages;
const genS3Path = instance.genS3Path;
const streamToS3 = instance.streamToS3;

export {
     uploadImage,
     listImages,
     genS3Path,
     streamToS3
};
