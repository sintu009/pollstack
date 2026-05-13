export default function Input({ label, optional, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-heading">
          {label} {optional && <span className="text-paragraph font-normal">(Optional)</span>}
        </label>
      )}
      <input
        className={`w-full px-3.5 py-2.5 rounded-input border border-border bg-white text-sm text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}

export function Textarea({ label, optional, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-heading">
          {label} {optional && <span className="text-paragraph font-normal">(Optional)</span>}
        </label>
      )}
      <textarea
        className={`w-full px-3.5 py-2.5 rounded-input border border-border bg-white text-sm text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none ${className}`}
        rows={3}
        {...props}
      />
    </div>
  );
}
