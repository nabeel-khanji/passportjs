const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const crypto = require("crypto");
const sendEmail = require("../util/sendEmail");

//User model
const User = require("../model/User");
const Token = require("../model/Token");

//Login Page
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

//Register Page
router.get("/forgetpassword", forwardAuthenticated, (req, res) => {
  res.render("forgetpassword");
});

//Register Handle
router.post("/forgetpassword", (req, res) => {
  const { email } = req.body;
  let errors = [];
  //Check required fields
  if (!email) {
    console.log("Please fill this field");
    errors.push({ msg: "Please fill this field" });
  }
  //Check passwords match
  // if (password !== password2) {
  //   console.log("Passwords do not match");
  //   errors.push({ msg: "Passwords do not match" });
  // }
  //Check pass length
  // if (password.length < 6) {
  //   console.log("Password should be at least 6 characters");
  //   errors.push({ msg: "Password should be at least 6 characters" });
  // }

  if (errors.length > 0) {
    res.render("forgetpassword", {
      errors,
      // name,
      email,
      // password,
      // password2,
    });
  } else {
    User.findOne({ email })
      .then((user) => {
        Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        })
          .save()
          .then((token) => {
            console.log("token created");
            console.log(token);
            const url = `${process.env.BASE_URL}/users/${user._id}/resetpassword/${token.token}`;
            console.log(url);
            // console.log(url);
            sendEmail(user.email, "Forget Password", url)
              .then((sendEmail) => {
                req.flash("success_nsg", "Reset password email send");
                res.redirect("/users/forgetpassword");
                console.log(sendEmail);
              })
              .catch((err) => {
                console.log("email send failed");
                console.log(err);
              });
          })
          .catch((err) => {
            console.log("token not created");
            console.log(err);
          });
      })
      .catch();

    // Validation passed
    // User.findOne({ email: email })
    //   .then((user) => {
    // if (user) {
    //   //User exists
    //   errors.push({ msg: "Email is already registered" });
    //   res.render("register", {
    //     errors,
    //     name,
    //     email,
    //     password,
    //     password2,
    //   });
    // } else {
    //   const newUser = new User({
    //     name,
    //     email,
    //     password,
    //   });
    //   //Hash Password
    //   bcrypt.genSalt(10, (err, salt) => {
    //     bcrypt.hash(newUser.password, salt, (err, hash) => {
    //       if (err) throw err;
    //       // Set password to hashed
    //       newUser.password = hash;
    //       // Save user
    //       newUser
    //         .save()
    //         .then((user) => {
    //           req.flash(
    //             "success_nsg",
    //             "You are now registered and can login"
    //           );
    //           res.redirect("/users/login");
    //         })
    //         .catch((err) => console.log(err));
    //     });
    //   });
    // }
    // })
    // .catch();
  }
});

//Login handle
router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user.verified) {
        

        passport.authenticate("local", {
          successRedirect: "/dashboard",
          failureRedirect: "/users/login",  
          failureFlash: true,
        })(req, res, next);
      } else {
        Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        })
          .save()
          .then((token) => {
            console.log("token created");
            console.log(token);
            const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
            console.log(url);
            // console.log(url);
            sendEmail(user.email, "Verify Email", url)
              .then((sendEmail) => {
                console.log("email send successfully");
                console.log(sendEmail);
              })
              .catch((err) => {
                console.log("email send failed");
                console.log(err);
              });
          })
          .catch((err) => {
            console.log("token not created"); console.log(err);
          }); 
        req.flash("error", "User not verified");
        res.redirect("/users/login");
      }
    })
    .catch((err) => console.log(err));
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_nsg", "You are logged out");
  res.redirect("/users/login");
});

router.get("/:id/resetpassword/:token", async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.params.token);

    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).send("Invalid link");
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("invalid link");
    // await User.findByIdAndUpdate({ _id: user._id });
    await token.remove();
    res.render("resetpassword", {
      _id: req.params.id,
      token: req.params.token,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/:id/resetpassword/:token", (req, res) => {
  const _id = req.params.id;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      // if (err) throw err;
      // Set password to hashed
      User.findByIdAndUpdate(
        { _id: _id },
        {
          password: hash,
        },
        {
          new: true,
        }
      )
        .then((user) => {
          req.flash("success_nsg", "Password Change successfully added");
          res.redirect("/users/login");
        })
        .catch((err) => {
          return res.status(404).send();
        });
    });
  });
});

router.get("/:id/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).send("Invalid link");
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("invalid link");
    await User.findByIdAndUpdate({ _id: user._id }, { verified: true });
    await token.remove();
    req.flash("success_nsg", "Email Verfied successfully");
    res.redirect("/users/login");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
