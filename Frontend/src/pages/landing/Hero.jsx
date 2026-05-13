import { HiArrowRight, HiCheck, HiChartBar, HiUsers } from "react-icons/hi";
import { Button } from "../../components/ui";

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-44 lg:pb-32 px-4">
      <div className="absolute top-20 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              New: Real-time live responses
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-heading leading-[1.1] mb-6">
              Create Polls
              <br />
              <span className="text-primary">People Love</span>
              <br />
              to Answer
            </h1>

            <p className="text-base md:text-lg text-paragraph max-w-md mb-8">
              Build beautiful polls in seconds, collect feedback in real-time, and make smarter decisions with powerful analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Button variant="primary" size="lg" onClick={onGetStarted} className="text-base px-7 py-3">
                Start Free <HiArrowRight />
              </Button>

            </div>


          </div>

          {/* Dashboard Preview */}
          <div className="relative animate-fade-in-up animation-delay-400">
            <div className="bg-white rounded-xl shadow-elevated border border-border p-3 md:p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="flex-1 h-5 bg-surface rounded ml-3" />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[["342", "Responses"], ["98.6%", "Completion"], ["23", "Active Now"]].map(([v, l], i) => (
                  <div key={i} className="bg-surface rounded-btn p-2.5 text-center">
                    <p className={`text-sm font-bold font-num ${i === 1 ? "text-primary" : i === 2 ? "text-secondary" : "text-heading"}`}>{v}</p>
                    <p className="text-[9px] text-paragraph">{l}</p>
                  </div>
                ))}
              </div>

              <div className="bg-surface rounded-btn p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-heading">Responses Over Time</span>
                  <span className="text-[9px] text-primary font-medium">Live ●</span>
                </div>
                <div className="h-20 flex items-end gap-[3px]">
                  {[25, 35, 30, 50, 45, 60, 55, 70, 65, 80, 75, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t animate-grow" style={{ height: `${h}%`, backgroundColor: i >= 10 ? "#34C84B" : "#4F46E5", opacity: 0.7 + (i * 0.025), animationDelay: `${i * 80}ms` }} />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-surface rounded-btn p-2.5">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <HiChartBar className="text-primary text-xs" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-medium text-heading">Product Feedback Survey</p>
                  <p className="text-[8px] text-paragraph">342 responses • Active</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -top-3 -right-3 sm:-right-6 bg-white rounded-btn shadow-elevated border border-border p-2.5 animate-float z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <HiCheck className="text-primary text-sm" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-heading">New Response!</p>
                  <p className="text-[8px] text-paragraph">2 sec ago</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-3 -left-3 sm:-left-6 bg-white rounded-btn shadow-elevated border border-border p-2.5 animate-float animation-delay-2000 z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center">
                  <HiUsers className="text-secondary text-sm" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-heading font-num">+18% this week</p>
                  <p className="text-[8px] text-paragraph">Engagement up</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
