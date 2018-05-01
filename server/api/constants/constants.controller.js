'use strict';

import Constant from './constants.model';

export async function index(req, res) {
     const constant = await Constant.findOne().lean();
     res.status(200).json(constant.fees);
}
