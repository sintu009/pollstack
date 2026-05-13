import { useState, useEffect } from "react";
import { HiArrowRight, HiMenuAlt3, HiX } from "react-icons/hi";
import { Button } from "../../components/ui";
import logo from "../../assets/logopollstack.png";

export default function Navbar({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="PollStack" className="h-9" />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-paragraph">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={onGetStarted} className="text-sm font-medium text-heading cursor-pointer hover:text-primary transition-colors">
            Sign In
          </button>
          <Button variant="primary" size="sm" onClick={onGetStarted}>
            Get Started <HiArrowRight />
          </Button>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-heading cursor-pointer">
          {mobileOpen ? <HiX className="text-2xl" /> : <HiMenuAlt3 className="text-2xl" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-3 animate-fade-in-down">
          <a href="#features" className="block text-sm text-paragraph py-2">Features</a>
          <a href="#how-it-works" className="block text-sm text-paragraph py-2">How it Works</a>
          <a href="#pricing" className="block text-sm text-paragraph py-2">Pricing</a>
          <Button variant="primary" size="md" onClick={onGetStarted} className="w-full mt-2">
            Get Started <HiArrowRight />
          </Button>
        </div>
      )}
    </nav>
  );
}
