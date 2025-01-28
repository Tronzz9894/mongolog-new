const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userEmail: String,
  score: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
