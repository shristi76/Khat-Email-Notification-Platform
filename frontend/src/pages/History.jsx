import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NotificationList from "../components/NotificationList";
import api from "../services/api";
import "./History.css";

function History() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [state, setState] = useState("loading");

  // Load history once when this protected page opens.
  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const response = await api.get("/notifications?limit=50");
        setNotifications(response.data.notifications);
        setState("ready");
      } catch (error) {
        if (error.response?.status === 401) navigate("/");
        else setState("error");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <>
      <Navbar onLogout={handleLogout} />
      <main className="history-page">
        <section className="history-hero">
          <p className="eyebrow">DELIVERY HISTORY</p>
          <p>Review the 50 most recent emails sent from your Khat workspace.</p>
        </section>
        {state === "loading" && (
          <p className="loading page-state">Loading delivery history…</p>
        )}
        {state === "error" && (
          <p className="alert error page-state">
            Could not load delivery history. Please refresh and try again.
          </p>
        )}
        {state === "ready" && (
          <NotificationList notifications={notifications} />
        )}
      </main>
    </>
  );
}

export default History;
