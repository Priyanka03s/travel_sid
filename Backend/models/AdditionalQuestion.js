// models/AdditionalQuestion.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, default: "text" },
});

module.exports = mongoose.model("AdditionalQuestion", questionSchema);
