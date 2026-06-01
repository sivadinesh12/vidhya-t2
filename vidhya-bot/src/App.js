import React, { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./App.css";

// Component Imports
import Login        from './components/Login';
import Signup       from './components/signup';
import Welcome      from './components/Welcome';
import Home         from "./components/Home";
import NEETSyllabus from "./components/pages/NEETSyllabus";
import JEEBooks     from "./components/pages/Jeebooks";
import NCERTBooks   from "./components/pages/NCERTBooks";
import MockTests    from "./components/pages/MockTests";
import Analytics    from "./components/pages/Analytics";
import Flashcards   from "./components/pages/Flashcards";
import StudyPlanner from "./components/pages/StudyPlanner";
import Progress     from "./components/pages/Progress";
import VIDYAPage    from "./components/pages/VIDYA";

const GOOGLE_CLIENT_ID = "13111651638-rbfbn25jb9pf3ngbnvif4b07rgur8ur2.apps.googleusercontent.com";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("vidhya_user");
    return saved ? JSON.parse(saved).name : null;
  });

  const handleLogin  = (name) => setUser(name);
  const handleLogout = () => {
    localStorage.removeItem("vidhya_token");
    localStorage.removeItem("vidhya_user");
    setUser(null);
  };

  // Protected route wrapper
  const P = ({ el }) => user ? el : <Navigate to="/login" />;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login"         element={<Login  onLogin={handleLogin} />} />
          <Route path="/signup"        element={<Signup onLogin={handleLogin} />} />
          <Route path="/welcome"       element={<Welcome />} />

          {/* VIDYA AI is the default home after login */}
          <Route path="/vidya"         element={<P el={<VIDYAPage    userName={user} onLogout={handleLogout} />} />} />

          {/* Dashboard pages (with SideNav) */}
          <Route path="/home"          element={<P el={<Home         userName={user} onLogout={handleLogout} />} />} />
          <Route path="/neet"          element={<P el={<NEETSyllabus userName={user} onLogout={handleLogout} />} />} />
          <Route path="/jee"           element={<P el={<JEEBooks     userName={user} onLogout={handleLogout} />} />} />
          <Route path="/ncert"         element={<P el={<NCERTBooks   userName={user} onLogout={handleLogout} />} />} />
          <Route path="/mock-tests"    element={<P el={<MockTests    userName={user} onLogout={handleLogout} />} />} />
          <Route path="/analytics"     element={<P el={<Analytics    userName={user} onLogout={handleLogout} />} />} />
          <Route path="/flashcards"    element={<P el={<Flashcards   userName={user} onLogout={handleLogout} />} />} />
          <Route path="/study-planner" element={<P el={<StudyPlanner userName={user} onLogout={handleLogout} />} />} />
          <Route path="/progress"      element={<P el={<Progress     userName={user} onLogout={handleLogout} />} />} />

          {/* Fallback → VIDYA AI if logged in, else login */}
          <Route path="*" element={user ? <Navigate to="/vidya" /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}