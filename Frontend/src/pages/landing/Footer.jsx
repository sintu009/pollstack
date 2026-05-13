import logo from "../../assets/logopollstack.png";

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 md:py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt="PollStack" className="h-8" />
            </div>
            <p className="text-xs text-paragraph leading-relaxed">Create beautiful polls, collect feedback, and make data-driven decisions.</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-heading uppercase tracking-wider mb-3">Product</h4>
            <div className="flex flex-col gap-2 text-xs text-paragraph">
              <a href="#" className="hover:text-primary transition-colors">Features</a>
              <a href="#" className="hover:text-primary transition-colors">Pricing</a>
              <a href="#" className="hover:text-primary transition-colors">Templates</a>
              <a href="#" className="hover:text-primary transition-colors">Integrations</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-heading uppercase tracking-wider mb-3">Company</h4>
            <div className="flex flex-col gap-2 text-xs text-paragraph">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Blog</a>
              <a href="#" className="hover:text-primary transition-colors">Careers</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-heading uppercase tracking-wider mb-3">Legal</h4>
            <div className="flex flex-col gap-2 text-xs text-paragraph">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-paragraph">© 2025 PollStack. All rights reserved.</p>
          <div className="flex items-center gap-4 text-paragraph">
            <a href="#" className="hover:text-primary transition-colors text-sm">𝕏</a>
            <a href="#" className="hover:text-primary transition-colors text-sm">in</a>
            <a href="#" className="hover:text-primary transition-colors text-sm">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
