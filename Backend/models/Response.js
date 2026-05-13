const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedOption: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const responseSchema = new mongoose.Schema(
  {
    poll: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
    respondent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    fingerprint: { type: String, required: true },
    answers: [answerSchema],
  },
  { timestamps: true }
);

// One response per fingerprint per poll
responseSchema.index({ poll: 1, fingerprint: 1 }, { unique: true });

module.exports = mongoose.model("Response", responseSchema);
