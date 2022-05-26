const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

//Role model
const Role = require("../model/Role");

//User model
const User = require("../model/User");

// User Table
router.get("/users", ensureAuthenticated, function (req, res) {
  User.find({}).exec(function (err, produtos) {
    if (err) throw err;
    res.render("users", { data: produtos, role: req.user.role });
  });
});

// Role Table
router.get("/roles", ensureAuthenticated, function (req, res) {
  Role.find({}).exec(function (err, produtos) {
    if (err) throw err;
    res.render("roles", { data: produtos, role: req.user.role });
  });
});

//Role Page
router.get("/addrole", ensureAuthenticated, (req, res) => {
  res.render("addrole", {
    role: req.user.role,
  });
});

//Role Page
router.get("/adduser", ensureAuthenticated, (req, res) => {
  Role.find({}).exec(function (err, roles) {
    if (err) throw err;
    res.render("adduser", {
      role: req.user.role,
      data: roles,
    });
  });
});
router.get("/editrole/:id", ensureAuthenticated, (req, res) => {
  const _id = req.params.id;
  Role.findById(_id)
    .then((role) => {
      res.render("addrole", {
        role: role._id,
        name: role.name,
        _id: role._id,
        user_can_create: role.permissions.role_can_create,
        user_can_read: role.permissions.role_can_read,
        user_can_update: role.permissions.role_can_update,
        user_can_delete: role.permissions.role_can_delete,
        role_can_create: role.permissions.role_can_create,
        role_can_read: role.permissions.role_can_read,
        role_can_update: role.permissions.role_can_update,
        role_can_delete: role.permissions.role_can_delete,
        update: "Update",
      });
    })
    .catch();
});
router.post("/editrole/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Role.findByIdAndUpdate(
      _id,
      {
        role: req.user.role,
        name: req.body.name,
        slug: req.body.name
          .toString()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "_")
          .replace(/^-+/, "")
          .replace(/-+$/, ""),
        permissions: {
          role: {
            can_create: req.body.role_can_create ?? false,
            can_read: req.body.role_can_read ?? false,
            can_update: req.body.role_can_update ?? false,
            can_delete: req.body.role_can_delete ?? false,
          },
          user: {
            can_create: req.body.user_can_create ?? false,
            can_read: req.body.user_can_read ?? false,
            can_update: req.body.user_can_update ?? false,
            can_delete: req.body.user_can_delete ?? false,
          },
        },
      },
      {
        new: true,
      }
    );
    console.log(result.role);
    if (!result) {
      return res.status(404).send();
    } else {
      req.flash("success_msg", "Role Updated successfully added");
      res.redirect("/dashboard");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/edituser/:id", ensureAuthenticated, (req, res) => {
  const _id = req.params.id;

  User.findById(_id)
    .then((user) => {
      Role.find({}).exec(function (err, roles) {
        if (err) throw err;
        console.log(user.role);
        res.render("adduser", {
          role: user.role,
          name: user.name,
          role: req.user.role,
          email: user.email,
          // password: user.password,
          // password2: user.password2,
          _id: user._id,
          update: "Update",
          data: roles,
        });
      });
    })
    .catch();
});
router.post("/edituser/:id", (req, res) => {
  const _id = req.params.id;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      // if (err) throw err;
      // Set password to hashed
      User.findByIdAndUpdate(
        _id,
        {
          name: req.body.name,
          email: req.body.email,
          password: hash,
          password2: hash,
          role: req.body.role,
        },
        {
          new: true,
        }
      )
        .then((user) => {
          req.flash("success_msg", "User Updated successfully added");
          res.redirect("/dashboard/users");
        })
        .catch((err) => {
          return res.status(404).send();
        });
    });
  });
});

//Role Add Handle
router.post("/addrole", ensureAuthenticated, (req, res) => {
  const {
    name,
    slug,
    user_can_create,
    user_can_read,
    user_can_update,
    user_can_delete,
    role_can_create,
    role_can_read,
    role_can_update,
    role_can_delete,
  } = req.body;
  let errors = [];

  //Check required fields
  if (!name) {
    console.log("Please fill in all fields");
    errors.push({ msg: "Please fill in all fields" });
  }
  if (errors.length > 0) {
    res.render("addrole", {
      role: req.user.role,
      errors,
      name,
      slug,
      user_can_create,
      user_can_read,
      user_can_update,
      user_can_delete,
      role_can_create,
      role_can_read,
      role_can_update,
      role_can_delete,
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
          res.render("addrole", {
            role: req.user.role,
            errors,
            name,
            slug,
            user_can_create,
            user_can_read,
            user_can_update,
            user_can_delete,
            role_can_create,
            role_can_read,
            role_can_update,
            role_can_delete,
          });
        } else {
          const newRole = new Role({
            name,
            slug,
            permissions: {
              user: {
                can_create: user_can_create ?? false,
                can_read: user_can_read ?? false,
                can_update: user_can_update ?? false,
                can_delete: user_can_delete ?? false,
              },
              role: {
                can_create: role_can_create ?? false,
                can_read: role_can_read ?? false,
                can_update: role_can_update ?? false,
                can_delete: role_can_delete ?? false,
              },
            },
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
              req.flash("success_msg", "Role successfully added");
              res.redirect("/dashboard");
            })
            .catch((err) => console.log(err));
        }
      })
      .catch();
  }
});
//Role Add Handle
router.post("/adduser", ensureAuthenticated, (req, res) => {
  const { name, email, slug, password, password2, role } = req.body;
  console.log(req.body);
  let errors = [];

  //Check required fields
  if (!name || !email || !password || !password2 || !role) {
    console.log("Please fill in all fields");
    errors.push({ msg: "Please fill in all fields" });
  } //Check passwords match
  if (password !== password2) {
    console.log("Passwords do not match");
    errors.push({ msg: "Passwords do not match" });
  }
  if (password.length < 6) {
    console.log("Password should be at least 6 characters");
    errors.push({ msg: "Password should be at least 6 characters" });
  }
  if (errors.length > 0) {
    Role.find({}).exec(function (err, roles) {
      if (err) throw err;
      res.render("adduser", {
        role: req.user.role,
        errors,
        name,
        slug,
        email,
        password,
        password2,
        data: roles,
      });
    });
  } else {
    // Validation passed
    User.findOne({
      email: email,
    })
      .then((user) => {
        if (user) {
          //User exists
          errors.push({ msg: "User is already registered" });
          Role.find({}).exec(function (err, roles) {
            if (err) throw err;
            res.render("adduser", {
              role: req.user.role,
              errors,
              name,
              slug,
              email,
              password,
              password2,
              data: roles,
            });
          });
        } else {
          const newUser = new User({
            name,
            slug,
            email,
            password,
            role,
          });

          //Hash Password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hashed
              newUser.password = hash;
              // Save user
              newUser
                .save()
                .then((user) => {
                  req.flash("success_msg", "Your user can now login");
                  res.redirect("/dashboard");
                })
                .catch((err) => console.log(err));
            });
          });
        }
      })
      .catch();
  }
});
router.get("/roles/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Role.findByIdAndDelete(_id);
    if (!result) {
      return res.status(404).send();
    } else {
      req.flash("success_msg", "Role Deleted successfully added");
      res.redirect("/dashboard/roles");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await User.findByIdAndDelete(_id);
    if (!result) {
      return res.status(404).send();
    } else {
      req.flash("success_msg", "Users Deleted successfully added");
      res.redirect("/dashboard/users");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
