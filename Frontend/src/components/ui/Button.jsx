const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
  secondary: "bg-secondary text-white hover:bg-secondary-hover shadow-sm",
  outline: "border border-border text-heading hover:bg-surface",
  ghost: "text-paragraph hover:bg-surface",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-base",
};

export default function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-btn transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
