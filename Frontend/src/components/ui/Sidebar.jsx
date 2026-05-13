import { useState } from "react";

const navItems = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "polls", label: "My Polls" },
  { icon: "create", label: "Create Poll" },
  { icon: "responses", label: "Responses" },
  { icon: "analytics", label: "Analytics" },
  { icon: "published", label: "Published Results" },
  { icon: "settings", label: "Settings" },
];

export default function Sidebar({ active = "Dashboard", onNavigate, user }) {
  return (
    <aside className="w-60 h-screen bg-sidebar flex flex-col justify-between p-4 fixed left-0 top-0">
      {/* Logo */}
      <div>
        <div className="flex items-center gap-2 px-3 py-4 mb-4">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">⚡</span>
          </div>
          <span className="text-white font-bold text-lg">PollStack</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate?.(item.label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                active === item.label
                  ? "bg-primary text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* User */}
      {user && (
        <div className="flex items-center gap-3 px-3 py-3 border-t border-white/10 mt-4">
          <Avatar name={user.name} />
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">{user.name}</span>
            <span className="text-gray-400 text-xs">{user.email}</span>
          </div>
        </div>
      )}
    </aside>
  );
}

function Avatar({ name, size = "sm" }) {
  const s = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${s} rounded-full bg-primary flex items-center justify-center text-white font-medium`}>
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

function NavIcon({ name }) {
  const icons = {
    dashboard: "□",
    polls: "📋",
    create: "+",
    responses: "↩",
    analytics: "📊",
    published: "📄",
    settings: "⚙",
  };
  return <span className="w-5 text-center">{icons[name] || "•"}</span>;
}

export { Avatar };
