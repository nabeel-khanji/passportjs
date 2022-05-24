const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Load User Model
const User = require("../model/User");
const Role = require("../model/Role");
module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        //Match User
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "That email is not registered",
              });
            }
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                console.log(user.role);
                console.log(user);
                // Role.findOne({slug:"super_admin"}).then(role =>{
                //   console.log(role);
                //   if (user.role !=role._id ) {
                    return done(null, user);
                  // }else{
                  //   return done(null, false, {
                  //     message: "Not a super admin",
                  //   });
                  // }
                // }).catch(
              // (err)=>{
              //   return done(null, false, {
              //     message: "Not a super admin",
              //   });
              // }
              //   )
             
              } else {
                return done(null, false, {
                  message: "Password incorrect",
                });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      return done(err, user);
    });
  });
};
