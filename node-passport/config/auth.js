export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // res.redirect("/dashboard");
    return next();
  }
  req.flash("error_msg", "Please login to view this resource");
  res.redirect("/users/login");
}
export function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/dashboard");
}
