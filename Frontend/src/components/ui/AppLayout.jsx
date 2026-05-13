import AppSidebar from "./AppSidebar";

export default function AppLayout({ children, activePage, onNavigate, user }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <AppSidebar active={activePage} onNavigate={onNavigate} user={user} />
      <main className="flex-1 lg:ml-56 p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
