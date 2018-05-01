'use strict';

import Constant from '../../constants/constants.model';

export async function index(req, res) {
     const constant = await Constant.findOne().lean();
     res.status(200).json(constant);
}

export async function update(req, res) {
     const constant = await Constant.findOne();
     if (!constant) throw {code: 404, message: 'Resource not found'};
     const updated = _.extend(constant, req.body);
     res.status(200).json(await updated.save());
}
