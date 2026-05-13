export default function Stepper({ steps, current = 0 }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              i <= current ? "bg-primary text-white" : "bg-surface text-paragraph border border-border"
            }`}>
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-0.5 h-8 bg-border" />}
          </div>
          <div className="pt-1">
            <p className={`text-sm font-medium ${i <= current ? "text-heading" : "text-paragraph"}`}>{step.title}</p>
            <p className="text-xs text-paragraph">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
