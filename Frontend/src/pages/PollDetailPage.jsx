import { Tabs } from "../components/ui";
import PollHeader from "./PollHeader";
import StatsRow from "./StatsRow";
import ResponsesChart from "./ResponsesChart";
import DeviceChart from "./DeviceChart";
import PollInfo from "./PollInfo";
import QuestionSummary from "./QuestionSummary";
import RealTimeActivity from "./RealTimeActivity";
import PublishBanner from "./PublishBanner";

const poll = {
  title: "Product Feedback Survey",
  status: "Active",
  createdAt: "12 May 2025",
  expiresAt: "25 May 2025, 11:59 PM",
  accessType: "Anonymous",
  link: "https://PollStack.app/p/abc123",
  responses: "342",
  createdBy: "Ankit Sharma",
};

const stats = {
  totalResponses: { label: "Total Responses", value: "342" },
  completed: { label: "Completed", value: "98.6%", sub: "338 / 342" },
  activeNow: { label: "Active Now", value: "23" },
  avgTime: { label: "Avg. Time to Complete", value: "02:45" },
  totalQuestions: { label: "Total Questions", value: "4", sub: "3 Required • 1 Optional" },
};

const questions = [
  { question: "How would you rate your overall experience with our product?", type: "Single Choice", required: true, responses: 342, topResult: { label: "Excellent", percent: "41.5%" } },
  { question: "Which feature do you use the most?", type: "Single Choice", required: true, responses: 342, topResult: { label: "Analytics", percent: "52.0%" } },
  { question: "How likely are you to recommend us?", type: "Single Choice", required: true, responses: 342, topResult: { label: "Very Likely", percent: "46.8%" } },
  { question: "Any suggestions to improve?", type: "Single Choice", required: false, responses: 120, topResult: { label: "Better Mobile App", percent: "31.7%" } },
];

const activities = [
  { name: "Rohan Sharma", action: "Completed the survey", time: "Just now" },
  { name: "Priya Singh", action: "Completed the survey", time: "10 sec ago" },
  { name: "Amit Verma", action: "Completed the survey", time: "15 sec ago" },
  { name: "Sneha Patel", action: "Completed the survey", time: "20 sec ago" },
  { name: "Deepak Kumar", action: "Completed the survey", time: "30 sec ago" },
];

const user = { name: "Ankit Sharma", email: "ankit@example.com" };

export default function PollDetailPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-5 md:space-y-6">
        <PollHeader poll={poll} />

        <Tabs tabs={["Overview", "Questions", "Responses (342)", "Settings"]} />

        <StatsRow stats={stats} />

        {/* Charts + Poll Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5">
            <ResponsesChart />
          </div>
          <div className="lg:col-span-4">
            <DeviceChart />
          </div>
          <div className="lg:col-span-3">
            <PollInfo poll={poll} />
          </div>
        </div>

        {/* Question Summary + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9">
            <QuestionSummary questions={questions} />
          </div>
          <div className="lg:col-span-3">
            <RealTimeActivity activities={activities} />
          </div>
        </div>

        <PublishBanner />
      </div>
  );
}
