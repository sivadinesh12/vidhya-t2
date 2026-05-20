import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./index.css";

const API_URL = "http://localhost:5000/api/v1";

const saveSession = (token, user) => {
  localStorage.setItem("vidhya_token", token);
  localStorage.setItem("vidhya_user", JSON.stringify(user));
};

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password)     { setError("Please enter your credentials."); return; }
    if (!emailRegex.test(email)) { setError("Please enter a valid email."); return; }
    if (password.length < 4)     { setError("Password too short."); return; }

    setError("");
    setLoading(true);

    try {
      const res  = await fetch(`${API_URL}/auth/login`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ email: email.toLowerCase(), password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        saveSession(data.data.token, data.data.user);
        onLogin(data.data.user.name);
        navigate("/home");
      } else {
        setError(data.detail || data.message || "Invalid email or password.");
      }
    } catch {
      setError("Cannot reach server. Start your Python backend on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API_URL}/auth/google`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        saveSession(data.data.token, data.data.user);
        onLogin(data.data.user.name);
        navigate("/home");
      } else {
        setError(data.detail || data.message || "Google login failed. Try email login instead.");
      }
    } catch {
      setError("Cannot reach server. Start your Python backend on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    // Google OAuth errors usually mean the Client ID domain is not authorized.
    // The user needs to add their domain to the Google Cloud Console.
    setError(
      "Google sign-in failed. Make sure http://localhost:3000 is added as an " +
      "Authorized JavaScript Origin in your Google Cloud Console for this Client ID."
    );
  };

  return (
    <div className="login-wrap">
      {/* Left dark panel */}
      <div className="login-left">
        <div className="brand-badge">
          <span className="brand-dot" />
          <span>VIDHYA</span>
        </div>
        <h1 className="login-headline">
          Master Every<br />
          <em>Exam</em> with<br />
          Confidence.
        </h1>
      </div>

      {/* Right cream panel */}
      <div className="login-right">
        <div className="login-card">
          <h2>Welcome back 👋</h2>
          <p>Sign in to continue your study journey.</p>

          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">EMAIL ADDRESS</label>
            <input
              className="form-input"
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <input
              className="form-input"
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          <div className="divider"><span>or continue with</span></div>

          <div className="social-row">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              shape="rectangular"
              width="360"
            />
          </div>

          <div className="google-note">
            ℹ️ Google sign-in requires your backend to be running and{" "}
            <code>http://localhost:3000</code> added to your Google Cloud Console OAuth origins.
          </div>

          <div className="signup-row">
            New to Vidhya?{" "}
            <button className="link-btn" onClick={() => navigate("/signup")}>
              Create free account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
