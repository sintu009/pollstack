import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, ProgressBar } from "../components/ui";
import { fetchMyPolls } from "../store/slices/pollSlice";
import { fetchAnalytics } from "../store/slices/responseSlice";
import useWebSocket from "../hooks/useWebSocket";

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const { list: polls } = useSelector((state) => state.polls);
  const { analytics, loading } = useSelector((state) => state.responses);
  const { totalResponses: liveResponses, questionSummaries: liveQuestionSummaries, isConnected, lastUpdatedAt } = useSelector((state) => state.live);

  const activePoll = polls.find((p) => p.isActive) || polls[0];
  useWebSocket(activePoll?._id);

  useEffect(() => { dispatch(fetchMyPolls()); }, [dispatch]);

  useEffect(() => {
    if (activePoll?._id) dispatch(fetchAnalytics(activePoll._id));
  }, [activePoll?._id, dispatch]);

  // Use live WebSocket data if available, fallback to fetched analytics
  const totalResp = liveResponses || analytics?.totalResponses || 0;
  const questionData = liveQuestionSummaries || analytics?.questionSummaries;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-heading">Analytics</h1>
        <div className="flex items-center gap-3">
          {lastUpdatedAt && (
            <span className="text-[10px] text-paragraph">
              Last update: {new Date(lastUpdatedAt).toLocaleTimeString()}
            </span>
          )}
          {isConnected && (
            <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-paragraph">Total Responses</p>
          <p className="text-2xl font-bold text-heading font-num">{totalResp}</p>
          <p className="text-[10px] text-green-600">Live</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-paragraph">Questions</p>
          <p className="text-2xl font-bold text-heading font-num">{activePoll?.questions?.length || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-paragraph">Active Polls</p>
          <p className="text-2xl font-bold text-heading font-num">{polls.filter((p) => p.isActive).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-paragraph">Published Polls</p>
          <p className="text-2xl font-bold text-heading font-num">{polls.filter((p) => p.isPublished).length}</p>
        </Card>
      </div>

      {loading && !questionData && <p className="text-sm text-paragraph text-center py-4">Loading analytics...</p>}

      {questionData && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-heading">
            Question-wise Breakdown
            {liveQuestionSummaries && <span className="ml-2 text-xs text-green-600 font-normal">(Live updating)</span>}
          </h2>
          {questionData.map((q, i) => {
            const totalForQ = q.options.reduce((sum, o) => sum + o.count, 0);
            return (
              <Card key={i} className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center font-num">{i + 1}</span>
                  <h3 className="text-sm font-semibold text-heading">{q.title}</h3>
                  <span className="text-[10px] text-paragraph ml-auto font-num">{totalForQ} answers</span>
                </div>
                <div className="flex flex-col gap-3 ml-8">
                  {q.options.map((opt, j) => {
                    const percent = totalForQ > 0 ? Math.round((opt.count / totalForQ) * 100) : 0;
                    const isTop = q.options.every((o) => o.count <= opt.count) && opt.count > 0;
                    return (
                      <div key={j}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-sm ${isTop ? "font-medium text-heading" : "text-paragraph"}`}>
                            {opt.text} {isTop && <span className="text-[10px] text-primary">👑 Top</span>}
                          </span>
                          <span className="text-xs font-num text-heading font-medium">
                            {opt.count} <span className="text-paragraph">({percent}%)</span>
                          </span>
                        </div>
                        <div className="relative">
                          <ProgressBar value={percent} color={isTop ? "primary" : "secondary"} className="h-2.5 rounded-full transition-all duration-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!questionData && !loading && (
        <Card className="p-8 text-center">
          <p className="text-sm text-paragraph">Select or create a poll to view analytics.</p>
        </Card>
      )}
    </div>
  );
}
