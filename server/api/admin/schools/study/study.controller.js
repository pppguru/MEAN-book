'use strict';

import Study from '../../../school/study/study.model';

export async function index(req, res) {
     const studies = await Study.find({school: req.params.id}).lean();
     res.status(200).json(studies);
}

export async function create(req, res) {
     req.body.school = req.params.id;
     const newStudy = await new Study(req.body).save();
     res.status(201).json(newStudy);
}

export async function edit(req, res) {
     const study = await Study.findById(req.params.studyId);
     if (!study) throw {code: 404, message: 'Resource not found'};
     const updated = _.extend(study, req.body);
     res.status(200).json(await updated.save());
}

export async function remove(req, res) {
     await Study.findByIdAndRemove(req.params.studyId);
     res.status(204).end();
}
