const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  userType: { type: String, default: "user" }, // 'user' or 'admin'
});

module.exports = mongoose.model("User", userSchema);
