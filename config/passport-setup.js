const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_STRATEGY_CLIENT_ID,
      clientSecret: process.env.GOOGLE_STRATEGY_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      const currentUser = await User.findOne({ googleId: profile.id });

      if (currentUser) {
        done(null, currentUser);
      } else {
        const newUser = await new User({
          googleId: profile.id,
          username: profile.displayName,
          thumbnail: profile._json.image.url,
        }).save();

        done(null, newUser);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  console.log('des', user);
  done(null, user);
});
