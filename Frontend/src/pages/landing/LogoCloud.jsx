const logos = ["Google", "Microsoft", "Slack", "Notion", "Figma", "Stripe"];

export default function LogoCloud() {
  return (
    <section className="py-10 md:py-14 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-[11px] text-paragraph mb-5 uppercase tracking-widest font-medium">Trusted by 10,000+ teams worldwide</p>
        <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 flex-wrap opacity-30 grayscale">
          {logos.map((l) => (
            <span key={l} className="text-base sm:text-lg md:text-xl font-bold text-heading">{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
