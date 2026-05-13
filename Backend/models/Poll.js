const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  options: [optionSchema],
  isMandatory: { type: Boolean, default: true },
});

const pollSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    questions: [questionSchema],
    isAnonymous: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: false },
    shareLink: { type: String, unique: true },
  },
  { timestamps: true }
);

pollSchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

module.exports = mongoose.model("Poll", pollSchema);
