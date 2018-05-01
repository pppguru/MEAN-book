'use strict';

import Author from '../../api/author/author.model';
import Book from '../../api/book/book.model';
import Genre from '../../api/genre/genre.model';
import fs from 'fs';

const getTitleItem = (data, field) => !data ? undefined : _.isArray(data) ? _.first(data).TitleElement[field] : data.TitleElement[field]; //eslint-disable-line no-confusing-arrow
const getFormat = code => {
    switch (code) {
        case 'BC':
            return 'paperback'; //eslint-disable-line indent
        case 'BB':
            return 'hardcover'; //eslint-disable-line indent
        default:
            return code; //eslint-disable-line indent
    }
};
const getDescription = data => {
    data = _.compact(_.castArray(data));
    return _.get(data, '[0].Text');
};
const getStatus = code => {
    switch (code) {
        case '00':
            return 'Unspecified'; //eslint-disable-line indent
        case '01':
            return 'Cancelled'; //eslint-disable-line indent
        case '02':
            return 'Forthcoming'; //eslint-disable-line indent
        case '03':
            return 'Postponed indefinitely'; //eslint-disable-line indent
        case '04':
            return 'Active'; //eslint-disable-line indent
        case '05':
            return 'No longer our product'; //eslint-disable-line indent
        case '06':
            return 'Out of stock indefinitely'; //eslint-disable-line indent
        case '07':
            return 'Out of print'; //eslint-disable-line indent
        case '08':
            return 'Inactive'; //eslint-disable-line indent
        case '09':
            return 'Unknown'; //eslint-disable-line indent
        case '10':
            return 'Remaindered'; //eslint-disable-line indent
        case '11':
            return 'Withdrawn from sale'; //eslint-disable-line indent
        case '12':
            return 'Not available in this market'; //eslint-disable-line indent
        case '13':
            return 'Active, but not sold separately'; //eslint-disable-line indent
        case '14':
            return 'Active, with market restrictions'; //eslint-disable-line indent
        case '15':
            return 'Recalled'; //eslint-disable-line indent
        case '16':
            return 'Temporarily withdrawn from sale'; //eslint-disable-line indent
        default:
            return code; //eslint-disable-line indent
    }
};
const getAvailability = code => {
    switch (code) {
        case '01':
            return 'Cancelled'; //eslint-disable-line indent
        case '10':
            return 'Not yet available'; //eslint-disable-line indent
        case '11':
            return 'Awaiting stock'; //eslint-disable-line indent
        case '12':
            return 'Not yet available'; //eslint-disable-line indent
        case '20':
            return 'Available'; //eslint-disable-line indent
        case '21':
            return 'In stock'; //eslint-disable-line indent
        case '22':
            return 'To order'; //eslint-disable-line indent
        case '23':
            return 'POD'; //eslint-disable-line indent
        case '30':
            return 'Temporarily unavailable'; //eslint-disable-line indent
        case '31':
            return 'Out of stock'; //eslint-disable-line indent
        case '32':
            return 'Reprinting'; //eslint-disable-line indent
        case '33':
            return 'Awaiting reissue'; //eslint-disable-line indent
        case '34':
            return 'Temporarily withdrawn from sale'; //eslint-disable-line indent
        case '40':
            return 'Not available (reason unspecified)'; //eslint-disable-line indent
        case '41':
            return 'Not available, replaced by new product'; //eslint-disable-line indent
        case '42':
            return 'Not available, other format available'; //eslint-disable-line indent
        case '43':
            return 'No longer supplied by us'; //eslint-disable-line indent
        case '44':
            return 'Apply direct'; //eslint-disable-line indent
        case '45':
            return 'Not sold separately'; //eslint-disable-line indent
        case '46':
            return 'Withdrawn from sale'; //eslint-disable-line indent
        case '47':
            return 'Remaindered'; //eslint-disable-line indent
        case '48':
            return 'Not available, replaced by POD'; //eslint-disable-line indent
        case '49':
            return 'Recalled'; //eslint-disable-line indent
        case '50':
            return 'Not sold as set'; //eslint-disable-line indent
        case '51':
            return 'Not available, publisher indicates OP'; //eslint-disable-line indent
        case '52':
            return 'Not available, publisher no longer sells product in this market'; //eslint-disable-line indent
        case '97':
            return 'No recent update received'; //eslint-disable-line indent
        case '98':
            return '	No longer receiving updates'; //eslint-disable-line indent
        case '99':
            return 'Contact supplier'; //eslint-disable-line indent
        default:
            return code; //eslint-disable-line indent
    }
};
const getPriceType = code => {
    switch (code) {
        case '01':
            return 'RRP excluding tax'; //eslint-disable-line indent
        case '02':
            return 'RRP including tax'; //eslint-disable-line indent
        case '03':
            return 'Fixed retail price excluding tax'; //eslint-disable-line indent
        case '04':
            return 'Fixed retail price including tax'; //eslint-disable-line indent
        case '05':
            return 'Supplier’s net price excluding tax'; //eslint-disable-line indent
        case '06':
            return 'Supplier’s net price excluding tax: rental goods'; //eslint-disable-line indent
        case '07':
            return 'Supplier’s net price including tax'; //eslint-disable-line indent
        case '08':
            return 'Supplier’s alternative net price excluding tax'; //eslint-disable-line indent
        case '09':
            return 'Supplier’s alternative net price including tax'; //eslint-disable-line indent
        case '11':
            return 'Special sale RRP excluding tax'; //eslint-disable-line indent
        case '12':
            return 'Special sale RRP including tax'; //eslint-disable-line indent
        case '13':
            return 'Special sale fixed retail price excluding tax'; //eslint-disable-line indent
        case '14':
            return 'Special sale fixed retail price including tax'; //eslint-disable-line indent
        case '15':
            return 'Supplier’s net price for special sale excluding tax'; //eslint-disable-line indent
        case '17':
            return 'Supplier’s net price for special sale including tax'; //eslint-disable-line indent
        case '21':
            return 'Pre-publication RRP excluding tax'; //eslint-disable-line indent
        case '22':
            return 'Pre-publication RRP including tax'; //eslint-disable-line indent
        case '23':
            return 'Pre-publication fixed retail price excluding tax'; //eslint-disable-line indent
        case '24':
            return 'Pre-publication fixed retail price including tax'; //eslint-disable-line indent
        case '25':
            return 'Supplier’s pre-publication net price excluding tax'; //eslint-disable-line indent
        case '27':
            return 'Supplier’s pre-publication net price including tax'; //eslint-disable-line indent
        case '31':
            return 'Freight-pass-through RRP excluding tax'; //eslint-disable-line indent
        case '32':
            return 'Freight-pass-through billing price excluding tax'; //eslint-disable-line indent
        case '33':
            return 'Importer’s Fixed retail price excluding tax'; //eslint-disable-line indent
        case '34':
            return 'Importer’s Fixed retail price including tax'; //eslint-disable-line indent
        case '41':
            return 'Publishers retail price excluding tax'; //eslint-disable-line indent
        case '42':
            return 'Publishers retail price including tax'; //eslint-disable-line indent
        default:
            return code; //eslint-disable-line indent
    }
};
const getTaxCode = code => {
    switch (code) {
        case 'H':
            return 'Higher rate'; //eslint-disable-line indent
        case 'P':
            return 'Tax paid at source (Italy)'; //eslint-disable-line indent
        case 'R':
            return 'Lower rate'; //eslint-disable-line indent
        case 'S':
            return 'Standard rate'; //eslint-disable-line indent
        case 'Z':
            return 'Zero-rated'; //eslint-disable-line indent
        default:
            return code; //eslint-disable-line indent
    }
};
const getTaxType = code => {
    switch (code) {
        case '01':
            return 'VAT'; //eslint-disable-line indent
        case '02':
            return 'GST'; //eslint-disable-line indent
        default:
            return code; //eslint-disable-line indent
    }
};

export async function attachAuthorIds(book) {
    for (let [i, author] of book.author.entries()) {
        const bokbasenId = _.get(author, 'NameIdentifier.IDValue');
        if (bokbasenId) {
            const existingAuthors = await Author.find({ bokbasenId: { $in: _.map(book.author, 'NameIdentifier.IDValue') } }).lean();
            const existing = _.find(existingAuthors, { bokbasenId });
            if (existing) {
                book.author[i] = existing._id;

                //Update the existing author
                let name = _.get(author, 'PersonNameInverted', _.get(author, 'PersonName'));
                if (name) {
                    name = name.split(',');
                    if (name.length === 1) { //eslint-disable-line max-depth
                        name = name[0].split(' '); //eslint-disable-line max-depth
                    } //eslint-disable-line max-depth
                    name.reverse();
                }
                const corporateName = _.get(author, 'CorporateName');
                await Author.findOneAndUpdate(
                    { 'bokbasenId': bokbasenId},
                    _.extend({
                        year: _.get(author, 'ContributorDate.Date.$t'),
                        country: _.get(author, 'ContributorPlace.CountryCode'),
                        bokbasenId
                    }, name ? { firstName: _.trim(name[0]), lastName: _.trim(name[1]) } : corporateName ? { corporateName } : {}),
                    {upsert : true}
                ).exec();

            } else {
                let name = _.get(author, 'PersonNameInverted', _.get(author, 'PersonName'));
                if (name) {
                    name = name.split(',');
                    if (name.length === 1) { //eslint-disable-line max-depth
                        name = name[0].split(' '); //eslint-disable-line max-depth
                    } //eslint-disable-line max-depth
                    name.reverse();
                }
                const corporateName = _.get(author, 'CorporateName');
                const newAuthor = new Author(_.extend({
                    year: _.get(author, 'ContributorDate.Date.$t'),
                    country: _.get(author, 'ContributorPlace.CountryCode'),
                    bokbasenId
                }, name ? { firstName: _.trim(name[0]), lastName: _.trim(name[1]) } : corporateName ? { corporateName } : {}));
                book.author[i] = newAuthor._id;
                await newAuthor.save();
            }
        } else {
            let name = _.get(author, 'PersonNameInverted', _.get(author, 'PersonName'));
            const corporateName = _.get(author, 'CorporateName');

            if (name) {
                name = name.split(',');
                if (name.length === 1) { //eslint-disable-line max-depth
                    name = name[0].split(' '); //eslint-disable-line max-depth
                } //eslint-disable-line max-depth
                name.reverse();

                const firstName = _.trim(name[0]);
                const lastName = _.trim(name[1]);

                let existingAuthor = await Author.findOne({firstName: new RegExp(firstName, 'i'), lastName: new RegExp(lastName, 'i')});
                const newAuthor = existingAuthor ? existingAuthor : await new Author({firstName, lastName}).save();

                book.author[i] = newAuthor._id;
            }
            else if (corporateName){
                let existingAuthor = await Author.findOne({corporateName: new RegExp(corporateName, 'i')});
                const newAuthor = existingAuthor ? existingAuthor : await new Author({corporateName}).save();

                book.author[i] = newAuthor._id;
            }
            else{
                book.author[i] = undefined;    
            }

        
        }
    }
}

export async function attachGenreIds(book) {
    const existingGenres = await Genre.find({ no: { $in: book.genre } }).lean();
    _.each(book.genre, (no, i) => {
        const existing = _.find(existingGenres, { no });
        if (existing) {
            book.genre[i] = existing._id;
        } else {
            const newGenre = new Genre({ no });
            book.genre[i] = newGenre._id;
            newGenre.save();
        }
    });

    const genreCount = book.genre.length;
    const existingSubjects = await Genre.find({ no: { $in: book.subject } }).lean();
    _.each(book.subject, (no, i) => {
        const existing = _.find(existingSubjects, { no });
        if (existing) {
            book.genre[i + genreCount] = existing._id;
        } else {
            const newGenre = new Genre({ no });
            book.genre[i + genreCount] = newGenre._id;
            newGenre.save();
        }
    });
}

export const transformer = el => ({
    bokbasenId: el.RecordReference,
    isbn: {
        full: _.get(el, 'ProductIdentifier[0].IDValue'),
        short: _.get(el, 'ProductIdentifier[2].IDValue')
    },
    title: getTitleItem(_.get(el, 'DescriptiveDetail.TitleDetail'), 'TitleText'),
    subtitle: getTitleItem(_.get(el, 'DescriptiveDetail.TitleDetail'), 'Subtitle'),
    // author: _.compact(_.uniqBy(_.castArray(_.get(el, 'DescriptiveDetail.Contributor')), 'ContributorRole')), //TODO type => id
    author: _.compact(_.castArray(_.get(el, 'DescriptiveDetail.Contributor')), 'ContributorRole'),
    format: getFormat(_.get(el, 'DescriptiveDetail.ProductForm')),
    genre: _.compact(_.map(_.filter(_.get(el, 'DescriptiveDetail.Subject'), { SubjectSchemeName: 'Bokbasen_Genre' }), 'SubjectHeadingText')),
    form: _.compact(_.map(_.filter(_.get(el, 'DescriptiveDetail.Subject'), { SubjectSchemeName: 'Bokbasen_Form' }), 'SubjectHeadingText')),
    place: _.compact(_.map(_.filter(_.get(el, 'DescriptiveDetail.Subject'), { SubjectSchemeName: 'Bokbasen_Geograhpical_Place' }), 'SubjectHeadingText')),
    subject: _.compact(_.map(_.filter(_.get(el, 'DescriptiveDetail.Subject'), { SubjectSchemeName: 'Bokbasen_Subject' }), 'SubjectHeadingText')),
    litterary: _.compact(_.map(_.filter(_.get(el, 'DescriptiveDetail.Subject'), { SubjectSchemeName: 'Bokbasen_LitteraryType' }), 'SubjectHeadingText')),
    language: _.map(_.castArray(_.get(el, 'DescriptiveDetail.Language')), 'LanguageCode'),
    audience: _.get(el, 'DescriptiveDetail.Audience.AudienceCodeValue'),
    description: getDescription(_.get(el, 'CollateralDetail.TextContent')),
    measure: {
        weight: _.get(el, 'DescriptiveDetail.Measure[0].Measurement', 0),
        height: _.get(el, 'DescriptiveDetail.Measure[1].Measurement', 0),
        width: _.get(el, 'DescriptiveDetail.Measure[2].Measurement', 0),
        thickness: _.get(el, 'DescriptiveDetail.Measure[3].Measurement', 0)
    },
    image: {
        small: _.get(el, 'CollateralDetail.SupportingResource[0].ResourceVersion.ResourceLink'),
        full: _.get(el, 'CollateralDetail.SupportingResource[1].ResourceVersion.ResourceLink')
    },
    publisher: _.get(el, 'PublishingDetail.Publisher.PublisherName'),
    year: _.get(el, 'PublishingDetail.PublishingDate[0].Date.$t', null),
    price: {
        amount: +_.get(el, 'ProductSupply.SupplyDetail.Price.PriceAmount', 0),
        type: getPriceType(_.get(el, 'ProductSupply.SupplyDetail.Price.PriceType'))
    },
    tax: {
        amount: +_.get(el, 'ProductSupply.SupplyDetail.Price.Tax.TaxRatePercent', 0),
        type: getTaxType(_.get(el, 'ProductSupply.SupplyDetail.Price.Tax.TaxType')),
        code: getTaxCode(_.get(el, 'ProductSupply.SupplyDetail.Price.Tax.TaxRateCode'))
    },
    currency: _.get(el, 'ProductSupply.SupplyDetail.Price.CurrencyCode'),
    supply: {
        supplier: _.get(el, 'ProductSupply.SupplyDetail.Supplier.SupplierName'),
        availability: getAvailability(_.get(el, 'ProductSupply.SupplyDetail.ProductAvailability')),
        status: getStatus(_.get(el, 'ProductSupply.MarketPublishingDetail.MarketPublishingStatus')),
        statusNote: _.get(el, 'ProductSupply.MarketPublishingDetail.MarketPublishingStatusNote')
    }
});

export const transformerForDiffAuthor = el => ({
    isbn: {
        full: _.get(el, 'ProductIdentifier[0].IDValue'),
        short: _.get(el, 'ProductIdentifier[2].IDValue')
    },
    author: _.compact(_.uniqBy(_.castArray(_.get(el, 'DescriptiveDetail.Contributor')), 'PersonNameInverted')),
    genre: _.compact(_.map(_.filter(_.get(el, 'DescriptiveDetail.Subject'), { SubjectSchemeName: 'Bokbasen_Genre' }), 'SubjectHeadingText')),
    description: getDescription(_.get(el, 'CollateralDetail.TextContent')),
    image: {
        small: _.get(el, 'CollateralDetail.SupportingResource[0].ResourceVersion.ResourceLink'),
        full: _.get(el, 'CollateralDetail.SupportingResource[1].ResourceVersion.ResourceLink')
    }
});

export const saveLogs = (next, data) => {
    fs.writeFile(`${next}.json`, data, err => {
        if (err) {
            return console.log(err);
        }
        console.log(`File ${next}.json saved successfully!`);
    });
};