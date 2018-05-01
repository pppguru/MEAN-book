'use strict';

import WaitingList from '../../waitinglist/waitinglist.model';

export async function getWaitinglist(req, res) {
     const waitingList = await WaitingList.find().populate('user').populate('book').lean();
     res.status(201).json(waitingList);
}
