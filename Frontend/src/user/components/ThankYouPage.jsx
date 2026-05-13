import { HiCheckCircle, HiArrowRight } from "react-icons/hi";
import { Card, Button } from "../../components/ui";

export default function ThankYouPage({ onBackToPolls, stats }) {
  const answeredCount = stats?.answeredCount || 0;
  const totalQuestions = stats?.total || 0;
  const timeTaken = stats?.timeTaken || 0;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center min-h-[65vh]">
      <Card className="p-8 md:p-12 text-center max-w-lg w-full">
        {/* Success Icon */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <HiCheckCircle className="text-5xl text-primary" />
          </div>
          <span className="absolute -top-2 -right-2 text-2xl">🎉</span>
          <span className="absolute -bottom-1 -left-3 text-lg">✨</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-heading mb-3">Response Submitted!</h1>
        <p className="text-sm text-paragraph mb-2 max-w-sm mx-auto">
          Thank you for taking the time to share your feedback. Your response has been recorded securely.
        </p>
        <p className="text-xs text-paragraph/60 mb-8">
          Your response has been saved successfully.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mb-8 py-4 border-y border-border/50">
          <div className="text-center">
            <p className="text-lg font-bold text-heading font-num">{answeredCount}/{totalQuestions}</p>
            <p className="text-xs text-paragraph">Answered</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-heading font-num">{formatTime(timeTaken)}</p>
            <p className="text-xs text-paragraph">Time taken</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-primary">✓</p>
            <p className="text-xs text-paragraph">Secured</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={onBackToPolls} className="gap-1.5">
            Done <HiArrowRight />
          </Button>
        </div>
      </Card>
    </div>
  );
}
