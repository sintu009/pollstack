const Template = require("../models/Template");

// Default templates seeded for all users
const DEFAULT_TEMPLATES = [
  {
    title: "Customer Satisfaction",
    description: "Measure customer happiness with your product or service.",
    isPublic: true,
    questions: [
      { title: "How satisfied are you with our product?", options: [{ text: "Very Satisfied" }, { text: "Satisfied" }, { text: "Neutral" }, { text: "Dissatisfied" }], isMandatory: true },
      { title: "How likely are you to recommend us?", options: [{ text: "Very Likely" }, { text: "Likely" }, { text: "Unlikely" }, { text: "Never" }], isMandatory: true },
      { title: "How would you rate our customer support?", options: [{ text: "Excellent" }, { text: "Good" }, { text: "Average" }, { text: "Poor" }], isMandatory: true },
      { title: "What could we improve?", options: [{ text: "Speed" }, { text: "Quality" }, { text: "Price" }, { text: "Support" }], isMandatory: false },
      { title: "Overall experience?", options: [{ text: "Amazing" }, { text: "Good" }, { text: "Okay" }, { text: "Bad" }], isMandatory: true },
    ],
  },
  {
    title: "Event Feedback",
    description: "Collect feedback after events, workshops, or webinars.",
    isPublic: true,
    questions: [
      { title: "How would you rate the event overall?", options: [{ text: "Excellent" }, { text: "Good" }, { text: "Average" }, { text: "Poor" }], isMandatory: true },
      { title: "Was the content relevant to you?", options: [{ text: "Very Relevant" }, { text: "Somewhat" }, { text: "Not Really" }, { text: "Not at All" }], isMandatory: true },
      { title: "How was the speaker/presenter?", options: [{ text: "Outstanding" }, { text: "Good" }, { text: "Average" }, { text: "Below Average" }], isMandatory: true },
      { title: "Would you attend again?", options: [{ text: "Definitely" }, { text: "Maybe" }, { text: "Unlikely" }, { text: "No" }], isMandatory: true },
      { title: "How did you hear about this event?", options: [{ text: "Email" }, { text: "Social Media" }, { text: "Friend" }, { text: "Website" }], isMandatory: false },
    ],
  },
  {
    title: "Employee Engagement",
    description: "Understand team morale and workplace satisfaction.",
    isPublic: true,
    questions: [
      { title: "How happy are you at work?", options: [{ text: "Very Happy" }, { text: "Happy" }, { text: "Neutral" }, { text: "Unhappy" }], isMandatory: true },
      { title: "Do you feel valued by your team?", options: [{ text: "Always" }, { text: "Often" }, { text: "Sometimes" }, { text: "Rarely" }], isMandatory: true },
      { title: "How is your work-life balance?", options: [{ text: "Excellent" }, { text: "Good" }, { text: "Fair" }, { text: "Poor" }], isMandatory: true },
      { title: "Would you recommend this company?", options: [{ text: "Strongly Yes" }, { text: "Yes" }, { text: "Maybe" }, { text: "No" }], isMandatory: true },
    ],
  },
  {
    title: "Product Feature Poll",
    description: "Let users vote on upcoming features or improvements.",
    isPublic: true,
    questions: [
      { title: "Which feature matters most to you?", options: [{ text: "Dark Mode" }, { text: "Mobile App" }, { text: "API Access" }, { text: "Integrations" }], isMandatory: true },
      { title: "How often do you use our product?", options: [{ text: "Daily" }, { text: "Weekly" }, { text: "Monthly" }, { text: "Rarely" }], isMandatory: true },
      { title: "What would make you use it more?", options: [{ text: "Better UX" }, { text: "More Features" }, { text: "Lower Price" }, { text: "Better Support" }], isMandatory: false },
    ],
  },
];

// Get all templates (public + user's own)
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({
      $or: [{ isPublic: true }, { creator: req.user.id }],
    }).sort({ createdAt: -1 });

    // If no templates exist, seed defaults
    if (templates.length === 0) {
      const seeded = await Template.insertMany(
        DEFAULT_TEMPLATES.map((t) => ({ ...t, creator: req.user.id }))
      );
      return res.json(seeded);
    }

    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new template
exports.createTemplate = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    if (!title || !questions?.length)
      return res.status(400).json({ message: "Title and questions required" });

    const template = await Template.create({
      creator: req.user.id,
      title,
      description,
      questions,
      isPublic: false,
    });
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single template
exports.getTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete template (only own)
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findOneAndDelete({ _id: req.params.id, creator: req.user.id });
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json({ message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
