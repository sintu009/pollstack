import { HiArrowLeft, HiShare, HiEye, HiDotsVertical } from "react-icons/hi";
import { Badge, Button } from "../components/ui";

export default function PollHeader({ poll }) {
  return (
    <div>
      <button className="flex items-center gap-1 text-primary text-sm font-medium mb-3 cursor-pointer hover:underline">
        <HiArrowLeft /> Back to My Polls
      </button>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-heading">{poll.title}</h1>
            <Badge variant="active">{poll.status}</Badge>
          </div>
          <p className="text-sm text-paragraph">
            Created on {poll.createdAt} • {poll.accessType} Responses • Expires on {poll.expiresAt}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm"><HiShare /> Share Poll</Button>
          <Button variant="outline" size="sm"><HiEye /> Preview</Button>
          <button className="text-paragraph hover:text-heading cursor-pointer p-1">
            <HiDotsVertical className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
