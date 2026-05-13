import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Badge } from "../components/ui";
import { fetchMyPolls } from "../store/slices/pollSlice";
import { fetchAnalytics } from "../store/slices/responseSlice";
import useWebSocket from "../hooks/useWebSocket";

export default function ResponsesPage() {
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

  const questionData = liveQuestionSummaries || analytics?.questionSummaries;

  const totalResp = liveResponses || analytics?.totalResponses || 0;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-heading">Responses</h1>
        {isConnected && (
          <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Updates
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-paragraph">Total Responses</p>
          <p className="text-2xl font-bold text-heading font-num">{totalResp}</p>
          <p className="text-xs text-green-600">Live count</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-paragraph">Active Poll</p>
          <p className="text-lg font-bold text-heading truncate">{activePoll?.title || "None"}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-paragraph">Connection</p>
          <p className={`text-lg font-bold ${isConnected ? "text-green-600" : "text-red-500"}`}>
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </p>
        </Card>
      </div>

      {loading && <p className="text-sm text-paragraph text-center py-4">Loading...</p>}

      {questionData && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-heading">Response Summary (Live)</h2>
            {lastUpdatedAt && (
              <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {new Date(lastUpdatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="text-xs font-medium text-paragraph py-2">#</th>
                  <th className="text-xs font-medium text-paragraph py-2">Question</th>
                  <th className="text-xs font-medium text-paragraph py-2">Top Answer</th>
                  <th className="text-xs font-medium text-paragraph py-2">Votes</th>
                </tr>
              </thead>
              <tbody>
                {questionData.map((q, i) => {
                  const top = q.options.reduce((a, b) => (a.count > b.count ? a : b), q.options[0]);
                  return (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-3 text-sm text-paragraph font-num">{i + 1}</td>
                      <td className="py-3 text-sm text-heading">{q.title}</td>
                      <td className="py-3 text-sm text-primary font-medium">{top?.text || "-"}</td>
                      <td className="py-3 text-sm text-heading font-num">{top?.count || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* All polls list */}
      <Card className="p-5">
        <h2 className="text-base font-semibold text-heading mb-4">All Polls</h2>
        <div className="flex flex-col gap-3">
          {polls.map((p) => (
            <div key={p._id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-sm text-heading">{p.title}</span>
              <Badge variant={p.isActive ? "active" : p.isPublished ? "published" : "expired"}>
                {p.isActive ? "Active" : p.isPublished ? "Published" : "Inactive"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
