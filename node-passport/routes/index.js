const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Role = require("../model/Role");
const Route = require("../model/Route");
// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => {
  res.render("welcome");
});
// Dashboard Page
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  console.log(req.user);
  Role.findOne({ _id: req.user.role }).then((role) => {
    Route.find({}).then(route=>{
  
      res.render("dashboard", {  
        layout:"LayoutA",
        role: role.permissions,
        name: req.user.name,
        route:route
      });
    }).catch(err=>console.log(err));
   
  });
});

module.exports = router;
