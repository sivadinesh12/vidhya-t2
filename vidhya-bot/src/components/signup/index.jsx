import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import vidyaLogo from "../../assets/logo.png";
const API_URL = "http://localhost:5000/api/v1";

const saveSession = (token, user) => {
  localStorage.setItem("vidhya_token", token);
  localStorage.setItem("vidhya_user", JSON.stringify(user));
};

export default function Signup({ onLogin }) {
  const [name,             setName]             = useState("");
  const [email,            setEmail]            = useState("");
  const [mobile,           setMobile]           = useState("");
  const [educationLevel,   setEducationLevel]   = useState("");
  const [schoolClass,      setSchoolClass]      = useState("");
  const [schoolBoard,      setSchoolBoard]      = useState("");
  const [collegeDepartment,setCollegeDepartment]= useState("");
  const [password,         setPassword]         = useState("");
  const [error,            setError]            = useState("");
  const [loading,          setLoading]          = useState(false);
  const navigate = useNavigate();

  const handleEducationChange = (e) => {
    setEducationLevel(e.target.value);
    setSchoolClass(""); setSchoolBoard(""); setCollegeDepartment("");
  };

  // Map our educationLevel to the backend's TargetExam enum
  const getTargetExam = () => {
    if (educationLevel === "neet")    return "NEET";
    if (educationLevel === "jee")     return "JEE_MAINS";
    if (educationLevel === "college") return "OTHER";
    return "BOARDS"; // school
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !mobile || !password || !educationLevel) {
      setError("Please fill in all required fields."); return;
    }
    if (educationLevel === "school" && (!schoolClass || !schoolBoard)) {
      setError("Please select your syllabus and class."); return;
    }
    if (educationLevel === "college" && !collegeDepartment) {
      setError("Please select your department."); return;
    }
    if (!/^[0-9]{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number."); return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({
          name,
          email       : email.toLowerCase(),
          password,
          target_exam : getTargetExam(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Account created successfully in the backend
        saveSession(data.data.token, data.data.user);
        if (onLogin) onLogin(data.data.user.name);
        
        // Navigate to the welcome page instead of home
        navigate("/welcome"); 
      } else {
        setError(data.detail || data.message || "Signup failed. Please try again.");
      }
    } catch {
      setError("Cannot reach server. Make sure your Python backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      {/* Left panel */}
      <div className="login-left">
        <div className="brand-badge">
          <img 
            src={vidyaLogo} 
            alt="Vidhya Logo" 
            className="brand-logo-img" 
          />
        </div>
        <h1 className="login-headline">Start Your<br /><em>Success</em><br />Story Today.</h1>
        <p className="login-sub">Join thousands of students preparing for NEET, JEE and Board exams.</p>
      </div>

      {/* Right panel */}
      <div className="login-right">
        <div className="login-card fade-up">
          <h2>Create Account ✨</h2>
          <p>Join VIDYA and start learning today.</p>

          {error && (
            <div className="error-banner">⚠️ {error}</div>
          )}

          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">FULL NAME</label>
              <input className="form-input" placeholder="Enter your name"
                value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">EMAIL ADDRESS</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">MOBILE NUMBER</label>
              <input className="form-input" type="tel" placeholder="10-digit number"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
                maxLength="10" />
            </div>

            <div className="form-group">
              <label className="form-label">STUDYING FOR</label>
              <select className="form-input" value={educationLevel}
                onChange={handleEducationChange}
                style={{ cursor:"pointer", appearance:"auto" }}>
                <option value="" disabled>Select an option</option>
                <option value="school">School (Class 6–12)</option>
                <option value="college">College</option>
                <option value="neet">NEET</option>
                <option value="jee">JEE</option>
              </select>
            </div>

            {educationLevel === "school" && (
              <>
                <div className="form-group fade-up">
                  <label className="form-label">SYLLABUS</label>
                  <select className="form-input" value={schoolBoard}
                    onChange={e => setSchoolBoard(e.target.value)}
                    style={{ cursor:"pointer", appearance:"auto" }}>
                    <option value="" disabled>Choose syllabus</option>
                    <option value="cbse">CBSE</option>
                    <option value="tn_state">TN State Syllabus</option>
                  </select>
                </div>
                <div className="form-group fade-up">
                  <label className="form-label">CLASS</label>
                  <select className="form-input" value={schoolClass}
                    onChange={e => setSchoolClass(e.target.value)}
                    style={{ cursor:"pointer", appearance:"auto" }}>
                    <option value="" disabled>Choose class</option>
                    {["6th","7th","8th","9th","10th","11th","12th"].map(c =>
                      <option key={c} value={c}>{c} Standard</option>
                    )}
                  </select>
                </div>
              </>
            )}

            {educationLevel === "college" && (
              <div className="form-group fade-up">
                <label className="form-label">DEPARTMENT</label>
                <select className="form-input" value={collegeDepartment}
                  onChange={e => setCollegeDepartment(e.target.value)}
                  style={{ cursor:"pointer", appearance:"auto" }}>
                  <option value="" disabled>Choose department</option>
                  <option value="engineering">Engineering / Technology</option>
                  <option value="arts_science">Arts &amp; Science</option>
                  <option value="commerce">Commerce / Management</option>
                  <option value="medical">Medical / Health Sciences</option>
                  <option value="law">Law</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">PASSWORD</label>
              <input className="form-input" type="password" placeholder="Min 6 characters"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="btn-primary"
              style={{ width:"100%", justifyContent:"center" }}
              disabled={loading}>
              {loading ? "Creating account…" : "Create Free Account 🚀"}
            </button>
          </form>

          <div className="signup-row" style={{ marginTop:20, textAlign:"center" }}>
            Already have an account?{" "}
            <button className="link-btn" onClick={() => navigate("/login")}>Sign In →</button>
          </div>
        </div>
      </div>
    </div>
  );
}