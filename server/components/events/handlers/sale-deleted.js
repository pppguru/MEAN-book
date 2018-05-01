import {removeObjectsFromAlgolia} from '../../../components/algolia';

export default async function (sale) {
     console.log('*** SALE DELETED ***');
     removeObjectsFromAlgolia('sales', _.castArray(sale));
};
