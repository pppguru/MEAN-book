'use strict';

import Course from './course.model';

export async function index(req, res) {
     const courses = await Course.find({school: req.params.id, study: req.params.studyId, semester: req.query.semester}).lean();
     res.status(200).json(courses);
}
