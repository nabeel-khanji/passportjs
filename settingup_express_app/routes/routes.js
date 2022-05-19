const express = require("express");
const passport = require("passport");
const router = express.Router();
router.get("/", (req, res) => {
  res.render("home");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});
// router.get("/google",passport.authenticate("google",{
//   scope:['profile']
// }));

module.exports = router;
