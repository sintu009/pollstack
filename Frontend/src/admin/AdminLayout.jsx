import { useState } from "react";
import { useDispatch } from "react-redux";
import { HiLogout, HiSearch, HiBell, HiChevronDown } from "react-icons/hi";
import AppSidebar from "../components/ui/AppSidebar";
import { logout } from "../store/slices/authSlice";

export default function AdminLayout({ children, activePage, onNavigate, user }) {
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <AppSidebar active={activePage} onNavigate={onNavigate} user={user} onLogout={() => dispatch(logout())} />

      <div className="flex-1 lg:ml-56 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border/50 px-4 md:px-6 lg:px-8 py-2.5">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Search */}
            <div className="flex-1 max-w-md hidden md:block">
               
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2"> 
             

              {/* User Menu */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-btn hover:bg-surface cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium text-heading leading-tight">{user.name}</p>
                      <p className="text-[10px] text-paragraph leading-tight">{user.email}</p>
                    </div>
                    <HiChevronDown className={`text-paragraph text-sm transition-transform hidden sm:block ${showDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-btn border border-border shadow-elevated z-50 py-1">
                        <div className="px-3 py-2 border-b border-border/50">
                          <p className="text-sm font-medium text-heading truncate">{user.name}</p>
                          <p className="text-xs text-paragraph truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { dispatch(logout()); setShowDropdown(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                        >
                          <HiLogout /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
