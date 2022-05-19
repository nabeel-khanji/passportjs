const express = require("express");
const hbs= require("hbs");
const router = require("../routes/routes");
// const passportSetup= require("../config/passport-setup")
const path = require("path");
const app = express();
const port = process.env.PORT || 8000;
const view_path = path.join(__dirname, "../template/view");
const partial_path = path.join(__dirname, "../template/partials");
const public_path = path.join(__dirname, "../public");
app.set("view engine", "hbs");
app.set("views", view_path);
app.use(express.static(public_path));
app.use(router);
hbs.registerPartials(partial_path);
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
