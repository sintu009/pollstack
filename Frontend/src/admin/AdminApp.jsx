import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMe } from "../store/slices/authSlice";
import AdminLayout from "./AdminLayout";
import LoginPage from "./components/LoginPage";
import LoadingScreen from "../components/ui/LoadingScreen";
import DashboardPage from "../pages/DashboardPage";
import MyPollsPage from "../pages/MyPollsPage";
import CreatePollPage from "../pages/CreatePollPage";
import ResponsesPage from "../pages/ResponsesPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import PublishedResultsPage from "../pages/PublishedResultsPage";
import TemplatesPage from "../pages/TemplatesPage";
import SettingsPage from "../pages/SettingsPage";

const pages = {
  Dashboard: DashboardPage,
  "My Polls": MyPollsPage,
  "Create Poll": null, // handled separately
  Responses: ResponsesPage,
  Analytics: AnalyticsPage,
  "Published Results": PublishedResultsPage,
  Templates: TemplatesPage,
  Settings: SettingsPage,
};

export default function AdminApp() {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);
  const [activePage, setActivePage] = useState("Dashboard");

  // Restore session on refresh if token exists
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, [token, user, dispatch]);

  // Show loading while restoring session
  if (token && !user) {
    return <LoadingScreen />;
  }

  // Show login if no token or no user
  if (!token || (!user && !loading)) {
    return <LoginPage />;
  }

  const PageComponent = pages[activePage] || DashboardPage;

  return (
    <AdminLayout activePage={activePage} onNavigate={setActivePage} user={user}>
      {activePage === "Create Poll" ? (
        <CreatePollPage onClose={() => setActivePage("My Polls")} />
      ) : (
        <PageComponent onNavigate={setActivePage} />
      )}
    </AdminLayout>
  );
}
