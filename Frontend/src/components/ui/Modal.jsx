import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, className = "" }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-card rounded-card shadow-elevated p-6 w-full max-w-lg mx-4 animate-in ${className}`}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-heading">{title}</h3>
            <button onClick={onClose} className="text-paragraph hover:text-heading cursor-pointer text-xl leading-none">&times;</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
