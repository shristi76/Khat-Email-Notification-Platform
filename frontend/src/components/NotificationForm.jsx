import { useState } from "react";
import api from "../services/api";
import "./Notificationform.css";

function NotificationForm({ refreshNotifications }) {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFeedback("");
    setLoading(true);

    try {
      const response = await api.post("/notifications/send", {
        recipients,
        subject,
        message,
      });

      setFeedback(response.data.message);

      setRecipients("");
      setSubject("");
      setMessage("");

      refreshNotifications();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card composer-card">
      <div className="card-title">
        <div>
          <h2>Compose delivery</h2>
        </div>
      </div>
      <p className="form-hint">
        Send to up to 50 people. Separate addresses with commas or new lines;
        replies go to your Khat account email.
      </p>
      {feedback && <p className="alert success">{feedback}</p>}
      {error && (
        <p className="alert error" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Recipients
          <textarea
            placeholder="alex@company.com, maya@company.com"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            required
          />
        </label>

        <label>
          Subject
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </label>

        <label>
          Message
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </label>

        <button className="send-button" disabled={loading} type="submit">
          <span>{loading ? "Sending to recipients…" : "Send email"}</span>
        </button>
      </form>
    </section>
  );
}

export default NotificationForm;
