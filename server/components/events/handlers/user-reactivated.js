import Sale from '../../../api/sale/sale.model';

export default async function (user) {
     console.log('*** USER REACTIVATED ***');
     const userDeactivatedSales = await Sale.find({seller: user._id, status : 'deactivated'});
     for (const sale of userDeactivatedSales) {
          sale.status = 'available';
          await sale.save();
     }
};
