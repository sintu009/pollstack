import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiArrowLeft, HiArrowRight, HiClock, HiLockClosed, HiCheck } from "react-icons/hi";
import { Card, Button, ProgressBar } from "../../components/ui";
import { submitResponse } from "../../store/slices/responseSlice";
import { submitResponseSchema } from "../../validation/responseSchema";
import { responseAPI } from "../../services/api";

export default function TakePollPage({ poll, onBack, onSubmit }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.responses);

  const questions = poll?.questions || [];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const startTime = useRef(Date.now());

  const question = questions[current];
  const total = questions.length;
  const progress = (current / total) * 100;
  const isAnswered = answers[question?._id] !== undefined;

  const handleNext = () => {
    // Send live progress to admin via WebSocket
    if (isAnswered) {
      responseAPI.progress({
        pollId: poll._id,
        questionId: question._id,
        selectedOption: answers[question._id],
      }).catch(() => {}); // fire and forget
    }

    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const selectOption = (optionId) => {
    setAnswers({ ...answers, [question._id]: optionId });
  };

  const handleSubmit = () => {
    setError("");
    const answerArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    const payload = { pollId: poll._id, answers: answerArray };
    const result = submitResponseSchema.safeParse(payload);

    if (!result.success) {
      setError(result.error.errors[0]?.message || "Validation failed");
      return;
    }

    const mandatoryIds = questions.filter((q) => q.isMandatory).map((q) => q._id);
    const answeredIds = answerArray.map((a) => a.questionId);
    const missing = mandatoryIds.filter((id) => !answeredIds.includes(id));

    if (missing.length) {
      setError("Please answer all required questions");
      return;
    }

    const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);

    dispatch(submitResponse(payload)).then((res) => {
      if (res.meta.requestStatus === "rejected") {
        setError(res.payload || "Submission failed. You may have already responded.");
      } else {
        onSubmit?.({ answeredCount: answerArray.length, total, timeTaken });
      }
    });
  };

  if (!question) return <p className="text-sm text-paragraph">No questions available.</p>;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-paragraph text-sm cursor-pointer hover:text-heading transition-colors">
          <HiArrowLeft /> Exit
        </button>
        <div className="flex items-center gap-2 text-xs text-paragraph">
          <HiLockClosed className="text-primary" />
          <span>{poll?.isAnonymous ? "Anonymous" : "Authenticated"}</span>
        </div>
      </div>

      {/* Poll Title */}
      <div className="bg-white rounded-btn border border-border p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-btn bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xl">📋</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-heading truncate">{poll?.title}</h1>
          <div className="flex items-center gap-3 text-xs text-paragraph">
            <span className="flex items-center gap-1"><HiClock /> ~2 min</span>
            <span className="font-num">{total} questions</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < current ? "bg-primary" : i === current ? "bg-primary w-6" : "bg-border"}`} />
            ))}
          </div>
          <span className="text-xs text-paragraph"><span className="font-num font-semibold text-heading">{current + 1}</span>/{total}</span>
        </div>
        <ProgressBar value={progress} color="primary" className="h-1.5" />
      </div>

      {/* Question */}
      <Card className="p-6 md:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center font-num">{current + 1}</span>
            {question.isMandatory ? (
              <span className="text-[10px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Required</span>
            ) : (
              <span className="text-[10px] font-medium text-paragraph bg-surface px-2 py-0.5 rounded-full">Optional</span>
            )}
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-heading leading-snug">{question.title}</h2>
        </div>

        <div className="flex flex-col gap-3">
          {question.options?.map((option) => {
            const isSelected = answers[question._id] === option._id;
            return (
              <button
                key={option._id}
                onClick={() => selectOption(option._id)}
                className={`w-full flex items-center gap-3 p-4 rounded-btn border-2 text-left transition-all cursor-pointer ${
                  isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30 hover:bg-surface/50"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? "border-primary bg-primary" : "border-border"
                }`}>
                  {isSelected && <HiCheck className="text-white text-xs" />}
                </div>
                <span className={`text-sm ${isSelected ? "font-medium text-heading" : "text-paragraph"}`}>{option.text}</span>
              </button>
            );
          })}
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={handlePrev} disabled={current === 0} className="gap-1.5">
          <HiArrowLeft /> Previous
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={(question.isMandatory && !isAnswered) || loading}
          className="gap-1.5"
        >
          {current === total - 1 ? (<>{loading ? "Submitting..." : "Submit"} <HiCheck /></>) : (<>Next <HiArrowRight /></>)}
        </Button>
      </div>
    </div>
  );
}
