import passport from 'passport';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import {getMyProfile} from '../../components/facebook';
import {attachS3Link} from '../helper';

const OAUTH_CREDENTIALS = {
     clientID: config.facebook.clientID,
     clientSecret: config.facebook.clientSecret,
     callbackURL: config.facebook.callbackURL,
     profileFields: ['displayName', 'emails']
};

export function setup(User) {
     passport.use(new FacebookStrategy(OAUTH_CREDENTIALS,
          async function (accessToken, refreshToken, profile, done) {
               try {
                    let user = await User.findOne({'facebook.id': profile.id});
                    if (user) {
                         return done(null, user);
                    }
                    let fullProfile = await getMyProfile(accessToken);
                    let newFbUser = {
                         firstName: fullProfile.first_name,
                         lastName: fullProfile.last_name,
                         about: fullProfile.about,
                         gender: fullProfile.gender,
                         email: fullProfile.email,
                         role: 'user',
                         provider: 'facebook',
                         facebook: profile._json,
                         imageUrl: _.get(fullProfile, 'picture.data.url')
                    };
                    user = new User(newFbUser);
                    if (user.imageUrl) user.imageUrl = await attachS3Link(user, 'facebook');
                    await user.save();
                    done(null, user);
               } catch (err) {
                    done(err);
               }
          }
     ));
}
