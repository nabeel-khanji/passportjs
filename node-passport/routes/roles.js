const express = require("express");
const router = express.Router();

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
  res.render("adduser", {
    role: req.user.role,
  });
});
router.get("/editrole/:id", ensureAuthenticated, (req, res) => {
  const _id = req.params.id;
  const result = Role.findById(_id)
    .then((user) => {
      res.render("addrole", {
        role: user._id,
        name: user.name,
        _id: user._id,
        can_create: user.can_create,
        can_read: user.can_read,
        can_update: user.can_update,
        can_delete: user.can_delete,
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
        can_create: req.body.can_create,
        can_read: req.body.can_read,
        can_update: req.body.can_update,
        can_delete: req.body.can_delete,
      },
      {
        new: true,
      }
    );
    console.log(result.role);
    if (!result) {
      return res.status(404).send();
    } else {
      req.flash("success_nsg", "Role Updated successfully added");
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
      res.render("adduser", {
        role: user.role,
        name: user.name,
        role: req.user.role,

        email: user.email,
        password: user.password,
        password2: user.password2,
        _id: user._id,
        update: "Update",
      });
    })
    .catch();
});
router.post("/edituser/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await User.findByIdAndUpdate(
      _id,
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2,
      },
      {
        new: true,
      }
    );
    if (!result) {
      return res.status(404).send();
    } else {
      req.flash("success_nsg", "User Updated successfully added");
      res.redirect("/dashboard/users", {
        role: req.user.role,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

//Role Add Handle
router.post("/addrole", ensureAuthenticated, (req, res) => {
  const { name, slug, can_create, can_read, can_update, can_delete } = req.body;
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
      can_create,
      can_read,
      can_update,
      can_delete,
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
            can_create,
            can_read,
            can_update,
            can_delete,
          });
        } else {
          const newRole = new Role({
            name,
            slug,
            permissions: {
              role: { can_create, can_read, can_update, can_delete },
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
              req.flash("success_nsg", "Role successfully added");
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
  const { name, email, slug, password, password2 } = req.body;
  console.log(req.body);
  let errors = [];

  //Check required fields
  if (!name || !email || !password || !password2) {
    console.log("Please fill in all fields");
    errors.push({ msg: "Please fill in all fields" });
  }
  if (errors.length > 0) {
    res.render("adduser", {
      role: req.user.role,
      errors,
      name,
      slug,
      email,
      password,
      password2,
    });
  } else {
    // Validation passed
    User.findOne({
      slug: email
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
          errors.push({ msg: "User is already registered" });
          res.render("adduser", {
            role: req.user.role,
            errors,
            name,
            slug,
            email,
            password,
            password2,
          });
        } else {
          const newUser = new User({
            name,
            slug,
            email,
            password,
            password2,
          });

          // Set password to hashed
          newUser.slug = newUser.email
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "_")
            .replace(/^-+/, "")
            .replace(/-+$/, "");
          // Save role
          newUser
            .save()
            .then((user) => {
              req.flash("success_nsg", "User successfully added");
              res.redirect("/dashboard");
            })
            .catch((err) => console.log(err));
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
      req.flash("success_nsg", "Role Deleted successfully added");
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
      req.flash("success_nsg", "Users Deleted successfully added");
      res.redirect("/dashboard/users");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
