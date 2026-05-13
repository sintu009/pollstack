import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiClipboardCopy, HiShare, HiUsers, HiCheckCircle, HiClock, HiEye, HiChartBar, HiExternalLink, HiStop, HiChevronRight, HiCheck } from "react-icons/hi";
import { Card, Badge, Button, ProgressBar } from "../components/ui";
import { fetchMyPolls, togglePollActive, publishPoll } from "../store/slices/pollSlice";
import { fetchAnalytics } from "../store/slices/responseSlice";
import useWebSocket from "../hooks/useWebSocket";

export default function DashboardPage({ onNavigate }) {
  const dispatch = useDispatch();
  const { list: polls } = useSelector((state) => state.polls);
  const { analytics } = useSelector((state) => state.responses);
  const { totalResponses: liveResponses, questionSummaries: liveQuestionSummaries, isConnected, lastUpdatedAt, feed } = useSelector((state) => state.live);
  const [copied, setCopied] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState(false);

  const activePoll = polls.find((p) => p.isActive) || polls[0];

  useWebSocket(activePoll?._id);

  useEffect(() => { dispatch(fetchMyPolls()); }, [dispatch]);

  useEffect(() => {
    if (activePoll?._id) dispatch(fetchAnalytics(activePoll._id));
  }, [activePoll?._id, dispatch]);

  const liveAnalytics = liveQuestionSummaries || analytics?.questionSummaries;
  const totalResp = liveResponses || analytics?.totalResponses || 0;
  const pollLink = activePoll?.shareLink ? `${window.location.origin}/poll/${activePoll.shareLink}` : "";
  const daysLeft = activePoll?.expiresAt ? Math.max(0, Math.ceil((new Date(activePoll.expiresAt) - new Date()) / 86400000)) : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(pollLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndPoll = () => {
    if (activePoll?._id) {
      dispatch(togglePollActive(activePoll._id));
      setConfirmEnd(false);
    }
  };

  const handlePublishResults = () => {
    if (activePoll?._id) {
      dispatch(publishPoll(activePoll._id));
      setConfirmPublish(false);
    }
  };

  const handlePreview = () => {
    if (pollLink) window.open(pollLink, "_blank");
  };

  const stats = [
    { label: "Total Responses", value: totalResp, sub: "Live count", subColor: "text-green-600", icon: HiUsers, color: "bg-purple-100 text-purple-600" },
    { label: "Questions", value: activePoll?.questions?.length || 0, sub: "In this poll", icon: HiCheckCircle, color: "bg-green-100 text-green-600" },
    { label: "Days Left", value: daysLeft, sub: "Until expiry", icon: HiClock, color: "bg-blue-100 text-blue-600" },
    { label: "Active Now", value: isConnected ? "🟢" : "🔴", sub: isConnected ? "Connected" : "Disconnected", icon: HiUsers, color: "bg-orange-100 text-orange-600" },
    { label: "Total Polls", value: polls.length, sub: "All time", icon: HiEye, color: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-heading">Welcome back 👋</h1>
          <p className="text-sm text-paragraph">Here's what's happening with your polls.</p>
        </div>
        {isConnected && (
          <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
          </span>
        )}
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-8 p-5 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-heading">{activePoll?.title || "No polls yet"}</h2>
            {activePoll?.isActive && <Badge variant="active">Active</Badge>}
            {activePoll?.isPublished && <Badge variant="published">Published</Badge>}
            {activePoll && !activePoll.isActive && !activePoll.isPublished && <Badge variant="expired">Inactive</Badge>}
          </div>
          {activePoll && (
            <>
              <p className="text-sm text-paragraph">
                Expires on <span className="text-primary font-medium">{new Date(activePoll.expiresAt).toLocaleDateString()}</span> ({daysLeft} days left)
              </p>
              <div className="flex items-center gap-2">
                <input readOnly value={pollLink} className="flex-1 min-w-0 px-3 py-2 text-sm border border-border rounded-btn bg-surface text-heading font-num" onClick={(e) => e.target.select()} />
                <Button variant={copied ? "secondary" : "outline"} size="sm" onClick={handleCopy}>
                  {copied ? <><HiCheck /> Copied!</> : <><HiClipboardCopy /> Copy Link</>}
                </Button>
                <button onClick={handlePreview} className="p-2 border border-border rounded-btn hover:bg-surface cursor-pointer" title="Open poll link">
                  <HiExternalLink className="text-lg text-paragraph" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2 p-3 border border-border rounded-btn">
                  <HiUsers className="text-lg text-paragraph" />
                  <div>
                    <p className="text-xs text-paragraph">Access</p>
                    <p className="text-sm font-semibold text-heading">{activePoll.isAnonymous ? "Anonymous" : "Authenticated"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border border-border rounded-btn">
                  <HiCheckCircle className="text-lg text-paragraph" />
                  <div>
                    <p className="text-xs text-paragraph">Questions</p>
                    <p className="text-sm font-semibold text-heading font-num">{activePoll.questions?.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border border-border rounded-btn">
                  <HiChartBar className="text-lg text-primary" />
                  <div>
                    <p className="text-xs text-paragraph">Total Responses</p>
                    <p className="text-sm font-semibold text-primary font-num">{totalResp}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>

        <Card className="lg:col-span-4 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-heading">Live Overview</h3>
            <span className={`flex items-center gap-1 text-xs ${isConnected ? "text-green-600" : "text-red-500"}`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-heading font-num">{totalResp}</p>
            <p className="text-sm text-paragraph">Total Responses</p>
            {!activePoll && <p className="text-xs text-yellow-600 mt-1">Create a poll to enable live tracking</p>}
            {activePoll && isConnected && <p className="text-xs text-green-600 mt-1">Real-time via WebSocket</p>}
            {activePoll && !isConnected && <p className="text-xs text-red-400 mt-1">Reconnecting...</p>}
          </div>
          <svg className="w-full h-16" viewBox="0 0 200 60" preserveAspectRatio="none">
            <polyline points="0,50 20,48 40,45 60,40 80,42 100,35 120,30 140,25 160,20 180,15 200,10" fill="none" stroke="#34C84B" strokeWidth="2" strokeLinecap="round" />
            <path d="M0,50 L20,48 L40,45 L60,40 L80,42 L100,35 L120,30 L140,25 L160,20 L180,15 L200,10 L200,60 L0,60 Z" fill="rgba(52,200,75,0.1)" />
          </svg>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((s, i) => (
          <Card key={i} className="p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon className="text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-paragraph truncate">{s.label}</p>
              <p className="text-xl font-bold text-heading font-num">{s.value}</p>
              <p className={`text-xs ${s.subColor || "text-paragraph"} truncate`}>{s.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Live Feed + Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-4 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-heading">Live Activity</h3>
              {isConnected && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
            </div>
            <span className="text-[10px] text-paragraph font-num">{feed.length} events</span>
          </div>
          <div className="space-y-2 max-h-[360px] overflow-y-auto">
            {!activePoll && <p className="text-xs text-paragraph text-center py-6">Create a poll to see live activity</p>}
            {activePoll && feed.length === 0 && (
              <p className="text-xs text-paragraph text-center py-6">{isConnected ? "👀 Listening for responses..." : "⚠️ Reconnecting..."}</p>
            )}
            {feed.map((entry) => (
              entry.type === "submission" ? (
                <div key={entry.id} className="p-3 bg-green-50 border border-green-200 rounded-btn space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-green-700">✅ Response #{entry.totalResponses}</span>
                    <span className="text-[10px] text-paragraph">{timeAgo(entry.submittedAt)}</span>
                  </div>
                  {entry.latestAnswers?.map((a, ai) => (
                    <div key={ai} className="flex items-center gap-1.5">
                      <span className="text-[10px] text-paragraph">Q{ai + 1}:</span>
                      <span className="text-[11px] text-heading font-medium">{a.selected}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div key={entry.id} className="p-2 bg-blue-50 border border-blue-100 rounded-btn">
                  <span className="text-[11px] text-blue-700">
                    🖊️ Q{entry.questionIndex}/{entry.totalQuestions}: <span className="font-medium">{entry.selectedText}</span>
                  </span>
                </div>
              )
            ))}
          </div>
        </Card>

        {liveAnalytics && (
          <Card className="lg:col-span-8 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-heading">Question-wise Analytics (Live)</h3>
              {lastUpdatedAt && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Updated: {new Date(lastUpdatedAt).toLocaleTimeString()}</span>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[450px]">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="text-xs font-medium text-paragraph py-2 w-8">#</th>
                    <th className="text-xs font-medium text-paragraph py-2">Question</th>
                    <th className="text-xs font-medium text-paragraph py-2">Top Option</th>
                    <th className="text-xs font-medium text-paragraph py-2">Count</th>
                    <th className="text-xs font-medium text-paragraph py-2">Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {liveAnalytics.map((q, i) => {
                    const topOption = q.options.reduce((a, b) => (a.count > b.count ? a : b), q.options[0]);
                    const totalForQ = q.options.reduce((sum, o) => sum + o.count, 0);
                    return (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-3 text-sm text-paragraph font-num">{i + 1}</td>
                        <td className="py-3 text-sm text-heading">{q.title}</td>
                        <td className="py-3 text-sm text-primary font-medium">{topOption?.text || "-"}</td>
                        <td className="py-3 text-sm text-heading font-num">{topOption?.count || 0}</td>
                        <td className="py-3 w-32">
                          <div className="flex gap-0.5 h-4 rounded overflow-hidden">
                            {q.options.map((opt, oi) => {
                              const pct = totalForQ > 0 ? (opt.count / totalForQ) * 100 : 0;
                              const colors = ["bg-primary", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-red-400"];
                              return pct > 0 ? <div key={oi} className={`${colors[oi % colors.length]}`} style={{ width: `${pct}%` }} title={`${opt.text}: ${opt.count}`} /> : null;
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Poll Actions + Recent Polls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-heading mb-4">Poll Actions</h3>
          <div className="flex flex-col gap-1">
            <ActionItem icon={HiChartBar} label="View Responses" onClick={() => onNavigate?.("Responses")} />
            <ActionItem icon={HiChartBar} label="View Analytics" onClick={() => onNavigate?.("Analytics")} />
            <ActionItem icon={HiEye} label="Preview Poll" onClick={handlePreview} disabled={!activePoll} />
            <ActionItem icon={HiExternalLink} label="Publish Results" onClick={() => setConfirmPublish(true)} disabled={!activePoll || activePoll.isPublished} />
            <ActionItem icon={HiStop} label="End Poll" danger onClick={() => setConfirmEnd(true)} disabled={!activePoll || !activePoll.isActive} />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-heading mb-4">Recent Polls</h3>
          <div className="flex flex-col gap-3">
            {polls.slice(0, 5).map((p) => (
              <div key={p._id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-heading truncate">{p.title}</span>
                <Badge variant={p.isActive ? "active" : p.isPublished ? "published" : "expired"}>
                  {p.isActive ? "Active" : p.isPublished ? "Published" : "Inactive"}
                </Badge>
              </div>
            ))}
            {polls.length === 0 && <p className="text-sm text-paragraph">No polls created yet.</p>}
          </div>
        </Card>
      </div>

      {/* End Poll Confirmation */}
      {confirmEnd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-heading">End This Poll?</h3>
            <p className="text-sm text-paragraph">This will deactivate the poll. No more responses will be accepted.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setConfirmEnd(false)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={handleEndPoll}>End Poll</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Publish Confirmation */}
      {confirmPublish && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-heading">Publish Results?</h3>
            <p className="text-sm text-paragraph">Results will be publicly visible via the poll link. The poll will be deactivated. This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setConfirmPublish(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={handlePublishResults}>Publish</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function ActionItem({ icon: Icon, label, danger, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm transition-colors w-full text-left ${
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
      } ${danger ? "text-red-500 hover:bg-red-50" : "text-heading hover:bg-surface"}`}
    >
      <Icon className="text-lg" />
      <span className="flex-1">{label}</span>
      <HiChevronRight className="text-paragraph" />
    </button>
  );
}

function timeAgo(dateStr) {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}
