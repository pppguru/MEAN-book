'use strict';

import angular from 'angular';
import {authors, mainAuthor} from './authors';
import {genres} from './genres';
import {algoliaGenres} from './algolia.genres';
import {user} from './user.name';
import {author} from './author.name';
import {sales} from './sales';
import {salePrice} from './sale.price';
import {address} from './address';
import {measures} from './measures';
import {timeline} from './timeline';

export default angular.module('bookisApp.filters', [])
     .filter('authors', authors)
     .filter('mainAuthor'. mainAuthor)
     .filter('genres', genres)
     .filter('algoliaGenres', algoliaGenres)
     .filter('userName', user)
     .filter('authorName', author)
     .filter('userAddress', address)
     .filter('sales', sales)
     .filter('measures', measures)
     .filter('salePrice', salePrice)
     .filter('timeline', timeline)
     .name;
