const Response = require("../models/Response");
const Poll = require("../models/Poll");
const { broadcast } = require("../websocket/ws");

// Helper: compute question-wise analytics
async function computeAnalytics(poll, pollId) {
  const responses = await Response.find({ poll: pollId });
  const totalResponses = responses.length;

  const questionSummaries = poll.questions.map((q) => {
    const optionCounts = {};
    q.options.forEach((opt) => {
      optionCounts[opt._id.toString()] = { text: opt.text, count: 0 };
    });

    responses.forEach((r) => {
      const answer = r.answers.find((a) => a.questionId.toString() === q._id.toString());
      if (answer && optionCounts[answer.selectedOption.toString()])
        optionCounts[answer.selectedOption.toString()].count++;
    });

    return { questionId: q._id, title: q.title, options: Object.values(optionCounts) };
  });

  return { totalResponses, questionSummaries };
}

// Generate fingerprint from request
function getFingerprint(req) {
  // If authenticated, use userId
  if (req.user?.id) return `user_${req.user.id}`;
  // For anonymous, use IP + User-Agent combo
  const ip = req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "unknown";
  const ua = req.headers["user-agent"] || "unknown";
  return `anon_${ip}_${ua}`;
}

exports.submitResponse = async (req, res) => {
  try {
    const { pollId, answers } = req.body;
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    if (!poll.isActive || poll.isExpired())
      return res.status(400).json({ message: "Poll is no longer accepting responses" });

    const fingerprint = getFingerprint(req);

    // Check if already submitted
    const existing = await Response.findOne({ poll: pollId, fingerprint });
    if (existing)
      return res.status(409).json({ message: "You have already submitted a response to this poll" });

    // Validate mandatory questions
    const mandatoryIds = poll.questions.filter((q) => q.isMandatory).map((q) => q._id.toString());
    const answeredIds = answers.map((a) => a.questionId);
    const missing = mandatoryIds.filter((id) => !answeredIds.includes(id));
    if (missing.length)
      return res.status(400).json({ message: "All mandatory questions must be answered" });

    const response = await Response.create({
      poll: pollId,
      respondent: req.user?.id || null,
      fingerprint,
      answers,
    });

    // Broadcast full live analytics + individual submission details
    const analytics = await computeAnalytics(poll, pollId);
    broadcast(pollId, {
      type: "NEW_RESPONSE",
      totalResponses: analytics.totalResponses,
      questionSummaries: analytics.questionSummaries,
      submittedAt: new Date().toISOString(),
      latestAnswers: answers.map((a) => {
        const question = poll.questions.find((q) => q._id.toString() === a.questionId);
        const option = question?.options.find((o) => o._id.toString() === a.selectedOption);
        return {
          question: question?.title || "Unknown",
          selected: option?.text || "Unknown",
        };
      }),
    });

    res.status(201).json(response);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "You have already submitted a response to this poll" });
    res.status(500).json({ message: err.message });
  }
};

// Live progress broadcast (user answering question by question)
exports.broadcastProgress = async (req, res) => {
  try {
    const { pollId, questionId, selectedOption } = req.body;
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const question = poll.questions.find((q) => q._id.toString() === questionId);
    const option = question?.options.find((o) => o._id.toString() === selectedOption);

    broadcast(pollId, {
      type: "ANSWER_PROGRESS",
      questionTitle: question?.title || "Unknown",
      selectedText: option?.text || "Unknown",
      questionIndex: poll.questions.findIndex((q) => q._id.toString() === questionId) + 1,
      totalQuestions: poll.questions.length,
      timestamp: new Date().toISOString(),
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check if user already responded to a poll
exports.checkStatus = async (req, res) => {
  try {
    const fingerprint = getFingerprint(req);
    const existing = await Response.findOne({ poll: req.params.pollId, fingerprint });
    res.json({ hasResponded: !!existing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const poll = await Poll.findOne({ _id: req.params.pollId, creator: req.user.id });
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const analytics = await computeAnalytics(poll, req.params.pollId);
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPublicResults = async (req, res) => {
  const poll = await Poll.findOne({ shareLink: req.params.link, isPublished: true });
  if (!poll) return res.status(404).json({ message: "Results not published" });

  const analytics = await computeAnalytics(poll, poll._id);
  res.json({ poll: { title: poll.title, description: poll.description }, ...analytics });
};
