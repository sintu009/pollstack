import { HiUsers, HiChartBar, HiLightningBolt, HiClock, HiCheckCircle } from "react-icons/hi";
import { Card } from "../components/ui";

const statConfig = [
  { key: "totalResponses", icon: HiUsers, color: "bg-blue-100 text-blue-600" },
  { key: "completed", icon: HiChartBar, color: "bg-green-100 text-green-600" },
  { key: "activeNow", icon: HiLightningBolt, color: "bg-yellow-100 text-yellow-600" },
  { key: "avgTime", icon: HiClock, color: "bg-orange-100 text-orange-600" },
  { key: "totalQuestions", icon: HiCheckCircle, color: "bg-teal-100 text-teal-600" },
];

export default function StatsRow({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {statConfig.map(({ key, icon: Icon, color }) => {
        const stat = stats[key];
        return (
          <Card key={key} className="flex items-center gap-3 p-3 md:p-4">
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center ${color}`}>
              <Icon className="text-lg" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-paragraph truncate">{stat.label}</p>
              <p className="text-lg md:text-2xl font-bold text-heading font-num">{stat.value}</p>
              {stat.sub && <p className="text-xs text-paragraph truncate">{stat.sub}</p>}
              {key === "totalResponses" && (
                <p className="text-xs text-paragraph flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Live
                </p>
              )}
              {key === "activeNow" && (
                <p className="text-xs text-paragraph flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Live
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
