const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
passport.use(
  new GoogleStrategy({
    clientID:
      "447852305885-5od3gpd65f1p8tmv5ectbj2ht53t8nrr.apps.googleusercontent.com",
    clientSecret: "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",
    //option for google strat
  }),
  () => {
    //passport callback function
  }
);
