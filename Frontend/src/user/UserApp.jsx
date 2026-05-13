import { useState } from "react";
import { useSelector } from "react-redux";
import UserLayout from "./UserLayout";
import PollListPage from "./components/PollListPage";
import TakePollPage from "./components/TakePollPage";
import ThankYouPage from "./components/ThankYouPage";
import PollResultsPage from "./components/PollResultsPage";

export default function UserApp() {
  const [view, setView] = useState("list");
  const [selectedPoll, setSelectedPoll] = useState(null);
  const { submitted } = useSelector((state) => state.responses);

  const handleTakePoll = (poll) => {
    setSelectedPoll(poll);
    setView("take");
  };

  const handleSubmitted = () => {
    setView("thankyou");
  };

  const handleBackToPolls = () => {
    setSelectedPoll(null);
    setView("list");
  };

  const handleViewResults = (poll) => {
    setSelectedPoll(poll);
    setView("results");
  };

  return (
    <UserLayout>
      {view === "list" && <PollListPage onTakePoll={handleTakePoll} onViewResults={handleViewResults} />}
      {view === "take" && <TakePollPage poll={selectedPoll} onBack={handleBackToPolls} onSubmit={handleSubmitted} />}
      {view === "thankyou" && <ThankYouPage onBackToPolls={handleBackToPolls} />}
      {view === "results" && <PollResultsPage poll={selectedPoll} onBack={handleBackToPolls} />}
    </UserLayout>
  );
}
