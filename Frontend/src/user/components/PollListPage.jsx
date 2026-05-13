import { HiClock, HiUsers, HiArrowRight, HiLockClosed, HiGlobe } from "react-icons/hi";
import { Card, Badge, Button } from "../../components/ui";

const polls = [
  { id: 1, title: "Product Feedback Survey", desc: "We value your feedback! Please take a few minutes to fill this short survey.", status: "active", questions: 4, expires: "25 May 2025", timeEstimate: "~2 min", access: "Anonymous" },
  { id: 2, title: "Team Offsite Preferences", desc: "Help us plan the next team offsite by sharing your preferences.", status: "active", questions: 6, expires: "20 May 2025", timeEstimate: "~3 min", access: "Anonymous" },
  { id: 3, title: "Online Course Feedback", desc: "Share your thoughts on the recent online course and help us improve.", status: "expired", questions: 5, expires: "10 May 2025", timeEstimate: "~3 min", access: "Authenticated" },
];

export default function PollListPage({ onTakePoll }) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {polls.filter(p => p.status === "active").length} polls available
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-heading mb-2">Share Your Voice 🗳️</h1>
        <p className="text-sm text-paragraph max-w-md mx-auto">
          Your feedback matters. Pick a poll below and help shape better decisions.
        </p>
      </div>

      {/* Poll Cards */}
      <div className="space-y-4">
        {polls.map((poll) => (
          <Card
            key={poll.id}
            className={`p-5 md:p-6 transition-all hover:shadow-elevated ${
              poll.status === "expired" ? "opacity-60" : "cursor-pointer hover:-translate-y-0.5"
            }`}
            onClick={() => poll.status !== "expired" && onTakePoll?.(poll)}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-btn flex items-center justify-center flex-shrink-0 ${
                poll.status === "active" ? "bg-primary/10" : "bg-gray-100"
              }`}>
                <span className="text-2xl">{poll.status === "active" ? "📋" : "🔒"}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base font-semibold text-heading">{poll.title}</h3>
                  <Badge variant={poll.status} dot={poll.status === "active"}>
                    {poll.status === "active" ? "Live" : "Closed"}
                  </Badge>
                </div>
                <p className="text-sm text-paragraph mb-3">{poll.desc}</p>
                <div className="flex items-center gap-4 text-xs text-paragraph flex-wrap">
                  <span className="flex items-center gap-1">
                    <HiClock className="text-primary" /> {poll.timeEstimate}
                  </span>
                  <span className="flex items-center gap-1 font-num">
                    {poll.questions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    {poll.access === "Anonymous" ? <HiGlobe className="text-green-500" /> : <HiLockClosed className="text-yellow-500" />}
                    {poll.access}
                  </span>
                  <span className="flex items-center gap-1">
                    <HiClock /> Expires: {poll.expires}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0">
                {poll.status === "active" ? (
                  <Button variant="primary" size="md" onClick={(e) => { e.stopPropagation(); onTakePoll?.(poll); }}>
                    Start <HiArrowRight />
                  </Button>
                ) : (
                  <Button variant="outline" size="md" disabled>Closed</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
