'use strict';

import sinon from 'sinon';
import {genS3Path as gen, genLink} from './s3';
const stubs = {
     uploadImageStub: sinon.stub(),
     genS3PathStub: sinon.stub(),
     listImagesStub: sinon.stub()
};

const resetStubs = () => {
     stubs.uploadImageStub.reset();
     stubs.listImagesStub.reset();
};

const genS3Path = (role, userId, advertId = '', type, ext) => {
     const result = gen(role, userId, advertId, type, ext);
     stubs.genS3PathStub.returns(result)(role, userId, advertId, type, ext);
     return result;
};

async function uploadImage(localPath, key) {//eslint-disable-line require-yield
     stubs.uploadImageStub.returns({s3Link: genLink(key)})(localPath, key);
     return {s3Link: genLink(key)};
}

async function listImages() {//eslint-disable-line require-yield
     return stubs.listImagesStub.returns({images: ['1', '2']});
}

export {
     stubs,
     resetStubs,
     uploadImage,
     genS3Path,
     listImages
};
