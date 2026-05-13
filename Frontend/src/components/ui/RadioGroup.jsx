export default function RadioGroup({ name, options, value, onChange, className = "" }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            value === option.value ? "border-primary" : "border-border group-hover:border-primary/50"
          }`}>
            {value === option.value && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
          </span>
          <span className="text-sm text-heading">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
