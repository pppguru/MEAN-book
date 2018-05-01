'use strict';

import Author from './author.model';
import Book from '../book/book.model';
import User from '../user/user.model';

export async function index(req, res) {
     const authors = await Author.find().lean();
     res.status(200).json(authors);
}

export async function show(req, res) {
     const author = await Author.findById(req.params.id).populate('followers', 'firstName lastName businessName numeric imageUrl address').lean();
     res.status(200).json(author);
}

export async function authorBooks(req, res) {
     const books = await Book.find({author: req.params.id}).populate('author')
          .populate({path: 'sales', match: {status: 'available'}, options: {sort: {price: 1}}, populate: {path: 'seller', model: 'User', select: 'firstName lastName businessName imageUrl address'}}).lean();
     res.status(200).json(books);
}

export async function toggleFollowing(req, res) {
     const author = await Author.findById(req.params.id);
     const index = _.indexOf(_.map(author.followers, String), req.user._id.toString());
     const userIndex = _.indexOf(_.map(req.user.followingAuthors, String), author._id.toString());
     if (index === -1) {
          author.followers.push(req.user._id);
     } else {
          author.followers.splice(index, 1);
     }
     if (userIndex === -1) {
          req.user.followingAuthors.push(author._id);
     } else {
          req.user.followingAuthors.splice(userIndex, 1);
     }
     req.user.numeric.followingAuthors = req.user.numeric.followingAuthors.length;
     author.numeric.followers = author.followers.length;
     await author.save();
     await req.user.save();
     await User.populate(req.user, {path: 'followingAuthors', select: 'firstName lastName corporateName numeric'});
     res.status(200).json(req.user.followingAuthors);
}
