import React, { useState } from "react";
// Import GoogleLogin instead of useGoogleLogin
import { GoogleLogin } from "@react-oauth/google";
import AppleSignin from "react-apple-signin-auth";
import { useNavigate } from "react-router-dom"; 
import "./index.css"; 

export default function Login({ onLogin }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) { setError("Please enter your credentials."); return; }
    if (!emailRegex.test(email)) { setError("Please enter a valid email format."); return; }
    if (password.length < 4) { setError("Password too short."); return; }
    setError("");
    onLogin(email.split("@")[0] || "Student"); 
    navigate("/Home"); 
  };

  // NEW: Function to send the Google token to your FastAPI backend
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Make sure this matches the port your FastAPI server is running on (8000 or 5000)
      const response = await fetch("http://127.0.0.1:5000/api/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential, // The JWT token your backend needs
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // data.user.name comes directly from your Python backend!
        onLogin(data.user.name); 
        navigate("/Home");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Google Login failed on server.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Is your Python server running?");
    }
  };

  const handleAppleSuccess = (response) => { onLogin("Apple User"); navigate("/"); };

  return (
    <div className="login-wrap">
      {/* ... (Left section remains the same) ... */}
      <div className="login-left">
        <div className="brand-badge">
          <div className="brand-badge-dot" />
          <span>Vidhya</span>
        </div>
        <h1 className="login-headline">Master Every<br /><em>Exam</em> with<br />Confidence.</h1>
      </div>

      <div className="login-right">
        <div className="login-card fade-up">
          <h2>Welcome back 👋</h2>
          <p>Sign in to continue your study journey.</p>

          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.replace(/[^a-zA-Z0-9@._-]/g, ""))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleSubmit}>Sign In →</button>

          <div className="divider">or continue with</div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            
            {/* GOOGLE BUTTON: Replaced with official component for JWT retrieval */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin 
                onSuccess={handleGoogleSuccess} 
                onError={() => setError("Google Auth popup closed or failed.")} 
                theme="outline"
                shape="rectangular"
              />
            </div>

            {/* APPLE BUTTON */}
            <AppleSignin
              authOptions={{ clientId: 'com.yourdomain.vidhya', scope: 'email name', redirectURI: 'https://yourdomain.com/login', usePopup: true }}
              uiType="dark"
              onSuccess={handleAppleSuccess}
              render={(props) => (
                <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '40px' }} {...props}>
                  <svg width="18" height="18" viewBox="0 0 384 512">
                    <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-14.7 0-51.4-22.2-83.9-22.4-43.9-.3-81.8 24.4-104.2 62.7-45 76.5-11.5 190.4 31.5 254.2 21 30.2 46.6 63.7 79.4 62.5 31.5-1.2 43.6-20.3 81.7-20.3 38 0 49 20.3 82.3 19.6 34.1-.7 56.4-30.2 77.2-60.6 24.2-35.1 33.9-69.2 34.3-70.9-1-.4-66.2-25.5-66.4-102.2zM260.5 51.7c16.1-20 26.9-47.8 24-75.7-23.9 1-52.7 16-69.9 36.4-15.5 18.2-29.1 46.4-25.3 73.3 26.5 2.1 53.6-14.1 71.2-34z"/>
                  </svg>
                  Apple
                </button>
              )}
            />
          </div>

          <div className="signup-row">
            New to Vidhya? <button onClick={() => navigate("/signup")}>Create free account</button>
          </div>
        </div>
      </div>
    </div>
  );
}