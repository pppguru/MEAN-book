'use strict';

import cron from 'cron';
import Request from '../../api/request/request.model';
import { addOrUpdateNewBooks, repairExistingBooksWithLessAPICall, updateBooksWithFullImage, updateBookWithFullImage } from '../bokbasen';
import { updateAlgoliaObjectFromAllExistingBooks } from '../algolia';
import { fetchAllInventoryAndPrice } from '../eldorados';

const { CronJob } = cron;

function startCronJobs() {
    startCronJob('* */1 * * *', [deactivateExpiredBookRequests]);
    startCronJob('00 30 23 * * 6', [updateBooksFromBokbasonAPI]); // 11:30:00 PM on every Sunday
    startCronJob('00 30 03 * * *', [updateSalesFromEldorados]); // 03:30:00 AM on every day

    //---------Temporary Run just at once------------
    //Run the repairing engine for existing books
    // startCronJob('00 05 17 29 5 *', [repairBooksWithBokbasonAPI]); // 17:05:00 AM at once (currently June 29th)

    //Run the algolia update job for existing books
    // startCronJob('00 45 01 30 5 *', [updateAlgoliaBooks]); // 01:45:00 AM at once (currently June 30th)

    //Run to fetch the new books from bokbasen from March 14th
    // startCronJob('00 42 18 30 5 *', [updateBooksFromBokbasonAPI]); // 18:42:00 PM on (currently June 30th)

     //Run to update the full image for books
     // startCronJob('00 00 10 07 6 *', [updateFullImages]); // 10:00:00 on (currently July 7th)
     startCronJob('00 00 11 07 6 *', [updateSalesFromEldorados]); // 19:10:00 on (currently July 6th)
}

function startCronJob(period, functions) {
    new CronJob(period, async function() { // eslint-disable-line
        try {
            for (const func of functions) {
                await func();
            }
        } catch (err) {
            console.log('Err :', err);
        }
    }, () => {
        /* This function is executed when the job stops */
    }, true, /* Start the job right now */ );
}

async function deactivateExpiredBookRequests() {
    try {
        const requests = await Request.find({ expire: { $lt: new Date() }, status: 'pending' });
        for (const request of requests) {
            request.status = 'expired';
            request.save();
        }
    } catch (err) {
        console.log('Err :', err);
    }
}

async function updateBooksFromBokbasonAPI() {
    try {
        (async function() {
            await addOrUpdateNewBooks(8); //Fetch all updated books from 8 days ago
        }()).then(() => console.log('All Books Update is done with operation:'))
            .catch((err) => console.log('Error', err))
            .then(() => process.exit());
    } catch (err) {
        console.log('Err :', err);
    }
}

async function repairBooksWithBokbasonAPI() {
    try {
        (async function() {
            await repairExistingBooksWithLessAPICall();
        }()).then(() => console.log('All Books are repaired:'))
            .catch((err) => console.log('Error', err))
            .then(() => process.exit());
    } catch (err) {
        console.log('Err :', err);
    }
}

async function updateSalesFromEldorados() {
    try {
        (async function() {
            await fetchAllInventoryAndPrice();
        }()).then(() => console.log('All Sales Update is done with operation:'))
            .catch((err) => console.log('Error', err))
            .then(() => process.exit());
    } catch (err) {
        console.log('Err :', err);
    }
}

async function updateAlgoliaBooks() {
    try {
        (async function() {
            await updateAlgoliaObjectFromAllExistingBooks();
        }()).then(() => console.log('All Sales Update is done with operation:'))
            .catch((err) => console.log('Error', err))
            .then(() => process.exit());
    } catch (err) {
        console.log('Err :', err);
    }
}

async function updateFullImages(){
     try {
          (async function() {
               await updateBookWithFullImage('9788241913297');
          }()).then(() => console.log('All Sales Update is done with operation:'))
               .catch((err) => console.log('Error', err))
               .then(() => process.exit());
     } catch (err) {
          console.log('Err :', err);
     }
}

export default { startCronJobs };
export const jobs = {
    deactivateExpiredBookRequests
};
