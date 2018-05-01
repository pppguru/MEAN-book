/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/requests              ->  index
 * POST    /api/requests              ->  create
 * GET     /api/requests/:id          ->  show
 * PUT     /api/requests/:id          ->  upsert
 * PATCH   /api/requests/:id          ->  patch
 * DELETE  /api/requests/:id          ->  destroy
 */

'use strict';

import Request from './request.model';
import {initializeTransaction} from './request.service';
import {getShippingMethods} from '../../components/bring';

// export async function index(req, res) {
//      const requests = await Request.find({}, '-transaction').populate('book').populate({path: 'user', select: 'firstName lastName businessName'}).lean();
//      res.status(200).json(requests);
// }

export async function getMethods(req, res) {
     const userZip = _.get(req, 'user.address.zip');
     const sellerZip = _.get(req, 'query.zip');
     const measures = _.pick(req.query, ['height', 'weight', 'thickness', 'width']);
     const data = await getShippingMethods(userZip, sellerZip, measures);
     res.status(200).json(data);
}

// export async function show(req, res) {
//      const request = await Request.findById(req.params.id, '-transaction').lean();
//      if (!request) throw {code: 404, message: 'Request not found'};
//      res.status(200).json(request);
// }

export async function create(req, res) {
     const requested = await Request.findOne({user: req.user._id, sale: req.body.sale, status: {$in: ['pending', 'waiting']}}).lean();
     if (requested) throw {code: 403, message: 'Book already requested'};
     req.body.user = req.user;
     req.body.transaction = await initializeTransaction(req.body);
     const request = await new Request(req.body).save();
     const populatedRequest = await Request.findById(request._id, '-transaction')
          .populate('sale')
          .populate('user', 'firstName lastName businessName imageUrl')
          .populate('seller', 'firstName lastName businessName imageUrl').lean();
     res.status(200).json(populatedRequest);
}

export async function approve(req, res) {
     const request = await Request.findById(req.params.id, '-transaction');
     if (!request) throw {code: 404, message: 'Request not found'};
     request.status = 'waiting';
     request.timestamps.approved = new Date();
     request.seen = {};
     await request.save();
     res.status(200).json(request);
}
export async function decline(req, res) {
     const request = await Request.findById(req.params.id, '-transaction');
     if (!request) throw {code: 404, message: 'Request not found'};
     request.status = 'declined';
     request.timestamps.declined = new Date();
     request.reason = req.body.reason;
     await request.save();
     res.status(200).json(request);
}
export async function deliver(req, res) {
     const request = await Request.findById(req.params.id, '-transaction');
     if (!request) throw {code: 404, message: 'Request not found'};
     request.status = 'delivered';
     request.timestamps.delivered = new Date();
     request.seen = {};
     await request.save();
     res.status(200).json(request);
}
export async function cancel(req, res) {
     const request = await Request.findById(req.params.id, '-transaction');
     if (!request) throw {code: 404, message: 'Request not found'};
     request.status = 'canceled';
     request.timestamps.canceled = new Date();
     request.reason = req.body.reason;
     await request.save();
     res.status(200).json(request);
}

// export async function destroy(req, res) {
//      let request = await Request.findById(req.params.id);
//      if (!request) throw {code: 404, message: 'Request not found'};
//      request.active = false;
//      await request.save();
//      res.status(204).end();
// }

export async function markAsSeen(req, res) {
     const field = `seen.${req.params.type}`;
     const update = {};
     update[field] = new Date();
     await Request.updateMany({_id: {$in: req.body.unseenArray}}, update);
     res.status(200).end();
}
