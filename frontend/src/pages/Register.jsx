import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (field) => (event) =>
    setForm({ ...form, [field]: event.target.value });
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/", { state: { message: "Account created. Please sign in." } });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to create your account. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="form-card">
        {/* The logo is loaded from frontend/public/logo.png. */}
        <div className="auth-brand">
          <img src="/logo.jpg" alt="Khat logo" />
          <span>Khat</span>
        </div>
        <h1>Create your workspace</h1>
        <p className="auth-copy">
          A focused place to send important messages with confidence.
        </p>
        {error && (
          <p className="alert error" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              required
              maxLength="100"
              value={form.name}
              onChange={update("name")}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={update("email")}
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              minLength="8"
              value={form.password}
              onChange={update("password")}
            />
          </label>
          <button disabled={loading} type="submit">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
export default Register;
