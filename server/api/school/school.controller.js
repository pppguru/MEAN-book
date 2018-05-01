'use strict';

import School from './school.model';

export async function index(req, res) {
     const schools = await School.find().lean();
     res.status(200).json(schools);
}
