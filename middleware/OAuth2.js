const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const dummy = require("../models/dumySchema");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_LOGIN_CALLBACK,
    },
    async function (accsessToken, refreshToken, profile, done) {
      const data = profile._json;
      try {
        dummy.findOrCreate(
          { googleId: profile.id },
          { name: data.given_name, surname: data.family_name },
          (err, user) => {
            return done(err, user);
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
