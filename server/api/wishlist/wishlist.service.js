'use strict';

import Wishlist from './wishlist.model';
import User from '../user/user.model';

export async function getWishlistOwnerId({paramId}) {
     return _.get((await Wishlist.findById(paramId, 'user').lean()), 'user');
}

export async function syncUserNumeric(doc) {
     const user = await User.findById(doc.user);
     user.numeric.wishlist = await Wishlist.find({user: doc.user, active: true}).count();
     user.save();
}
