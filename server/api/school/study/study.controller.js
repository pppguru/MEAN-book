'use strict';

import Study from './study.model';

export async function index(req, res) {
     const studies = await Study.find({school: req.params.id}).lean();
     res.status(200).json(studies);
}
