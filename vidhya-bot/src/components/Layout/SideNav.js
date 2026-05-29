import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SideNav.css";

// "Study" section completely removed
const NAV = [
  {
    label: "Main",
    items: [
      { icon: "🏠", label: "Home",         path: "/home" },
    ],
  },
  {
    label: "Practice",
    items: [
      { icon: "📝", label: "Mock Tests",   path: "/mock-tests" },
      { icon: "🗂️", label: "Flashcards",  path: "/flashcards" },
      { icon: "🎯", label: "Planner",      path: "/study-planner" },
    ],
  },
  {
    label: "Insights",
    items: [
      { icon: "📊", label: "Analytics",   path: "/analytics" },
      { icon: "📈", label: "Progress",    path: "/progress" },
    ],
  },
  {
    label: "AI Tutor",
    items: [
      { icon: "🤖", label: "VIDYA AI",    path: "/vidya" },
    ],
  },
];

export default function SideNav({ userName, onLogout, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`sidenav ${collapsed ? "collapsed" : ""}`}>
      
      {/* HEADER WITH ICON AND TEXT LOGO */}
      <div className="sidenav-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* 1. The Icon */}
        <img 
          src={require("../../assets/vidya_icon.png")} 
          alt="Vidya Icon" 
          style={{ width: '36px', height: '36px', borderRadius: '8px' }} 
        />
        
        {/* 2. The Text Logo */}
        <img 
          src={require("../../assets/vidya_text.png")} 
          alt="Vidya Text Logo" 
          className="sidenav-brand" 
          style={{ 
            height: '70px', 
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)' // 🔥 This forces the colored text to pure white
          }} 
        />
        
      </div>

      {/* Collapse toggle */}
      <button className="sidenav-toggle" onClick={() => setCollapsed(c => !c)}>
        {collapsed ? "›" : "‹"}
      </button>

      {/* Nav */}
      <nav className="sidenav-nav">
        {NAV.map(section => (
          <div key={section.label} className="sidenav-section">
            {!collapsed && <div className="sidenav-section-label">{section.label}</div>}
            {section.items.map(item => (
              <button
                key={item.path}
                className={`sidenav-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : ""}
              >
                <span className="sidenav-item-icon">{item.icon}</span>
                {!collapsed && <span className="sidenav-item-label">{item.label}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidenav-footer">
        <div className="sidenav-user">
          <div className="sidenav-avatar">{userName?.[0]?.toUpperCase() || "S"}</div>
          {!collapsed && (
            <div className="sidenav-user-info">
              <div className="sidenav-user-name">{userName}</div>
              <div className="sidenav-user-role">Student</div>
            </div>
          )}
        </div>
        <button className="sidenav-logout" onClick={onLogout} title="Sign Out">
          {collapsed ? "⏻" : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}