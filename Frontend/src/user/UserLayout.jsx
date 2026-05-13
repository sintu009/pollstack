import { HiLockClosed } from "react-icons/hi";
import logo from "../assets/logopollstack.png";

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      <header className="bg-white/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-30 px-4 md:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <img src={logo} alt="PollStack" className="h-9" />
          <div className="flex items-center gap-1.5 text-xs text-paragraph">
            <HiLockClosed className="text-primary" />
            <span>Secure & Anonymous</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 md:px-8 md:py-10">{children}</main>

      <footer className="text-center py-6 text-xs text-paragraph">
        Powered by <span className="font-medium text-heading">PollStack</span> • Your responses are anonymous & encrypted
      </footer>
    </div>
  );
}
