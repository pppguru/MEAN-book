/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/genres              ->  index
 * POST    /api/genres              ->  create
 * GET     /api/genres/:id          ->  show
 * PUT     /api/genres/:id          ->  upsert
 * PATCH   /api/genres/:id          ->  patch
 * DELETE  /api/genres/:id          ->  destroy
 */

'use strict';

import Genre from './genre.model';

export async function index(req, res) {
     const genres = await Genre.find().lean();
     res.status(200).json(genres);
}

export async function getMainGenres(req, res) {
     console.log('here api call');
     const genres = await Genre.find({main : true}).lean();
     res.status(200).json(genres);
}
