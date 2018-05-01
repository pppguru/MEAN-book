'use strict';

import emitter from '../../../components/events';
const {events} = config;

export function isNew(next) {
     this._isNew = this.isNew;
     next();
}

export function emit(rev) {
     if (rev._isNew) {
          emitter.emit(events.REVIEW_CREATED, rev);
     }
}

export function remove(rev) {
     emitter.emit(events.REVIEW_DELETED, rev);
}
