'use strict';
/*eslint no-invalid-this:0*/
import crypto from 'crypto';
import mongoose from 'mongoose';
import PaymentMethodSchema from './payment-method/payment.method.model';
import PaymentAccountSchema from './payment-account/payment.account.model';
import * as userService from './user.service';

const {Schema, Schema: {ObjectId}} = mongoose;
const authTypes = ['github', 'twitter', 'facebook', 'google'];

const UserSchema = new Schema({
     firstName: String,
     lastName: String,
     about: String,
     gender: String,
     imageUrl: String,
     phone: String,
     birthday: Date,
     email: {
          type: String,
          lowercase: true,
          required() {
               return authTypes.indexOf(this.provider) === -1;
          }
     },
     password: {
          type: String,
          required() {
               return authTypes.indexOf(this.provider) === -1;
          }
     },
     verifications: {
          email: {type: Boolean, default: false}
     },
     role: {type: String, default: 'user'},
     businessName: String,
     notifications: {
          relevantBook: {type: Boolean, default: false},
          interestingBook: {type: Boolean, default: false},
          message: {type: Boolean, default: true},
          downVoteMyComment: {type: Boolean, default: true},
          upVoteMyComment: {type: Boolean, default: true},
          replyMyComment: {type: Boolean, default: false},
          commentMyReview: {type: Boolean, default: false},
          followsMe: {type: Boolean, default: true}
     },
     delivery: {
          meetup: {
               enabled: {type: Boolean, default: true}
          },
          shipping: {
               enabled: {type: Boolean, default: true},
               info: String,
               duration: String,
               policy: String
          }
     },
     address: {
          streetAddress: String,
          streetNumeric: String,
          city: String,
          state: String,
          country: String,
          zip: String,
          coordinates: [Number]
     },
     following: [{type: ObjectId, ref: 'User'}],
     followingAuthors: [{type: ObjectId, ref: 'Author'}],
     followers: [{type: ObjectId, ref: 'User'}],
     accounts: {payment: [PaymentMethodSchema], payout: [PaymentMethodSchema]},
     paymentCustomer: {id: String},
     paymentAccount: PaymentAccountSchema,
     numeric: {
          following: {type: Number, default: 0},
          followingAuthors: {type: Number, default: 0},
          followers: {type: Number, default: 0},
          wishlist: {type: Number, default: 0},
          sales: {type: Number, default: 0},
          bookshelf: {type: Number, default: 0}
     },
     active: {
          type: Boolean,
          default: true
     },
     provider: String,
     salt: String,
     facebook: {},
     twitter: {},
     google: {},
     github: {}
}, {timestamps: true});

UserSchema.index({'address.coordinates': '2d'});

/**
 * Virtuals
 */

// Public profile information
UserSchema
     .virtual('profile')
     .get(function() {
          return {
               firstName: this.firstName,
               lastName: this.lastName,
               role: this.role
          };
     });

// Non-sensitive info we'll be putting in the token
UserSchema
     .virtual('token')
     .get(function() {
          return {
               _id: this._id,
               role: this.role
          };
     });

/**
 * Validations
 */

// Validate empty email
UserSchema
     .path('email')
     .validate(function(email) {
          if (authTypes.indexOf(this.provider) !== -1) {
               return true;
          }
          return email.length;
     }, 'Email cannot be blank');

// Validate empty password
UserSchema
     .path('password')
     .validate(function(password) {
          if (authTypes.indexOf(this.provider) !== -1) {
               return true;
          }
          return password.length;
     }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
     .path('email')
     .validate(function(value, respond) {
          if (authTypes.indexOf(this.provider) !== -1) {
               return respond(true);
          }

          return this.constructor.findOne({email: value})
               .then(user => {
                    if (user) {
                         if (this.id === user.id) {
                              return respond(true);
                         }
                         return respond(false);
                    }
                    return respond(true);
               })
               .catch(function(err) {
                    throw err;
               });
     }, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
     return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
     .pre('save', function(next) {
          // Handle new/update passwords
          if (!this.isModified('password')) {
               return next();
          }

          if (!validatePresenceOf(this.password)) {
               if (authTypes.indexOf(this.provider) === -1) {
                    return next(new Error('Invalid password'));
               } else {
                    return next();
               }
          }

          // Make salt with a callback
          this.makeSalt((saltErr, salt) => {
               if (saltErr) {
                    return next(saltErr);
               }
               this.salt = salt;
               this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
                    if (encryptErr) {
                         return next(encryptErr);
                    }
                    this.password = hashedPassword;
                    return next();
               });
          });
     });

UserSchema.pre('save', userService.attachNewState);
UserSchema.post('save', userService.sendVerifyEmailAfterSignup);
UserSchema.post('save', userService.handleDeactivation);
UserSchema.post('save', userService.algoliaSync);
UserSchema.post('save', userService.azureSync);

/**
 * Methods
 */
UserSchema.methods = {
     /**
      * Authenticate - check if the passwords are the same
      *
      * @param {String} password
      * @param {Function} callback
      * @return {Boolean}
      * @api public
      */
     authenticate(password, callback) {
          if (!callback) {
               return this.password === this.encryptPassword(password);
          }

          this.encryptPassword(password, (err, pwdGen) => {
               if (err) {
                    return callback(err);
               }

               if (this.password === pwdGen) {
                    return callback(null, true);
               } else {
                    return callback(null, false);
               }
          });
     },

     /**
      * Make salt
      *
      * @param {Number} [byteSize] - Optional salt byte size, default to 16
      * @param {Function} callback
      * @return {String}
      * @api public
      */
     makeSalt(byteSize, callback) {
          var defaultByteSize = 16;

          if (typeof arguments[0] === 'function') {//eslint-disable-line prefer-rest-params
               callback = arguments[0];//eslint-disable-line prefer-rest-params
               byteSize = defaultByteSize;
          } else if (typeof arguments[1] === 'function') {//eslint-disable-line prefer-rest-params
               callback = arguments[1];//eslint-disable-line prefer-rest-params
          } else {
               throw new Error('Missing Callback');
          }

          if (!byteSize) {
               byteSize = defaultByteSize;
          }

          return crypto.randomBytes(byteSize, (err, salt) => {
               if (err) {
                    return callback(err);
               } else {
                    return callback(null, salt.toString('base64'));
               }
          });
     },

     /**
      * Encrypt password
      *
      * @param {String} password
      * @param {Function} callback
      * @return {String}
      * @api public
      */
     encryptPassword(password, callback) {
          if (!password || !this.salt) {
               if (!callback) {
                    return null;
               } else {
                    const message = `Whoops! Looks like password is not set. Try sign in using "Login with ${this.provider}" button above`;
                    return callback(message);
               }
          }

          var defaultIterations = 10000;
          var defaultKeyLength = 64;
          var salt = new Buffer(this.salt, 'base64');

          if (!callback) {
               return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha1')//eslint-disable-line no-sync
                    .toString('base64');
          }

          return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha1', (err, key) => {
               if (err) {
                    return callback(err);
               } else {
                    return callback(null, key.toString('base64'));
               }
          });
     }
};

export default mongoose.model('User', UserSchema);
