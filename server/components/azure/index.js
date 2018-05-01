'use strict';

import tedious from 'tedious';
import moment from 'moment';
import {getUserName} from '../../components/utils';
const {Connection, Request} = tedious;
const azureConfig = {
     userName: config.AZURE_USERNAME,
     password: config.AZURE_PASSWORD,
     server: config.AZURE_SERVER,
     options: {
          encrypt: true,
          rustServerCertificate: false,
          hostNameInCertificate: '*.database.windows.net',
          loginTimeout: 30,
          database: config.AZURE_DATABASE
     }
};

const connection = new Connection(azureConfig);
const tables = {
     Users: {
          insert: {
               fields: '_id, date, name, mail, following, followers, bookshelf, wishlist, sales, role, gender',
               generateValues: user => `'${user._id}', '${moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss')}', '${getUserName({user, fullName: true})}', '${user.email}', 
               ${user.numeric.following || 0}, ${user.numeric.followers || 0}, ${user.numeric.bookshelf || 0}, 
               ${user.numeric.wishlist || 0}, ${user.numeric.sales || 0}, '${user.role}', '${user.gender}'`
          },
          update: {
               generateValues: user => `name = '${getUserName({user, fullName: true})}', mail = '${user.email}', role = '${user.role}', 
               gender = '${user.gender}', following = ${user.numeric.following || 0}, followers = ${user.numeric.followers || 0}, 
               bookshelf = ${user.numeric.bookshelf || 0}, wishlist = ${user.numeric.wishlist || 0}, sales = ${user.numeric.sales || 0}`
          }
     },
     Sales: {
          insert: {
               fields: '_id, date, bookTitle, bookAuthor, bookGenre, sellerEmail, price, condition, format, delivery, status',
               generateValues: sale => `'${sale._id}', '${moment(sale.createdAt).format('YYYY-MM-DD HH:mm:ss')}', '${sale.book.title}', '${sale.book.author}', 
               '${sale.book.genre}', '${sale.seller.email}', ${sale.price || 0}, '${sale.condition}', '${sale.format}', '${sale.delivery}', '${sale.status}'`
          },
          update: {
               generateValues: sale => `price = ${sale.price || 0}, condition = '${sale.condition}', format = '${sale.format}', 
               delivery = '${sale.delivery}', status = '${sale.status}'`
          }
     },
     Requests: {
          insert: {
               fields: '_id, date, saleId, sellerEmail, buyerEmail, status',
               generateValues: req => `'${req._id}', '${moment(req.createdAt).format('YYYY-MM-DD HH:mm:ss')}', '${req.sale}', '${req.seller.email}', '${req.user.email}', '${req.status}'`
          },
          update: {
               generateValues: req => `status = '${req.status}'`
          }
     }
};

export function connect() {
     return new Promise((resolve, reject) => {
          connection.on('connect', err => {
               if (err) {
                    loggly.error(err);
                    reject(err);
               }
               else {
                    resolve('Connected!');
               }
          });
     })
}

config.env !== 'development' && connect();

export async function insertIntoTable({table, data}) {
     if (config.env === 'development') return false;
     const SQL = `INSERT INTO ${table} (${tables[table].insert.fields}) VALUES (${tables[table].insert.generateValues(data)})`;
     console.log('SQL: ', SQL);
     const request = new Request(SQL, (err, rowCount, rows) => {
               console.log(`err: ${err}`);
               console.log(`rowCount: ${rowCount} row(s) inserted`);
               console.log(`rows: ${rows}`);
          }
     );
     connection.execSql(request)
}

export function updateTableItem({table, data}) {
     if (config.env === 'development') return false;
     const SQL = `UPDATE ${table} SET ${tables[table].update.generateValues(data)} WHERE _id = '${data._id}'`;
     console.log('SQL: ', SQL);
     const request = new Request(SQL, (err, rowCount, rows) => {
               console.log(`err: ${err}`);
               console.log(`rowCount: ${rowCount} row(s) updated`);
               console.log(`rows: ${rows}`);
          }
     );
     connection.execSql(request);
}

// DEVELOPMENT CODE BELOW:

const req = {
     _id : "591ec490adfd3a8c56a1f168",
     createdAt : new Date(),
     sale : "59144e80d8216c0d517578d0",
     seller : "58ac20cc37c31f6d6fae5e1f",
     delivery : "delivery",
     price : 876,
     status: "xxx",
     user : "58b43c96cc9bb72ddf23d74b"
};

async function bulk() {
     await connect();
     insertIntoTable({
          table: 'Requests', data: req
     });
}
async function up() {
     await connect();
     updateTableItem({
          table: 'Requests', data: req
     });
}
// up();
// bulk();