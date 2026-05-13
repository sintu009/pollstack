import logo from "../../assets/logopollstack.png";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* Logo with pulse rings */}
      <div className="relative w-20 h-20 mb-6">
        {/* Ping rings */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping-slow" />
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping-slower" />
        {/* Logo circle */}
        <div className="relative w-20 h-20 rounded-full bg-white shadow-elevated flex items-center justify-center animate-bounce-subtle z-10">
          <img src={logo} alt="Loading" className="h-10 object-contain" />
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-2 h-2 rounded-full bg-primary animate-dot-bounce" />
        <span className="w-2 h-2 rounded-full bg-primary animate-dot-bounce animation-delay-200" />
        <span className="w-2 h-2 rounded-full bg-primary animate-dot-bounce animation-delay-400" />
      </div>

      <p className="text-sm text-paragraph animate-pulse">Loading your workspace...</p>
    </div>
  );
}
