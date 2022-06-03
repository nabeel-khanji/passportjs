var mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  slug: {
    type: String,
  },
  role: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  address: { type: String },age: { type: Number },
  image: {
    data: String,
    contentType: String,
  },
  position: { type: String },
  mobile: { type: String },
  github: { type: String },
  twitter: { type: String },
  website: { type: String },
  company: { type: String },
  linkedin: { type: String },

  date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
