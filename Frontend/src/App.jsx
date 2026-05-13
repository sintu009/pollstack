import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminApp from "./admin/AdminApp";
import SharedPollPage from "./user/components/SharedPollPage";
import LandingPage from "./pages/LandingPage";

function getRoute() {
  const path = window.location.pathname;
  const match = path.match(/^\/poll\/(.+)$/);
  if (match) return { type: "poll", link: match[1] };
  if (path === "/admin" || path.startsWith("/admin")) return { type: "admin" };
  return { type: "landing" };
}

export default function App() {
  const [route, setRoute] = useState(getRoute());
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, "", path);
    setRoute(getRoute());
  };

  // Shared poll page
  if (route.type === "poll") {
    return <SharedPollPage shareLink={route.link} />;
  }

  // If logged in or navigating to admin
  if (route.type === "admin" || token) {
    return <AdminApp />;
  }

  // Landing page
  return <LandingPage onGetStarted={() => navigateTo("/admin")} />;
}
