'use strict';

import User from '../user.model';
import * as userService from '../user.service';

export async function verifyEmail({body: {_id}}, res) {
     const user = await User.findById(_id);
     if (!user) throw {code: 403, message: 'Something went wrong. Please try again'};
     if (user.verifications.email) throw {code: 403, message: 'Email already verified'};
     user.verifications.email = true;
     await user.save();
     res.status(200).end();
}

export async function resendVerificationEmail({body: {email}}, res) {
     const user = await User.findOne({email});
     if (!user) throw {code: 403, message: 'Something went wrong. Please try again'};
     if (user.verifications.email) throw {code: 403, message: 'Email already verified'};
     await userService.sendVerifyEmail(user);
     res.status(200).json({message: `Hi ${user.firstName}, email with verification link for you account is successfully sent.`});
}
