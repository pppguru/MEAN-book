'use strict';

import Course from '../../../../school/study/course/course.model';

export async function index(req, res) {
     const courses = await Course.find({school: req.params.id, study: req.params.studyId, semester: req.query.semester}).lean();
     res.status(200).json(courses);
}

export async function create(req, res) {
     req.body.school = req.params.id;
     req.body.study = req.params.studyId;
     const newCourse = await new Course(req.body).save();
     res.status(201).json(newCourse);
}

export async function edit(req, res) {
     const course = await Course.findById(req.params.courseId);
     if (!course) throw {code: 404, message: 'Resource not found'};
     const updated = _.extend(course, req.body);
     res.status(200).json(await updated.save());
}

export async function remove(req, res) {
     await Course.findByIdAndRemove(req.params.courseId);
     res.status(204).end();
}
