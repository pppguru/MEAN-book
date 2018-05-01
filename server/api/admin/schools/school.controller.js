'use strict';

import School from '../../school/school.model';

export async function index(req, res) {
     const schools = await School.find().lean();
     res.status(200).json(schools);
}

export async function create(req, res) {
     const newSchool = await new School(req.body).save();
     res.status(201).json(newSchool);
}

export async function edit(req, res) {
     const school = await School.findById(req.params.id);
     if (!school) throw {code: 404, message: 'Resource not found'};
     const updated = _.extend(school, req.body);
     res.status(200).json(await updated.save());
}

export async function remove(req, res) {
     await School.findByIdAndRemove(req.params.id);
     res.status(204).end();
}
