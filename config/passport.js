module.exports = function(passport) {

  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var secrets = require('./secrets.js');

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    done(null, { id : "1", name : "Hagen" });
  });

  passport.use(new GoogleStrategy({
      clientID: secrets.google.clientID,
      clientSecret: secrets.google.clientSecret,
      callbackURL : secrets.google.callbackURL,
      profile : true
    },
    function(token, refreshToken, profile, done) {
      return done(null, profile);
    }
  ));
};
