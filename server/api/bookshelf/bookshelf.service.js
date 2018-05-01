'use strict';

import Bookshelf from './bookshelf.model';
import User from '../user/user.model';

export async function getBookshelfOwnerId({paramId}) {
     return _.get((await Bookshelf.findById(paramId, 'user').lean()), 'user');
}

export async function syncUserNumeric(doc) {
     const user = await User.findById(doc.user);
     user.numeric.bookshelf = await Bookshelf.find({user: doc.user, active: true}).count();
     user.save();
}
