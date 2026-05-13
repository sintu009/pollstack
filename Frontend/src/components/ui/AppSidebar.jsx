import { useState } from "react";
import { HiHome, HiClipboardList, HiReply, HiChartBar, HiDocumentText, HiTemplate, HiPlus, HiMenu, HiX, HiLogout } from "react-icons/hi";
import { Avatar } from "./index";
import logo from "../../assets/logopollstack.png";

const navItems = [
  { icon: HiHome, label: "Dashboard" },
  { icon: HiClipboardList, label: "My Polls" },
  { icon: HiReply, label: "Responses" },
  { icon: HiChartBar, label: "Analytics" },
  { icon: HiDocumentText, label: "Published Results" },
  { icon: HiTemplate, label: "Templates" },
];

export default function AppSidebar({ active = "Dashboard", onNavigate, user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-btn shadow-card cursor-pointer"
      >
        <HiMenu className="text-xl text-heading" />
      </button>

      {open && <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setOpen(false)} />}

      <aside className={`w-56 h-screen bg-white border-r border-border flex flex-col fixed left-0 top-0 z-50 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <img src={logo} alt="PollStack" className="h-8" />
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden cursor-pointer text-paragraph">
            <HiX className="text-xl" />
          </button>
        </div>

        <div className="px-4 mb-4">
          <button
            onClick={() => { onNavigate?.("Create Poll"); setOpen(false); }}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium text-sm py-2.5 rounded-btn hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <HiPlus /> Create Poll
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { onNavigate?.(item.label); setOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm transition-colors cursor-pointer ${
                active === item.label
                  ? "text-primary font-medium bg-primary/5"
                  : "text-paragraph hover:text-heading hover:bg-surface"
              }`}
            >
              <item.icon className="text-lg" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-border px-4 py-3 space-y-2">
          {user && (
            <div className="flex items-center gap-3">
              <Avatar name={user.name} />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-heading text-sm font-medium truncate">{user.name}</span>
                <span className="text-paragraph text-xs truncate">{user.email}</span>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-btn text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
          >
            <HiLogout className="text-lg" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
