'use strict';

import emitter from '../../../components/events';
const {events} = config;

export function setNewState(next) {
     this._isNew = this.isNew;
     next();
}

export function incrementReviewReplyCount(doc) {
     if (doc._isNew) {
          emitter.emit(events.REPLY_CREATED, doc);
     }
}

export function decrementReviewReplyCount(doc) {
     emitter.emit(events.REPLY_DELETED, doc);
}
