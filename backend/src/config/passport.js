const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const env = require("./env");
const googleService = require("../services/google.service");

function configurePassport() {
  if (!env.googleClientId || !env.googleClientSecret) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await googleService.findOrCreateGoogleUser(profile);
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
}

module.exports = configurePassport;
