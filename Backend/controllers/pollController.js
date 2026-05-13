const Poll = require("../models/Poll");
const { nanoid } = require("nanoid");
const { broadcast } = require("../websocket/ws");

exports.createPoll = async (req, res) => {
  try {
    const { title, description, questions, isAnonymous, expiresAt } = req.body;
    if (!title || !questions?.length || !expiresAt)
      return res.status(400).json({ message: "Title, questions and expiresAt required" });

    const poll = await Poll.create({
      creator: req.user.id,
      title,
      description,
      questions,
      isAnonymous,
      expiresAt,
      shareLink: nanoid(10),
    });
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyPolls = async (req, res) => {
  const polls = await Poll.find({ creator: req.user.id }).sort({ createdAt: -1 });
  res.json(polls);
};

exports.getPollByLink = async (req, res) => {
  const poll = await Poll.findOne({ shareLink: req.params.link });
  if (!poll) return res.status(404).json({ message: "Poll not found" });

  // Auto-deactivate if expired (but don't touch published polls)
  if (!poll.isPublished && (poll.isExpired() || !poll.isActive)) {
    poll.isActive = false;
    await poll.save();
  }

  res.json(poll);
};

exports.publishPoll = async (req, res) => {
  const poll = await Poll.findOne({ _id: req.params.id, creator: req.user.id });
  if (!poll) return res.status(404).json({ message: "Poll not found" });

  poll.isPublished = true;
  poll.isActive = false;
  await poll.save();

  broadcast(poll._id.toString(), { type: "POLL_PUBLISHED", pollId: poll._id });
  res.json(poll);
};

exports.toggleActive = async (req, res) => {
  const poll = await Poll.findOne({ _id: req.params.id, creator: req.user.id });
  if (!poll) return res.status(404).json({ message: "Poll not found" });

  poll.isActive = !poll.isActive;
  await poll.save();
  res.json(poll);
};
