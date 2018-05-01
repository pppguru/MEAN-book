import Request from '../../../api/request/request.model';
import Sale from '../../../api/sale/sale.model';

export default async function (user) {
     console.log('*** USER DEACTIVATED ***');
     const userPendingRequests = await Request.find({user: user._id, status : 'pending'});
     for (const request of userPendingRequests) {
          request.status = 'canceled';
          await request.save();
     }
     const userAvailableSales = await Sale.find({seller: user._id, status : 'available'});
     for (const sale of userAvailableSales) {
          sale.status = 'deactivated';
          await sale.save();
     }
};
