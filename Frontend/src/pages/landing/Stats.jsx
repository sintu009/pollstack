const stats = [
  { value: "10K+", label: "Polls Created" },
  { value: "500K+", label: "Responses Collected" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "User Rating" },
];

export default function Stats() {
  return (
    <section className="py-14 md:py-20 bg-heading">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary font-num mb-1">{s.value}</p>
              <p className="text-xs sm:text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
