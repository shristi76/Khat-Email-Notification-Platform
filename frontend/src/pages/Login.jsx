import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useState } from "react";
import "./Auth.css";
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-card">
        {/* This same logo is reused on all public-facing Khat pages. */}
        <div className="auth-brand">
          <img src="/logo.jpg" alt="Khat logo" />
          <span>Khat</span>
        </div>
        <h1>Welcome back</h1>
        <p className="auth-copy">
          Sign in to create and track reliable customer messages.
        </p>
        {location.state?.message && (
          <p className="alert success">{location.state.message}</p>
        )}
        {error && (
          <p className="alert error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button disabled={loading} type="submit">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
