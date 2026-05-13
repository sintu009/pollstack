import Navbar from "./landing/Navbar";
import Hero from "./landing/Hero";
import LogoCloud from "./landing/LogoCloud";
import Features from "./landing/Features";
import Stats from "./landing/Stats";
import HowItWorks from "./landing/HowItWorks";
import CTA from "./landing/CTA";
import Footer from "./landing/Footer";

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} />
      <LogoCloud />
      <Features />
      <Stats />
      <HowItWorks />
      <CTA onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}
