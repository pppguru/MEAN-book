'use strict';

import iban from 'iban';

export function getFullBankNumber({number, countryPrefix = 'NO'}) {
     if (number.startsWith(countryPrefix)) number = number.substring(4);
     const allPossibilities = _.map(_.range(1, 101), n => `NO${n < 10 ? ('0' + n) : n}${number}`);
     return _.find(allPossibilities, iban.isValid);
}
