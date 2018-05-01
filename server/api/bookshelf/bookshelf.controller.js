/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/bookshelf              ->  index
 * POST    /api/bookshelf              ->  create
 * GET     /api/bookshelf/:id          ->  show
 * PUT     /api/bookshelf/:id          ->  upsert
 * PATCH   /api/bookshelf/:id          ->  patch
 * DELETE  /api/bookshelf/:id          ->  destroy
 */

'use strict';

import Bookshelf from './bookshelf.model';

export async function index(req, res) {
     const bookshelf = await Bookshelf.find().lean();
     res.status(200).json(bookshelf);
}

export async function create(req, res) {
     const exist = await Bookshelf.findOne({user: req.user._id, book: req.body.book}).lean();
     if (exist) return res.status(200).json(exist);
     const bookshelf = await new Bookshelf(req.body).save();
     await Bookshelf.populate(bookshelf, {path: 'book'});
     res.status(201).json(bookshelf);
}

export async function update(req, res) {
     const bookshelf = await Bookshelf.findById(req.params.id);
     if (!bookshelf) throw {status: 404, message: 'Bookshelf not found'};
     _.extend(bookshelf, req.body);
     await bookshelf.save();
     res.status(200).json(bookshelf);
}
