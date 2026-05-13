import { HiClipboardCopy } from "react-icons/hi";
import { Card, Badge } from "../components/ui";

export default function PollInfo({ poll }) {
  return (
    <Card className="p-4 md:p-5 h-full">
      <h3 className="text-sm font-semibold text-heading mb-4">Poll Link</h3>

      <div className="flex items-center gap-2 mb-5">
        <input
          readOnly
          value={poll.link}
          className="flex-1 min-w-0 px-3 py-2 text-sm border border-border rounded-btn bg-surface text-heading"
        />
        <button className="p-2 border border-border rounded-btn hover:bg-surface cursor-pointer flex-shrink-0">
          <HiClipboardCopy className="text-lg text-paragraph" />
        </button>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <InfoRow label="Access Type" value={poll.accessType} />
        <InfoRow label="Expiry" value={poll.expiresAt} />
        <InfoRow label="Status">
          <Badge variant="active">{poll.status}</Badge>
        </InfoRow>
        <InfoRow label="Responses" value={poll.responses} />
        <InfoRow label="Created By" value={poll.createdBy} />
      </div>
    </Card>
  );
}

function InfoRow({ label, value, children }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
      <span className="text-paragraph">{label}</span>
      {children || <span className="text-heading font-medium">{value}</span>}
    </div>
  );
}
