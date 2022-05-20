const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//Role model
const Role = require("../model/Role");
const User = require("../model/User");

router.get('/users', function(req, res) {
    User.find({}).exec(function(err, produtos) {
        if (err) throw err;
        res.render('users', { data: produtos});
    });
});

router.get('/roles', function(req, res) {
    Role.find({}).exec(function(err, produtos) {
        if (err) throw err;
        res.render('roles', { data: produtos});
    });
});



//Role Page
router.get("/addrole", (req, res) => {
  res.render("addrole");
});

//RoleAdd Handle
router.post("/roles", (req, res) => {
  const { name, slug } = req.body;
  let errors = [];
  //Check required fields
  if (!name) {
    console.log("Please fill in all fields");
    errors.push({ msg: "Please fill in all fields" });
  }
  if (errors.length > 0) {
    res.render("roles", {
      errors,
      name,
      slug,
    });
  } else {
    // Validation passed
    Role.findOne({
      slug: name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "_")
        .replace(/^-+/, "")
        .replace(/-+$/, ""),
    })
      .then((user) => {
        if (user) {
          //User exists
          errors.push({ msg: "Role is already registered" });
          res.render("roles", {
            errors,
            name,
            slug,
          });
        } else {
          const newRole = new Role({
            name,
            slug,
          });
          // Set password to hashed
          newRole.slug = newRole.name
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "_")
            .replace(/^-+/, "")
            .replace(/-+$/, "");
          // Save role
          newRole
            .save()
            .then((user) => {
              req.flash("success_nsg", "Role successfully added");
              res.redirect("/dashboard");
            })
            .catch((err) => console.log(err));
        }
      })
      .catch();
  }
});

module.exports = router;
