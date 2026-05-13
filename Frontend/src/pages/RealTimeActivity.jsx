import { HiArrowRight } from "react-icons/hi";
import { Card, Badge, Avatar } from "../components/ui";

export default function RealTimeActivity({ activities }) {
  return (
    <Card className="p-4 md:p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-heading">Real-time Activity</h3>
        <Badge variant="live" dot>Live</Badge>
      </div>

      <div className="flex flex-col gap-4">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <Avatar name={a.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-heading truncate">{a.name}</p>
              <p className="text-xs text-paragraph">{a.action}</p>
            </div>
            <span className="text-xs text-paragraph whitespace-nowrap">{a.time}</span>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-1 text-sm text-primary font-medium mt-4 cursor-pointer hover:underline">
        View all responses <HiArrowRight />
      </button>
    </Card>
  );
}
