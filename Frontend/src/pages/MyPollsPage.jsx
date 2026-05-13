import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiPlus, HiSearch, HiClipboardCopy, HiExternalLink, HiCheck } from "react-icons/hi";
import { Card, Button, Badge } from "../components/ui";
import { fetchMyPolls, publishPoll, togglePollActive } from "../store/slices/pollSlice";

export default function MyPollsPage({ onNavigate }) {
  const dispatch = useDispatch();
  const { list: polls, loading } = useSelector((state) => state.polls);
  const [search, setSearch] = useState("");
  const [publishConfirm, setPublishConfirm] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { dispatch(fetchMyPolls()); }, [dispatch]);

  const filtered = polls.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const copyLink = (id, shareLink) => {
    navigator.clipboard.writeText(`${window.location.origin}/poll/${shareLink}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePublish = (id) => {
    dispatch(publishPoll(id));
    setPublishConfirm(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-heading">My Polls</h1>
          <p className="text-sm text-paragraph">Manage all your polls in one place</p>
        </div>
        <Button variant="primary" onClick={() => onNavigate?.("Create Poll")}>
          <HiPlus /> Create Poll
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-xs text-paragraph">Total Polls</p>
          <p className="text-2xl font-bold text-heading font-num">{polls.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-paragraph">Active</p>
          <p className="text-2xl font-bold text-green-600 font-num">{polls.filter((p) => p.isActive).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-paragraph">Published</p>
          <p className="text-2xl font-bold text-purple-600 font-num">{polls.filter((p) => p.isPublished).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-paragraph">Inactive</p>
          <p className="text-2xl font-bold text-paragraph font-num">{polls.filter((p) => !p.isActive && !p.isPublished).length}</p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-paragraph" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search polls..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-btn bg-white text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-paragraph py-8 text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="text-xs font-medium text-paragraph py-2">Poll</th>
                  <th className="text-xs font-medium text-paragraph py-2">Status</th>
                  <th className="text-xs font-medium text-paragraph py-2">Questions</th>
                  <th className="text-xs font-medium text-paragraph py-2">Expires</th>
                  <th className="text-xs font-medium text-paragraph py-2">Link</th>
                  <th className="text-xs font-medium text-paragraph py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-b border-border/50 hover:bg-surface/50">
                    <td className="py-3">
                      <p className="text-sm font-medium text-heading">{p.title}</p>
                      {p.description && <p className="text-xs text-paragraph truncate max-w-[200px]">{p.description}</p>}
                    </td>
                    <td className="py-3">
                      <Badge variant={p.isActive ? "active" : p.isPublished ? "published" : "expired"}>
                        {p.isActive ? "Active" : p.isPublished ? "Published" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-heading font-num">{p.questions?.length}</td>
                    <td className="py-3 text-sm text-paragraph">{new Date(p.expiresAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <button
                        onClick={() => copyLink(p._id, p.shareLink)}
                        className="flex items-center gap-1 text-xs text-primary font-medium cursor-pointer hover:underline"
                      >
                        {copiedId === p._id ? <><HiCheck /> Copied</> : <><HiClipboardCopy /> Copy</>}
                      </button>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {p.isActive && (
                          <button
                            onClick={() => dispatch(togglePollActive(p._id))}
                            className="text-xs text-primary font-medium cursor-pointer hover:underline"
                          >
                            Deactivate
                          </button>
                        )}
                        {!p.isActive && !p.isPublished && (
                          <button
                            onClick={() => dispatch(togglePollActive(p._id))}
                            className="text-xs text-primary font-medium cursor-pointer hover:underline"
                          >
                            Activate
                          </button>
                        )}
                        {!p.isPublished && (
                          <button
                            onClick={() => setPublishConfirm(p._id)}
                            className="text-xs text-green-600 font-medium cursor-pointer hover:underline"
                          >
                            Publish Results
                          </button>
                        )}
                        {p.isPublished && (
                          <button
                            onClick={() => window.open(`/poll/${p.shareLink}`, "_blank")}
                            className="flex items-center gap-1 text-xs text-purple-600 font-medium cursor-pointer hover:underline"
                          >
                            <HiExternalLink /> View Results
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="space-y-3">
                        <p className="text-3xl">📋</p>
                        <p className="text-sm text-paragraph">No polls found. Create your first poll!</p>
                        <Button variant="primary" size="sm" onClick={() => onNavigate?.("Create Poll")}>
                          <HiPlus /> Create Poll
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Publish Confirmation Modal */}
      {publishConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-heading">Publish Poll Results?</h3>
            <p className="text-sm text-paragraph">
              This will make the final results publicly visible through the same poll link. The poll will be deactivated and no more responses will be accepted.
            </p>
            <p className="text-xs text-red-500 font-medium">This action cannot be undone.</p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setPublishConfirm(null)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={() => handlePublish(publishConfirm)}>Publish Results</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
