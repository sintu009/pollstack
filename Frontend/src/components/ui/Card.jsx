export default function Card({ children, className = "", ...props }) {
  return (
    <div className={`bg-card rounded-card shadow-card p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon }) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <span className="text-xs text-paragraph">{label}</span>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-heading">{value}</span>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
    </Card>
  );
}
