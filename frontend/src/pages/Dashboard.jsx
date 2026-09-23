import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import NotificationForm from "../components/NotificationForm";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // The dashboard cards use these recent delivery records for their totals.
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const sentCount = notifications.filter(
    (notification) => notification.status === "SENT",
  ).length;
  const failedCount = notifications.filter(
    (notification) => notification.status === "FAILED",
  ).length;

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  // Keep API loading in one function so the composer can refresh the totals after sending.
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.get("/notifications?limit=25");

      setNotifications(response.data.notifications);
    } catch (requestError) {
      if (requestError.response?.status === 401) return handleLogout();
      setError("Could not load delivery history. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const timer = window.setTimeout(fetchNotifications, 0);
    return () => window.clearTimeout(timer);
  }, [fetchNotifications]);

  return (
    <>
      <Navbar onLogout={handleLogout} />

      <main className="dashboard">
        <section className="stats" aria-label="Delivery statistics">
          <div>
            <span>Tracked deliveries</span>
            <strong>{notifications.length}</strong>
          </div>
          <div>
            <span>Successfully sent</span>
            <strong>{sentCount}</strong>
          </div>
          <div>
            <span>Needs attention</span>
            <strong>{failedCount}</strong>
          </div>
        </section>
        <div className="dashboard-content">
          {error && (
            <p className="alert error">
              Could not load dashboard data. Please refresh the page.
            </p>
          )}
          {loading ? (
            <p className="loading">Loading workspace…</p>
          ) : (
            <NotificationForm refreshNotifications={fetchNotifications} />
          )}
        </div>
      </main>
    </>
  );
}

export default Dashboard;
