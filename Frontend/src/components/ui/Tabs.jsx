import { useState } from "react";

export default function Tabs({ tabs, defaultTab, onChange }) {
  const [active, setActive] = useState(defaultTab || tabs[0]);

  const handleClick = (tab) => {
    setActive(tab);
    onChange?.(tab);
  };

  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleClick(tab)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
            active === tab
              ? "text-primary border-b-2 border-primary"
              : "text-paragraph hover:text-heading"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
