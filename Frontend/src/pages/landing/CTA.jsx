import { HiArrowRight } from "react-icons/hi";
import { Button } from "../../components/ui";

export default function CTA({ onGetStarted }) {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-heading rounded-2xl p-8 sm:p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-sm md:text-base text-white/60 mb-8 max-w-md mx-auto">
              Join 10,000+ teams already using PollStack to make better, faster decisions.
            </p>
            <Button variant="primary" size="lg" onClick={onGetStarted} className="text-base px-8 py-3">
              Create Your First Poll <HiArrowRight />
            </Button>
            {/* <p className="text-xs text-white/40 mt-4">Free forever • No credit card required</p> */}
          </div>
        </div>
      </div>
    </section>
  );
}
