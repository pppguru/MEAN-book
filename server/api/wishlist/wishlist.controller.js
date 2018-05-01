/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/wishlists              ->  index
 * POST    /api/wishlists              ->  create
 * GET     /api/wishlists/:id          ->  show
 * PUT     /api/wishlists/:id          ->  upsert
 * PATCH   /api/wishlists/:id          ->  patch
 * DELETE  /api/wishlists/:id          ->  destroy
 */

'use strict';

import WishList from './wishlist.model';

export async function index(req, res) {
     const wishLists = await WishList.find().lean();
     res.status(200).json(wishLists);
}

export async function create(req, res) {
     const exist = await WishList.findOne({user: req.user._id, book: req.body.book}).lean();
     if (exist) return res.status(200).json(exist);
     const wishList = await new WishList(req.body).save();
     res.status(201).json(wishList);
}

export async function update(req, res) {
     const wishList = await WishList.findById(req.params.id);
     if (!wishList) throw {status: 404, message: 'WishList not found'};
     _.extend(wishList, req.body);
     await wishList.save();
     res.status(200).json(wishList);
}
