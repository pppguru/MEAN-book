'use strict';

import Constant from '../../api/constants/constants.model';
const {transactions: {fees, calculations: {stripeProcessingFee, bookisServiceFee}}} = config;

function getIp(req) {
     const ipString = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress; // eslint-disable-line max-len
     if (ipString === '::1') return '127.0.0.1';
     const ips = ipString.split(', ');
     ips[0] = ips[0].replace('ffff:', '');
     ips[0] = ips[0].replace('::', '');
     return ips[0];
}

async function calculateStripeProcessingFee({base, isNorwegianCard = true}) {
     const fee = fees[isNorwegianCard ? fees.def : 'other'];
     return stripeProcessingFee({base, fee});
}

async function calculateBookisServiceFee({base}) {
     const {fees: {seller, buyer}} = await Constant.findOne().lean();
     return bookisServiceFee({base, seller, buyer});
}

function getUserName({user: {firstName, lastName, businessName, role}, fullName}) {
     const name = fullName ? `${firstName} ${lastName}` : firstName;
     return role === 'user' ? name : businessName;
}

export {
     getUserName,
     getIp,
     calculateStripeProcessingFee,
     calculateBookisServiceFee
};
