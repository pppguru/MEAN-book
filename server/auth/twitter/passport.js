import passport from 'passport';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import {attachS3Link} from '../helper';

const OAUTH_CREDENTIALS = {
     consumerKey: config.twitter.clientID,
     consumerSecret: config.twitter.clientSecret,
     callbackURL: config.twitter.callbackURL
};

export function setup(User) {
     passport.use(new TwitterStrategy(OAUTH_CREDENTIALS,
          async function (token, tokenSecret, profile, done) {
               profile._json.id = `${profile._json.id}`;
               profile.id = `${profile.id}`;
               try {
                    let user = await User.findOne({'twitter.id': profile.id});
                    if (user) {
                         return done(null, user);
                    }
                    let newTwitterUser = {
                         firstName: _.first(profile.displayName.split(' ')),
                         lastName: _.last(profile.displayName.split(' ')),
                         gender: profile.gender,
                         email: _.get(_.first(profile.emails), 'value'),
                         role: 'user',
                         provider: 'twitter',
                         twitter: _.pick(profile._json, ['name', 'id', 'screen_name', 'verified']),
                         imageUrl: _.get(_.first(profile.photos), 'value')
                    };
                    user = new User(newTwitterUser);
                    if (user.imageUrl) user.imageUrl = await attachS3Link(user, 'twitter');
                    await user.save();
                    done(null, user);
               } catch (err) {
                    done(err);
               }
          }
     ));
}
