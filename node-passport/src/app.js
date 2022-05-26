var mongoose = require("mongoose");
const express = require("express");
const expressLayotus = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

// Passport config
require("../config/passport")(passport);

//DB Config
const db = require("../config/keys").MongoURI;

//Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log(`connection successfull ...`))
  .catch((err) => console.log(err));

//EJS
app.use(expressLayotus);
app.set("view engine", "ejs");

//Body Parser
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Public Path Setup
app.use(express.static(path.join(__dirname,"../public")));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/", require("../routes/index"));
app.use("/users", require("../routes/users"));
app.use("/dashboard", require("../routes/roles"));


app.listen(port, () => {
  console.log(`listening to the port: ${port}!`);
});
