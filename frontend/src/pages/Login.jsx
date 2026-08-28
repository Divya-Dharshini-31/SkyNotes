import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email: email.trim(),
        password,
      });

      const token = response.data.token;

      if (!token) {
        setError("Login succeeded, but no authentication token was received.");
        return;
      }

      localStorage.setItem("token", token);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (error.response?.status === 403) {
        setError("Invalid email or password.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to connect to SkyNotes. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-logo">☁</div>

          <h1>SkyNotes</h1>

          <p>
            Your notes, organized in the cloud.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >
          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="form-message error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>

          <Link
            to="/register"
            className="link-button"
          >
            Create one
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;