'use strict';

import Excel from 'exceljs';
import Waitinglist from '../../waitinglist/waitinglist.model';
import {getUserName} from '../../../components/utils';
import path from 'path';

export async function waitinglist(req, res) {
     const excel = path.join(__dirname, '../../../..', 'uploads', 'waitinglist.xlsx');
     const waitingList = await Waitinglist.find().populate('user').populate('book').lean();
     const excelData = _.map(waitingList, item => ({
          title: item.book.title,
          user: getUserName({user: item.user, fullName: true}),
          email: item.user.email
     }));
     const workbook = new Excel.Workbook();
     const sheet = workbook.addWorksheet('waitinglist');
     sheet.columns = [
          {header: 'Book Title', key: 'title'},
          {header: 'User Name', key: 'user'},
          {header: 'User Email', key: 'email'}
     ];
     sheet.addRows(excelData);
     workbook.xlsx.writeFile(excel).then(() => {
          res.download(excel, err => {
               console.log('error downloading file: ' + err);
          });
     });
}

