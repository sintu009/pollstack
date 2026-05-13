import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiExternalLink, HiClipboardCopy, HiCheck } from "react-icons/hi";
import { Card, Badge, Button } from "../components/ui";
import { fetchMyPolls } from "../store/slices/pollSlice";

export default function PublishedResultsPage() {
  const dispatch = useDispatch();
  const { list: polls } = useSelector((state) => state.polls);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { dispatch(fetchMyPolls()); }, [dispatch]);

  const published = polls.filter((p) => p.isPublished);

  const copyLink = (id, shareLink) => {
    const link = `${window.location.origin}/poll/${shareLink}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const viewResults = (shareLink) => {
    window.open(`${window.location.origin}/poll/${shareLink}`, "_blank");
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-heading">Published Results</h1>
        <p className="text-sm text-paragraph">Polls with publicly visible results</p>
      </div>

      {published.length === 0 ? (
        <Card className="p-8 text-center space-y-3">
          <p className="text-3xl">📊</p>
          <p className="text-sm text-paragraph">No published polls yet.</p>
          <p className="text-xs text-paragraph">Publish a poll from "My Polls" to share results publicly.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {published.map((p) => (
            <Card key={p._id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-heading">{p.title}</h3>
                <Badge variant="published">Published</Badge>
              </div>
              {p.description && <p className="text-xs text-paragraph mb-2">{p.description}</p>}
              <p className="text-xs text-paragraph mb-3">
                {p.questions?.length} questions • Created: {new Date(p.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-auto flex gap-2">
                <Button
                  variant={copiedId === p._id ? "secondary" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => copyLink(p._id, p.shareLink)}
                >
                  {copiedId === p._id ? <><HiCheck /> Copied!</> : <><HiClipboardCopy /> Copy Link</>}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => viewResults(p.shareLink)}
                >
                  <HiExternalLink /> View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
