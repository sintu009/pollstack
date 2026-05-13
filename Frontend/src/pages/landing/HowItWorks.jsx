import { HiArrowRight } from "react-icons/hi";

const steps = [
  { num: "1", title: "Create", desc: "Build your poll with our intuitive editor. Add questions, set options, customize design.", color: "bg-primary" },
  { num: "2", title: "Share", desc: "Get a unique link. Share via email, WhatsApp, social media, or embed on your website.", color: "bg-secondary" },
  { num: "3", title: "Analyze", desc: "Watch responses in real-time. Get charts, device breakdown, and completion rates.", color: "bg-primary" },
  { num: "4", title: "Publish", desc: "Share results with your team or make them public. Export data anytime.", color: "bg-secondary" },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full mb-3">How it works</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-heading mb-3">Four simple steps</h2>
          <p className="text-sm md:text-base text-paragraph max-w-lg mx-auto">From idea to insights in under 2 minutes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative bg-white rounded-xl p-5 md:p-6 border border-border text-center">
              <div className={`w-10 h-10 ${s.color} rounded-full flex items-center justify-center text-white font-bold text-sm font-num mx-auto mb-4`}>
                {s.num}
              </div>
              <h3 className="text-sm md:text-base font-semibold text-heading mb-2">{s.title}</h3>
              <p className="text-xs md:text-sm text-paragraph leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-border">
                  <HiArrowRight className="text-xl" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
