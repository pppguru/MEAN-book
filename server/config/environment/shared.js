'use strict';

const envData = {
     development: {
          DOMAIN: 'http://localhost:3000',
          ALGOLIA_APP_ID: '6YEQ05TQD3',
          ALGOLIA_SEARCH_KEY: 'eb08273185b943a5f82de237e6104a35'
     },
     staging: {
          DOMAIN: 'https://bookis.com',
          ALGOLIA_APP_ID: '6YEQ05TQD3',
          ALGOLIA_SEARCH_KEY: 'eb08273185b943a5f82de237e6104a35'
     },
     production: {
          DOMAIN: 'http://production.mxgtax9asd.eu-west-1.elasticbeanstalk.com',
          ALGOLIA_APP_ID: '6YEQ05TQD3',
          ALGOLIA_SEARCH_KEY: 'eb08273185b943a5f82de237e6104a35'
     }
};

function bookisServiceFee(obj) {
     return {
          seller: +obj.base - (+obj.base * (1 - (obj.seller / 100))),
          buyer: +obj.base - (+obj.base * (1 - (obj.buyer / 100)))
     }
}

function stripeProcessingFee(obj) {
     const total = ((+obj.base + +obj.fee.additionalFeeAmount) / (1 - +obj.fee.merchantFeePercentage)).toFixed(2);
     return (total - +obj.base).toFixed(2);
}

exports = module.exports = {
     // List of user roles
     userRoles: ['user', 'merchant', 'admin', 'supermerchant'],
     genders: ['male', 'female'],
     shippingDurations: ['1-3', '3-6', '6-9', '9+'],
     payments: {
          supported: {
               cards: ['Visa', 'MasterCard', 'Discover', 'American Express'],
               cardImages: {
                    Visa: '/assets/images/visa-orange@2x.png',
                    MasterCard: '/assets/images/master-orange@2x.png',
                    Discover: '/assets/images/discover-orange@2x.png',
                    'American Express': '/assets/images/american-express-orange@2x.png'
               },
               payout: {
                    methods: ['Bank account', 'Debit card', 'PayPal']
               }
          }
     },
     transactions: {
          statuses: ['captured', 'processed', 'failed', 'refunded', 'refund_failed', 'transferred', 'transfer_failed'],
          fees: {
               def: 'other',
               no: {
                    merchantFeePercentage: 0.014,
                    additionalFeeAmount: 1.8
               },
               us: {
                    merchantFeePercentage: 0.029,
                    additionalFeeAmount: 0.30
               },
               other: {
                    merchantFeePercentage: 0.029,
                    additionalFeeAmount: 1.8
               }
          },
          calculations: {
               bookisServiceFee: bookisServiceFee,
               stripeProcessingFee: stripeProcessingFee
          }
     },
     payouts: {
          supported: {
               holder_type: ['individual', 'company']
          }
     },
     books: {
          formats: ['paperback', 'hardcover'],
          conditions: ['new', 'refurbished', 'like new', 'very good', 'good', 'acceptable'],
          statuses: ['active', 'sold'],
          ages: ['0-3', '3-6', '6-9', '9-12', '12-16', 'Voksen'],
          measureTemplates: [{
               title: 'Extra small',
               image: '',
               weight: 100,
               height: 100,
               width: 100,
               thickness: 10
          }, {
               title: 'Small',
               image: '',
               weight: 200,
               height: 200,
               width: 200,
               thickness: 20
          }, {
               title: 'Medium',
               image: '',
               weight: 300,
               height: 300,
               width: 300,
               thickness: 30
          }, {
               title: 'Large',
               image: '',
               weight: 400,
               height: 400,
               width: 400,
               thickness: 40
          }]
     },
     requests: {
          statuses: ['pending', 'waiting', 'delivered', 'declined']
     },
     sales: {
          statuses: ['available', 'requested', 'captured', 'sold', 'deleted', 'deactivated']
     },
     envData: envData[process.env.NODE_ENV],
     repliesPerFetch: 3,
     reviewsPerFetch: 7,
     social: [
          {provider: 'facebook', key: '251261141963996'},
          {provider: 'twitter', key: 'Bookisno'}
     ]
};
