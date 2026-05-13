import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  HiArrowLeft,
  HiArrowRight,
  HiCheck,
  HiPlus,
  HiTrash,
  HiLockClosed,
  HiGlobe,
  HiClock,
  HiClipboardList,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi";
import { Card, Button, Badge, ProgressBar } from "../components/ui";
import { createPoll } from "../store/slices/pollSlice";
import { createPollSchema } from "../validation/pollSchema";

const STEPS = [
  { title: "Poll Details", description: "Basic information" },
  { title: "Questions", description: "Add your questions" },
  { title: "Review", description: "Confirm & create" },
];

export default function CreatePollPage({ onClose }) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(false);
  const [createdPoll, setCreatedPoll] = useState(null);
  const [copied, setCopied] = useState(false);

  // Step 1: Poll Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Step 2: Questions
  const [questions, setQuestions] = useState([
    { title: "", options: [{ text: "" }, { text: "" }], isMandatory: true },
  ]);

  const progress = ((step + 1) / STEPS.length) * 100;

  // Question helpers
  const addQuestion = () => {
    setQuestions([...questions, { title: "", options: [{ text: "" }, { text: "" }], isMandatory: true }]);
  };

  const removeQuestion = (qi) => {
    if (questions.length > 1) setQuestions(questions.filter((_, i) => i !== qi));
  };

  const updateQuestion = (qi, field, value) => {
    const updated = [...questions];
    updated[qi] = { ...updated[qi], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qi, oi, value) => {
    const updated = [...questions];
    updated[qi].options = updated[qi].options.map((opt, i) => (i === oi ? { text: value } : opt));
    setQuestions(updated);
  };

  const addOption = (qi) => {
    const updated = [...questions];
    updated[qi].options = [...updated[qi].options, { text: "" }];
    setQuestions(updated);
  };

  const removeOption = (qi, oi) => {
    const updated = [...questions];
    if (updated[qi].options.length > 2) {
      updated[qi].options = updated[qi].options.filter((_, i) => i !== oi);
      setQuestions(updated);
    }
  };

  // Navigation
  const handleNext = () => {
    setErrors({});
    if (step === 0) {
      if (!title.trim()) return setErrors({ title: "Title is required" });
      if (!expiresAt) return setErrors({ expiresAt: "Expiry date is required" });
      if (new Date(expiresAt) <= new Date()) return setErrors({ expiresAt: "Must be in the future" });
    }
    if (step === 1) {
      for (let i = 0; i < questions.length; i++) {
        if (!questions[i].title.trim()) return setErrors({ [`q_${i}_title`]: `Question ${i + 1} title is required` });
        for (let j = 0; j < questions[i].options.length; j++) {
          if (!questions[i].options[j].text.trim()) return setErrors({ [`q_${i}_opt_${j}`]: `Option ${j + 1} in Q${i + 1} is required` });
        }
      }
    }
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else onClose?.();
  };

  const handleCreate = () => {
    setErrors({});
    const payload = { title, description, isAnonymous, expiresAt, questions };
    const result = createPollSchema.safeParse(payload);

    if (!result.success) {
      const errs = {};
      result.error.errors.forEach((err) => { errs[err.path.join(".")] = err.message; });
      setErrors(errs);
      return;
    }

    dispatch(createPoll(payload)).then((res) => {
      if (!res.error) {
        setCreatedPoll(res.payload);
        setCreated(true);
      }
    });
  };

  // Success screen with generated link
  if (created && createdPoll) {
    const pollLink = `${window.location.origin}/poll/${createdPoll.shareLink}`;

    const handleCopy = () => {
      navigator.clipboard.writeText(pollLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="max-w-xl mx-auto py-12 space-y-8">
        {/* Success Icon */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-bounce">
            <HiCheckCircle className="text-4xl text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-heading">Poll Created Successfully! 🎉</h2>
          <p className="text-sm text-paragraph">Your poll is now live and ready to collect responses.</p>
        </div>

        {/* Generated Link Card */}
        <Card className="p-6 space-y-4 border-2 border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <HiGlobe className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-heading">Your Poll Link</p>
              <p className="text-xs text-paragraph">Share this link with respondents</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              readOnly
              value={pollLink}
              className="flex-1 px-4 py-3 text-sm border border-border rounded-btn bg-surface text-heading font-num select-all focus:outline-none focus:ring-2 focus:ring-primary/20"
              onClick={(e) => e.target.select()}
            />
            <Button
              variant={copied ? "secondary" : "primary"}
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              {copied ? <><HiCheck /> Copied!</> : <><HiClipboardList /> Copy Link</>}
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-border/50 text-xs text-paragraph">
            <span className="flex items-center gap-1">
              <HiClock className="text-primary" />
              Expires: {new Date(createdPoll.expiresAt).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              {createdPoll.isAnonymous ? <HiGlobe className="text-green-500" /> : <HiLockClosed className="text-yellow-500" />}
              {createdPoll.isAnonymous ? "Anonymous" : "Authenticated"}
            </span>
            <Badge variant="active">{createdPoll.questions?.length} questions</Badge>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={onClose}>Go to My Polls</Button>
          <Button variant="primary" onClick={handleCopy}>
            <HiClipboardList /> {copied ? "Copied!" : "Copy Link Again"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-heading">Create New Poll</h1>
          <p className="text-sm text-paragraph">Fill in the details to create your poll</p>
        </div>
        <button onClick={onClose} className="text-sm text-paragraph hover:text-heading cursor-pointer flex items-center gap-1">
          <HiArrowLeft /> Back
        </button>
      </div>

      {/* Stepper */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                i < step ? "bg-green-500 text-white" : i === step ? "bg-primary text-white shadow-md" : "bg-surface text-paragraph border border-border"
              }`}>
                {i < step ? <HiCheck /> : i + 1}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className={`text-xs font-medium truncate ${i <= step ? "text-heading" : "text-paragraph"}`}>{s.title}</p>
                <p className="text-[10px] text-paragraph truncate">{s.description}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full ${i < step ? "bg-green-500" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
        <ProgressBar value={progress} color="primary" className="h-1.5" />
      </Card>

      {/* Step Content */}
      {step === 0 && (
        <StepDetails
          title={title} setTitle={setTitle}
          description={description} setDescription={setDescription}
          expiresAt={expiresAt} setExpiresAt={setExpiresAt}
          isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous}
          errors={errors}
        />
      )}

      {step === 1 && (
        <StepQuestions
          questions={questions}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
          updateQuestion={updateQuestion}
          updateOption={updateOption}
          addOption={addOption}
          removeOption={removeOption}
          errors={errors}
        />
      )}

      {step === 2 && (
        <StepReview
          title={title}
          description={description}
          expiresAt={expiresAt}
          isAnonymous={isAnonymous}
          questions={questions}
          errors={errors}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={handleBack} className="gap-1.5">
          <HiArrowLeft /> {step === 0 ? "Cancel" : "Back"}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button variant="primary" onClick={handleNext} className="gap-1.5">
            Next <HiArrowRight />
          </Button>
        ) : (
          <Button variant="primary" onClick={handleCreate} className="gap-1.5">
            <HiCheck /> Create Poll
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Step 1: Poll Details ────────────────────────────────────────────────────

function StepDetails({ title, setTitle, description, setDescription, expiresAt, setExpiresAt, isAnonymous, setIsAnonymous, errors }) {
  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <HiClipboardList className="text-primary text-lg" />
        <h2 className="text-base font-semibold text-heading">Poll Information</h2>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-heading">Poll Title <span className="text-red-400">*</span></label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Product Feedback Survey"
          className="w-full px-4 py-3 text-sm border border-border rounded-btn bg-white text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
        {errors.title && <ErrorText>{errors.title}</ErrorText>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-heading">Description <span className="text-paragraph font-normal">(Optional)</span></label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description about your poll..."
          rows={3}
          className="w-full px-4 py-3 text-sm border border-border rounded-btn bg-white text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* Expiry & Anonymous */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-heading flex items-center gap-1.5">
            <HiClock className="text-paragraph" /> Expiry Date & Time <span className="text-red-400">*</span>
          </label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-border rounded-btn bg-white text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          {errors.expiresAt && <ErrorText>{errors.expiresAt}</ErrorText>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-heading">Response Type</label>
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={() => setIsAnonymous(true)}
              className={`flex-1 flex items-center gap-2 p-3 rounded-btn border-2 cursor-pointer transition-all ${
                isAnonymous ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              }`}
            >
              <HiGlobe className={`text-lg ${isAnonymous ? "text-primary" : "text-paragraph"}`} />
              <div className="text-left">
                <p className={`text-xs font-medium ${isAnonymous ? "text-heading" : "text-paragraph"}`}>Anonymous</p>
                <p className="text-[10px] text-paragraph">No login required</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setIsAnonymous(false)}
              className={`flex-1 flex items-center gap-2 p-3 rounded-btn border-2 cursor-pointer transition-all ${
                !isAnonymous ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              }`}
            >
              <HiLockClosed className={`text-lg ${!isAnonymous ? "text-primary" : "text-paragraph"}`} />
              <div className="text-left">
                <p className={`text-xs font-medium ${!isAnonymous ? "text-heading" : "text-paragraph"}`}>Authenticated</p>
                <p className="text-[10px] text-paragraph">Login required</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Step 2: Questions ───────────────────────────────────────────────────────

function StepQuestions({ questions, addQuestion, removeQuestion, updateQuestion, updateOption, addOption, removeOption, errors }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiClipboardList className="text-primary text-lg" />
          <h2 className="text-base font-semibold text-heading">Questions</h2>
          <Badge variant="active">{questions.length}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={addQuestion}>
          <HiPlus /> Add Question
        </Button>
      </div>

      {/* Global errors */}
      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-btn">
          <p className="text-xs text-red-600 flex items-center gap-1">
            <HiExclamationCircle /> {Object.values(errors)[0]}
          </p>
        </div>
      )}

      {questions.map((q, qi) => (
        <Card key={qi} className="p-5 space-y-4 border-l-4 border-l-primary/30 hover:border-l-primary transition-colors">
          {/* Question Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center font-num">
                {qi + 1}
              </span>
              <span className="text-sm font-medium text-heading">Question {qi + 1}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Mandatory Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={q.isMandatory}
                    onChange={(e) => updateQuestion(qi, "isMandatory", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                </div>
                <span className="text-xs text-paragraph">Required</span>
              </label>
              {/* Remove */}
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(qi)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-btn cursor-pointer transition-colors"
                >
                  <HiTrash className="text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* Question Title */}
          <div className="space-y-1.5">
            <input
              value={q.title}
              onChange={(e) => updateQuestion(qi, "title", e.target.value)}
              placeholder="Type your question here..."
              className="w-full px-4 py-3 text-sm border border-border rounded-btn bg-white text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-medium"
            />
            {errors[`q_${qi}_title`] && <ErrorText>{errors[`q_${qi}_title`]}</ErrorText>}
          </div>

          {/* Options */}
          <div className="space-y-2.5 pl-4 border-l-2 border-border/50">
            <p className="text-xs text-paragraph font-medium">Options (single select)</p>
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2 group">
                <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
                <input
                  value={opt.text}
                  onChange={(e) => updateOption(qi, oi, e.target.value)}
                  placeholder={`Option ${oi + 1}`}
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-btn bg-white text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                {q.options.length > 2 && (
                  <button
                    onClick={() => removeOption(qi, oi)}
                    className="p-1 text-paragraph hover:text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer transition-all"
                  >
                    <HiTrash className="text-xs" />
                  </button>
                )}
                {errors[`q_${qi}_opt_${oi}`] && <ErrorText>{errors[`q_${qi}_opt_${oi}`]}</ErrorText>}
              </div>
            ))}
            <button
              onClick={() => addOption(qi)}
              className="flex items-center gap-1.5 text-xs text-primary font-medium cursor-pointer hover:underline mt-1"
            >
              <HiPlus className="text-xs" /> Add Option
            </button>
          </div>
        </Card>
      ))}

      {/* Add Question Button (bottom) */}
      <button
        onClick={addQuestion}
        className="w-full py-4 border-2 border-dashed border-border rounded-btn text-sm text-paragraph hover:border-primary hover:text-primary cursor-pointer transition-colors flex items-center justify-center gap-2"
      >
        <HiPlus /> Add Another Question
      </button>
    </div>
  );
}

// ─── Step 3: Review ──────────────────────────────────────────────────────────

function StepReview({ title, description, expiresAt, isAnonymous, questions, errors }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HiCheckCircle className="text-primary text-lg" />
        <h2 className="text-base font-semibold text-heading">Review Your Poll</h2>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-btn">
          <p className="text-xs text-red-600 flex items-center gap-1">
            <HiExclamationCircle /> {Object.values(errors)[0]}
          </p>
        </div>
      )}

      {/* Poll Summary */}
      <Card className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-heading">{title}</h3>
        {description && <p className="text-sm text-paragraph">{description}</p>}
        <div className="flex items-center gap-4 pt-2 border-t border-border/50 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-paragraph">
            <HiClock className="text-primary" />
            Expires: {new Date(expiresAt).toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-paragraph">
            {isAnonymous ? <HiGlobe className="text-green-500" /> : <HiLockClosed className="text-yellow-500" />}
            {isAnonymous ? "Anonymous" : "Authenticated"}
          </span>
          <Badge variant="active">{questions.length} question{questions.length > 1 ? "s" : ""}</Badge>
        </div>
      </Card>

      {/* Questions Preview */}
      {questions.map((q, qi) => (
        <Card key={qi} className="p-4">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center font-num flex-shrink-0 mt-0.5">
              {qi + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-heading">{q.title || "Untitled question"}</p>
                <Badge variant={q.isMandatory ? "active" : "draft"} className="text-[10px]">
                  {q.isMandatory ? "Required" : "Optional"}
                </Badge>
              </div>
              <div className="flex flex-col gap-1.5">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-border flex-shrink-0" />
                    <span className="text-xs text-paragraph">{opt.text || `Option ${oi + 1}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function ErrorText({ children }) {
  return (
    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
      <HiExclamationCircle className="text-xs flex-shrink-0" /> {children}
    </p>
  );
}
