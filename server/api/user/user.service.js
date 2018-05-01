/* eslint camelcase: 0 */
'use strict';
import emailService from '../../components/email';
import * as auth from '../../auth/auth.service';
import {uploadImage, genS3Path} from '../../components/s3';
import path from 'path';
import * as stripeService from '../../components/stripe/stripe.service';
import emitter from '../../components/events';
import {updateAlgoliaObject, addObjectsToAlgolia} from '../../components/algolia';
import {insertIntoTable, updateTableItem} from '../../components/azure';
const {events} = config;

const transformStripeManagedAccount = managed => ({
     id: managed.id,
     verification: {
          fieldsNeeded: _.get(managed, 'verification.fields_needed', []),
          dueBy: _.get(managed, 'verification.due_by', null)
     },
     chargesEnabled: _.get(managed, 'charges_enabled', false),
     transfersEnabled: _.get(managed, 'transfers_enabled', false)
});

async function syncDefaultSource({user, id}) {
     if (!id) {
          id = await stripeService.getDefaultCustomerSource(user.paymentCustomer.id);
     }
     const account = _.find(user.accounts.payment, {id});
     if (id && !account) {
          throw {code: 404, message: 'User does not have specified payment account attached to it'};
     }
     _.each(user.accounts.payment, acc => {
          acc.isDefault = acc.id === id;
     });
     await user.save();
     return account;
}

async function syncDefaultExternalSource({user, id, currency}) {
     const account = _.find(user.accounts.payout, {id, currency});
     if (id && !account) {
          throw {code: 404, message: 'User does not have specified payout account attached to it'};
     }
     _.each(_.filter(user.accounts.payout, {currency}), acc => {
          acc.isDefault = acc.id === id && acc.currency === currency;
     });
     await user.save();
     return account;
}

export async function attachPaymentMethodToUser({user, data}) {
     const {pm, customer} = await stripeService.addPaymentMethod({user, data});
     if (!_.get(user, 'paymentCustomer.id')) {
          user.paymentCustomer = {id: customer.id};
     }
     user.accounts.payment.push(pm);
     await syncDefaultSource({user});
     await user.save();
     return pm;
}

export async function attachPayoutMethodToUser({user, data, ip, user_agent}) {
     const {pm, managedAccount} = await stripeService.addPayoutMethod({user, data, ip, user_agent});
     user.paymentAccount = transformStripeManagedAccount(managedAccount);
     user.accounts.payout.push(pm);
     await user.save();
     return pm;
}

async function deleteUserPaymentMethod({user, accountId}) {
     const {deleted, id} = await stripeService.deletePaymentMethod(user.paymentCustomer.id, accountId);
     if (!deleted) throw {code: 500, message: 'Something went wrong while deleting card'};
     const index = _.findIndex(user.accounts.payment, {id});
     if (index > -1) {
          user.accounts.payment.splice(index, 1);
     }
     await syncDefaultSource({user});
     await user.save();
}

async function deleteUserPayoutMethod({user, accountId}) {
     const {deleted, id} = await stripeService.deletePayoutMethod(user.paymentAccount.id, accountId);
     if (!deleted) throw {code: 500, message: 'Something went wrong while deleting card'};
     const index = _.findIndex(user.accounts.payout, {id});
     if (index > -1) {
          user.accounts.payout.splice(index, 1);
     }
     await user.save();
}

export async function deleteAccountFromUser({user, accountId}) {
     if (_.find(user.accounts.payment, {id: accountId})) {
          return deleteUserPaymentMethod({user, accountId});
     } else if (_.find(user.accounts.payout, {id: accountId})) {
          return deleteUserPayoutMethod({user, accountId});
     }
     throw {code: 400, message: 'Specified account id does not exist.'};
}
export async function setAsDefaultUserAccount({user, accountId}) {
     if (_.find(user.accounts.payment, {id: accountId})) {
          const {default_source} = await stripeService.updateCustomer(user.paymentCustomer.id, {default_source: accountId});
          return await syncDefaultSource({user, id: default_source});
     } else if (_.find(user.accounts.payout, {id: accountId})) {
          const {id, currency} = await stripeService.setExternalAccountAsDefault(user.paymentAccount.id, accountId);
          return await syncDefaultExternalSource({user, id, currency});
     } else {
          throw {code: 400, message: 'Specified account id does not exist.'};
     }
}

export async function payoutToUser({managedId, amount}) {
     await stripeService.payoutFunts(managedId, {
          amount: amount * 100,
          source_type: 'bank_account',
          currency: 'nok'
     });
}

export function sendVerifyEmail({_id, email, role, firstName}) {
     const token = auth.signToken(_id, role, 60 * 15);
     const confirmUrl = `${config.domain}/verify-email/${token}`;
     return emailService.sendTemplate('email-confirmation', email, {
          userFirstName: _.capitalize(firstName) || 'Hi there',
          confirmUrl
     });
}

export async function sendVerifyEmailAfterSignup(user) {
     if (this._isNew) {
          sendVerifyEmail(user);
          addObjectsToAlgolia('users', user);
          insertIntoTable({table: 'Users', data: user});
     }
}

export async function handleDeactivation() {
     if (this._deactivated) {
          emitter.emit(events.USER_DEACTIVATED, this);
     }
     if (this._reactivated) {
          emitter.emit(events.USER_REACTIVATED, this);
     }
}

export async function sendResetEmail({_id, role, email, firstName}) {
     const token = auth.signToken(_id, role, 60 * 15);
     const resetPasswordUrl = `${config.domain}/reset-password/${token}`;
     return emailService.sendTemplate('reset-password', email, {
          userFirstName: _.capitalize(firstName) || 'Hi there',
          resetPasswordUrl
     });
}

export async function algoliaSync() {
     if (this._changedImage) {
          updateAlgoliaObject('users', this._id.toString(), {
               image: this.imageUrl
          });
     }
     if (this._changedName) {
          updateAlgoliaObject('users', this._id.toString(), {
               name: this.businessName || `${this.firstName} ${this.lastName}`
          });
     }
}

export async function azureSync() {
     this._azureSync && updateTableItem({table: 'Users', data: this});
}

export function uploadProfileImage(localPath, {role, _id}) {
     const imagePath = path.join(__dirname, '/../../..', localPath);
     const s3Path = genS3Path(role, _id, `profile-image${+new Date()}`);
     return uploadImage(imagePath, s3Path);
}

export async function attachNewState(next) {
     this._isNew = this.isNew;
     this._deactivated = !this.isNew && this.isModified('active') && !this.active;
     this._reactivated = !this.isNew && this.isModified('active') && this.active;
     this._changedImage = !this.isNew && this.isModified('imageUrl');
     this._changedName = !this.isNew && (this.isModified('businessName') || this.isModified('firstName') || this.isModified('lastName'));
     this._azureSync = this._changedName || this.isModified('numeric') || this.isModified('gender');
     next();
}
