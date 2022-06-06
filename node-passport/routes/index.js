import express from "express";
const indexRouter = express.Router();
import { ensureAuthenticated, forwardAuthenticated } from "../config/auth.js";
import Role from "../model/Role.js";
import Route from "../model/Route.js";
// Welcome Page
indexRouter.get("/", forwardAuthenticated, (req, res) => {
  res.render("welcome");
});
// Dashboard Page
indexRouter.get("/dashboard", ensureAuthenticated, (req, res) => {
  console.log(req.user);
  Role.findOne({ _id: req.user.role }).then((role) => {
    Route.find({})
      .then((route) => {
        res.render("dashboard", {
          layout: "LayoutA",
          role: role.permissions,
          name: req.user.name,
          route: route,
        });
      })
      .catch((err) => console.log(err));
  });
});

export default indexRouter;
