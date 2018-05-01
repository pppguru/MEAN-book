import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {attachS3Link} from '../helper';

const OAUTH_CREDENTIALS = {
     clientID: config.google.clientID,
     clientSecret: config.google.clientSecret,
     callbackURL: config.google.callbackURL
};

export function setup(User) {
     passport.use(new GoogleStrategy(OAUTH_CREDENTIALS,
          async (accessToken, refreshToken, profile, done) => {//eslint-disable-line arrow-parens
               try {
                    let user = await User.findOne({'google.id': profile.id});
                    if (user) {
                         return done(null, user);
                    }
                    let newGoogleUser = {
                         firstName: _.get(profile, 'name.givenName'),
                         lastName: _.get(profile, 'name.familyName'),
                         gender: profile.gender,
                         email: _.get(_.first(profile.emails), 'value'),
                         role: 'user',
                         provider: 'google',
                         google: _.pick(profile._json, ['displayName', 'id', 'language', 'url']),
                         imageUrl: _.get(_.first(profile.photos), 'value')
                    };
                    user = new User(newGoogleUser);
                    if (user.imageUrl) user.imageUrl = await attachS3Link(user, 'google');
                    await user.save();
                    done(null, user);
               } catch (err) {
                    done(err);
               }
          }
     ));
}
