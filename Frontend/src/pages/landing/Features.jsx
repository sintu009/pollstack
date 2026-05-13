import { HiLightningBolt, HiChartBar, HiUsers, HiShieldCheck, HiGlobe, HiClock } from "react-icons/hi";

const features = [
  { icon: HiLightningBolt, title: "Lightning Fast", desc: "Create polls in under 30 seconds with our intuitive drag-and-drop builder.", color: "bg-primary" },
  { icon: HiChartBar, title: "Real-time Analytics", desc: "Watch responses come in live with beautiful charts and actionable insights.", color: "bg-secondary" },
  { icon: HiUsers, title: "Anonymous Mode", desc: "Collect honest, unbiased feedback with fully anonymous participation.", color: "bg-primary" },
  { icon: HiShieldCheck, title: "Enterprise Security", desc: "End-to-end encryption and SOC2 compliance keeps your data safe.", color: "bg-secondary" },
  { icon: HiGlobe, title: "Share Anywhere", desc: "One link to share via email, social media, QR code, or embed on your site.", color: "bg-primary" },
  { icon: HiClock, title: "Smart Scheduling", desc: "Set auto-expiry, schedule launches, and send reminders automatically.", color: "bg-secondary" },
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-3">Features</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-heading mb-3">Everything you need</h2>
          <p className="text-sm md:text-base text-paragraph max-w-lg mx-auto">Powerful features, zero complexity. Start collecting feedback in minutes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {features.map((f, i) => (
            <div key={i} className="group p-5 md:p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-white">
              <div className={`w-11 h-11 rounded-btn ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="text-xl text-white" />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-heading mb-2">{f.title}</h3>
              <p className="text-xs md:text-sm text-paragraph leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
