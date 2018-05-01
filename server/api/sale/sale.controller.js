'use strict';

import Sale from './sale.model';

export async function index(req, res) {
     const sales = await Sale.find({seller: req.user._id}).limit(100).lean();
     res.status(200).json(sales);
}

export async function show(req, res) {
     const sale = await Sale.findById(req.params.id)
          .populate({path: 'seller', select: '-salt -password -phone -notifications'})
          .populate({path: 'book', populate: {path: 'author', select: 'firstName lastName corporateName', model: 'Author'}}).lean();
     if (!sale) throw {code: 404, message: 'Sales not found'};
     res.status(200).json(sale);
}

export async function create(req, res) {
     const sale = {
          book: req.body.book,
          seller: req.user._id,
          price: req.body.price,
          condition: req.body.condition,
          format: req.body.format,
          delivery: req.user.delivery.shipping.enabled && req.user.delivery.meetup.enabled ? 'both' : req.user.delivery.shipping.enabled ? 'shipping' : 'meetup',
          comment: req.body.comment
     };
     const newSale = await new Sale(sale).save();
     await Sale.populate(newSale, {path: 'book', populate: {path: 'author', select: 'firstName lastName corporateName', model: 'Author'}});
     res.status(201).json(newSale);
}

export async function update(req, res) {
     const sale = await Sale.findById(req.params.id);
     if (sale.status !== 'available') throw {status: 403, message: 'Cannot update requested sale.'};
     _.extend(sale, req.body);
     await sale.save();
     await Sale.populate(sale, {path: 'book'});
     res.status(200).json(sale);
}

export async function remove(req, res) {
     const sale = await Sale.findById(req.params.id);
     if (!sale) throw {status: 404, message: 'Not found.'};
     sale.status = 'deleted';
     await sale.save();
     res.status(204).end();
}

export async function getSalesWithBookId(req, res) {
    const bookId = req.query.bookId;
    if (!bookId) throw {status: 404, message: 'Book ID is not defined as a param.'};
    const sales = await Sale.find({book : bookId, status : 'available', condition : 'new'}).populate({path: 'seller', select: 'businessName imageUrl address'})
                                                                        // .populate({path: 'book', select: "delivery format condition price status", model: 'Book'}).lean();
     if (!sales.length) throw {status: 404, message: 'Not found'};
    res.status(200).json(sales);
}
