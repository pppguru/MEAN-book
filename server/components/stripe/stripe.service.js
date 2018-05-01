/* eslint camelcase: 0 */
'use strict';

import _stripe from 'stripe';
import moment from 'moment';
import {getFullBankNumber} from '../iban';
const {STRIPE_TEST_KEY, STRIPE_LIVE_KEY} = config;
const stripe = _stripe(config.env === 'staging' ? STRIPE_LIVE_KEY : STRIPE_TEST_KEY);

const createAccount = account => stripe.accounts.create(account);
const getAccount = accountId => stripe.accounts.retrieve(accountId);
const updateAccount = (stripeId, accountData) => stripe.accounts.update(stripeId, accountData);
const deleteAccount = account => stripe.accounts.del(account);
const createCustomer = customer => stripe.customers.create(customer);
const updateCustomer = (customerId, data) => stripe.customers.update(customerId, data);
const getCustomer = customerId => stripe.customers.retrieve(customerId);
const generateToken = data => stripe.tokens.create(data);
// const listSources = customerId => stripe.customers.listSources(customerId);
const createSource = (customerId, source) => stripe.customers.createSource(customerId, source);
const createExternalAccount = (managedAccountId, data) => stripe.accounts.createExternalAccount(managedAccountId, {external_account: data});
const setExternalAccountAsDefault = (managedId, sourceId) => stripe.accounts.updateExternalAccount(managedId, sourceId, {default_for_currency: true});
const listExternalAccounts = (managedAccountId, query) => stripe.accounts.listExternalAccounts(managedAccountId, query);
const deletePaymentMethod = (customerId, sourceId) => stripe.customers.deleteSource(customerId, sourceId);
const deletePayoutMethod = (managedId, sourceId) => stripe.accounts.deleteExternalAccount(managedId, sourceId);
const initializeCharge = data => stripe.charges.create(_.extend(data, {capture: false}));
const captureCharge = chargeId => stripe.charges.capture(chargeId);
const releaseCharge = charge => stripe.refunds.create({charge, reason: 'requested_by_customer'});
const payoutFunts = (stripe_account, data) => stripe.payouts.create(data, {stripe_account});
const getBalance = stripe_account => stripe.balance.retrieve({stripe_account});
const listPayouts = destination => stripe.payouts.list({destination});

async function getDefaultCustomerSource(id) {
     return _.get(await getCustomer(id), 'default_source');
}

async function createManagedAccount({user, ip, user_agent}) {
     if (!user.birthday || !_.get(user, 'address.coordinates[0]')) throw {code: 400, massage: 'Missing some of mandatory user data in order to create managed account (address or date of birth)'};

     const managedObj = {
          managed: true,
          country: 'NO',
          email: user.email,
          transfer_schedule: {
               interval: 'manual'
          },
          legal_entity: {
               first_name: user.firstName,
               last_name: user.lastName,
               type: 'individual',
               dob: {
                    day: moment(new Date(user.birthday)).date(),
                    month: moment(new Date(user.birthday)).month() + 1,
                    year: moment(new Date(user.birthday)).year()
               },
               address: {
                    city: user.address.city,
                    postal_code: user.address.zip,
                    state: user.address.state,
                    country: 'NO',
                    line1: user.address.streetAddress
               }
          },
          tos_acceptance: {
               date: Math.floor(Date.now() / 1000),
               ip, user_agent
          },
          metadata: {
               _id: user._id.toString()
          }
     };
     return createAccount(managedObj);
}

async function addPaymentMethod({user, user: {email, _id, accounts: {payment}, paymentCustomer: {id: customerId} = {}}, data}) {
     let token;
     if (data.type === 'Credit card') {
          data.name = `${data.firstName} ${data.lastName}`;
          data = _.pick(data, ['exp_month', 'exp_year', 'number', 'cvc', 'name', 'address_city', 'address_line1', 'address_state', 'address_country', 'address_zip']); // eslint-disable-line max-len
          data.object = 'card';
          token = await generateToken({card: data});
          if (customerId) {
               const fingerprints = _.map(payment, 'fingerprint');
               if (_.includes(fingerprints, token[data.object].fingerprint)) {
                    throw {code: 400, message: `${_.startCase(data.object)} already exists`};
               }
          }
     } else if (data.type === 'Bank account') {
          data = _.pick(data, ['account_number', 'account_holder_type', 'country', 'currency', 'account_holder_name', 'routing_number']); // eslint-disable-line max-len
          data.object = 'bank_account';
          token = await generateToken({bank_account: data});
     }
     if (!customerId) {
          ({id: customerId} = await createCustomer({email, metadata: {id: _id.toString()}}));
          user.paymentCustomer = {id: customerId};
          await user.save();
     }
     const source = await createSource(customerId, {source: data});
     const customer = await getCustomer(customerId);
     return {
          pm: _.pickBy({
               provider: 'Stripe',
               id: source.id,
               type: source.object,
               brand: source.brand,
               name: source.name,
               account_holder_name: source.account_holder_name,
               account_holder_type: source.account_holder_type,
               bank: source.bank_name,
               country: source.country,
               currency: source.currency,
               exp_year: source.exp_year,
               exp_month: source.exp_month,
               routing_number: source.routing_number,
               address_line: source.address_line1,
               address_state: source.address_state,
               address_zip: source.address_zip,
               address_city: source.address_city,
               address_country: source.address_country,
               endingWith: source.last4,
               fingerprint: token[data.object].fingerprint,
               isDefault: customer.default_source === source.id
          }, v => !_.isNil(v)),
          customer
     };
}

async function addPayoutMethod({user, user: {paymentAccount: {id: managedAccountId} = {}}, data, ip, user_agent}) {
     let token;
     if (data.type === 'Debit card') {
          data.currency = 'usd';
          data.name = `${user.firstName} ${user.lastName}`;
          data = _.pick(data, ['exp_month', 'exp_year', 'number', 'cvc', 'name', 'currency']);
          data.object = 'card';
          token = await generateToken({card: data});
     } else if (data.type === 'Bank account') {
          data.currency = 'nok';
          data.country = 'NO';
          data = _.pick(data, ['account_number', 'account_holder_type', 'country', 'currency', 'account_holder_name', 'routing_number']);
          data.object = 'bank_account';
          data.account_number = getFullBankNumber({number: data.account_number}) || data.account_number;
          token = await generateToken({bank_account: data});
     } else {
          throw {code: 400, message: `Payout method "${data.type}" is not supported!`};
     }
     const fingerprints = _.map(user.accounts.payout, 'fingerprint');
     if (_.includes(fingerprints, token[data.object].fingerprint)) {
          throw {code: 400, message: `${_.startCase(data.object)} already exists`};
     }
     if (!managedAccountId) {
          ({id: managedAccountId} = await createManagedAccount({user, ip, user_agent}));
     }
     const source = await createExternalAccount(managedAccountId, token.id);
     const managedAccount = await getAccount(managedAccountId);
     return {
          pm: _.pickBy({
               provider: 'Stripe',
               id: source.id,
               type: source.object,
               brand: source.brand,
               name: source.name,
               account_holder_name: source.account_holder_name,
               account_holder_type: source.account_holder_type,
               bank: source.bank_name,
               country: source.country,
               currency: source.currency,
               routing_number: source.routing_number,
               address_line: source.address_line1,
               address_state: source.address_state,
               address_zip: source.address_zip,
               address_city: source.address_city,
               address_country: source.address_country,
               endingWith: source.last4,
               fingerprint: token[data.object].fingerprint,
               isDefault: source.default_for_currency
          }, v => !_.isNil(v)),
          managedAccount
     };
}

export {
     createManagedAccount,
     getAccount,
     updateAccount,
     deleteAccount,
     createCustomer,
     updateCustomer,
     getCustomer,
     generateToken,
     addPaymentMethod,
     addPayoutMethod,
     getDefaultCustomerSource,
     listExternalAccounts,
     deletePaymentMethod,
     deletePayoutMethod,
     setExternalAccountAsDefault,
     initializeCharge,
     captureCharge,
     releaseCharge,
     payoutFunts,
     getBalance,
     listPayouts
};


