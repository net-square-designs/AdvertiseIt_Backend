import passport from 'passport';
import { Strategy } from 'passport-facebook';
import dotenv from 'dotenv';

dotenv.config();

const passportConfig = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(new Strategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'https://advertiseit-backend.herokuapp.com/api/v1/auth/callback',
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'photos', 'email', 'friends']
  }, ((req, accessToken, refreshToken, profile, done) => {
    req.socialUser = profile;
    done(null, profile);
  })));
};

export default passportConfig;
