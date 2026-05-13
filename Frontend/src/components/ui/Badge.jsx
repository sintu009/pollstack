const variants = {
  active: "bg-green-50 text-green-600 border-green-200",
  live: "bg-green-50 text-green-600 border-green-200",
  expired: "bg-red-50 text-red-500 border-red-200",
  published: "bg-purple-50 text-purple-600 border-purple-200",
  draft: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function Badge({ children, variant = "active", dot = false, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
