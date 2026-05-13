import { HiDesktopComputer, HiDeviceMobile } from "react-icons/hi";
import { Card } from "../components/ui";

const devices = [
  { label: "Desktop", percent: 60, count: 205, color: "#4F46E5" },
  { label: "Mobile", percent: 35, count: 120, color: "#34C84B" },
  { label: "Tablet", percent: 5, count: 17, color: "#F59E0B" },
];

export default function DeviceChart() {
  return (
    <Card className="p-4 md:p-5 h-full">
      <h3 className="text-sm md:text-base font-semibold text-heading mb-4 md:mb-6">Responses by Device</h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="4" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#4F46E5" strokeWidth="4"
              strokeDasharray="60 40" strokeDashoffset="0" strokeLinecap="round" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#34C84B" strokeWidth="4"
              strokeDasharray="35 65" strokeDashoffset="-60" strokeLinecap="round" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4"
              strokeDasharray="5 95" strokeDashoffset="-95" strokeLinecap="round" />
          </svg>
        </div>

        <div className="flex flex-col gap-3">
          {devices.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-sm text-paragraph">{d.label}</span>
              <span className="text-sm font-medium text-heading ml-1">{d.percent}% ({d.count})</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
