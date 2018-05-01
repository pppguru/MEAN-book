'use strict';

import WaitingList from './waitinglist.model';

export async function create(req, res) {
     const exist = await WaitingList.findOne({user: req.user._id, book: req.body.book}).lean();
     if (exist) return res.status(200).json(exist);
     const waitingList = await new WaitingList(req.body).save();
     res.status(201).json(waitingList);
}
