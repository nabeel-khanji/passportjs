import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import expressLayotus from "express-ejs-layouts";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import { join } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import Report from "../model/Report.js";
const app = express();
const port = process.env.PORT || 5000;

// Passport config
import passpoertconfig from "../config/passport.js";
passpoertconfig(passport);

// require("../config/passport")(passport);

//DB Config
import { MongoURI as db } from "../config/keys.js";

//Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log(`connection successfull ...`))
  .catch((err) => console.log(err));

//EJS
app.use(expressLayotus);
app.set("view engine", "ejs");

//Body Parser
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// app.use((req, res, next) => {
//   Report({ route: req.headers.referer.replace("http://localhost:5000", "") })
//     .save()
//     .then(console.log("data save "))
//     .catch();
//   next();
// });

//Public Path Setup
app.use(express.static(join(__dirname, "../public")));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_nsg = req.flash("success_nsg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
import indexRouter from "../routes/index.js";
import authRouter from "../routes/auth.js";
import dashboardRouter from "../routes/dashboard.js";

//Routes
app.use("/", indexRouter);
app.use("/users", authRouter);
app.use("/dashboard", dashboardRouter);

app.listen(port, () => {
  console.log(`listening to the port: ${port}!`);
});
1