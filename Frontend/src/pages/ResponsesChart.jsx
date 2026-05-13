import { Card, Badge } from "../components/ui";

export default function ResponsesChart() {
  const dataPoints = [60, 80, 70, 200, 220, 280, 320];
  const labels = ["19 May", "20 May", "21 May", "22 May", "23 May", "24 May", "25 May"];
  const max = Math.max(...dataPoints);

  return (
    <Card className="p-4 md:p-5 h-full">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <h3 className="text-sm md:text-base font-semibold text-heading">Responses Over Time</h3>
        <Badge variant="active" dot>Live</Badge>
      </div>

      <div className="relative h-40 md:h-48">
        <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M0,${200 - (dataPoints[0] / max) * 180} ${dataPoints.map((p, i) => `L${(i / (dataPoints.length - 1)) * 700},${200 - (p / max) * 180}`).join(" ")} L700,200 L0,200 Z`}
            fill="url(#chartGradient)"
          />
          <polyline
            points={dataPoints.map((p, i) => `${(i / (dataPoints.length - 1)) * 700},${200 - (p / max) * 180}`).join(" ")}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {dataPoints.map((p, i) => (
            <circle key={i} cx={(i / (dataPoints.length - 1)) * 700} cy={200 - (p / max) * 180} r="4" fill="#4F46E5" />
          ))}
        </svg>
      </div>

      <div className="flex justify-between mt-2 text-xs text-paragraph">
        {labels.map((l) => <span key={l} className="hidden sm:inline">{l}</span>)}
        {/* Show fewer labels on mobile */}
        {labels.filter((_, i) => i % 2 === 0).map((l) => <span key={l + "m"} className="sm:hidden">{l}</span>)}
      </div>
    </Card>
  );
}
