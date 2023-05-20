const passport = require("passport");
const { Strategy } = require("passport-local");
const User = require("../models/user");
const { verifyPassword } = require("../util/password");

passport.serializeUser((user, done) => {
  console.log("serializing user");
  console.log(user.id);
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  console.log("deserializing user");
  console.log(userId);
  done(null, userId);
});

passport.use(
  new Strategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      const user = await User.findOne({ username });
      if (!user) {
        req.statusCode = 400;
        done(new Error("User does not exist"));
      }
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        req.statusCode = 401;
        done(new Error("Invlid credentials"));
      } else {
        done(null, user);
      }
    }
  )
);
