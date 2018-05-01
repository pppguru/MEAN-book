'use strict';

import Genre from '../../genre/genre.model';

export async function index(req, res) {
     const genres = await Genre.find().lean();
     res.status(200).json(genres);
}

export async function update(req, res) {
     const genre = await Genre.findById(req.params.id);
     if (!genre) throw {code: 404, message: 'Resource not found'};
     const updated = _.extend(genre, req.body);
     res.status(200).json(await updated.save());
}
