export default function ProgressBar({ value = 0, max = 100, color = "primary", className = "" }) {
  const percent = Math.min((value / max) * 100, 100);
  const colors = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    green: "bg-green-500",
    blue: "bg-blue-500",
  };

  return (
    <div className={`w-full h-2 bg-surface rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
