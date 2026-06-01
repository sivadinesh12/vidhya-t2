import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import "./index.css";

const CHAPTERS = [
  { name: "Cell: The Unit of Life", subject: "NCERT Biology XI",   pct: 78, color: "#1e8449", bg: "#d5f5e3", icon: "🧬" },
  { name: "Thermodynamics",         subject: "NCERT Physics XI",   pct: 55, color: "#1a5276", bg: "#d6eaf8", icon: "⚛️" },
  { name: "Chemical Bonding",       subject: "NCERT Chemistry XI", pct: 90, color: "#7d3c98", bg: "#e8daef", icon: "🧪" },
  { name: "Organic Chemistry",      subject: "NCERT Chemistry XII",pct: 42, color: "#c0392b", bg: "#fadbd8", icon: "🔬" },
];

const SCHEDULE = [
  { time: "9 AM",  name: "NEET Mock Test – Physics", detail: "90 min · Full Syllabus", color: "#1a5276" },
  { time: "12 PM", name: "NCERT Biology – Genetics",  detail: "Chapter 5 & 6 Revision", color: "#1e8449" },
  { time: "3 PM",  name: "JEE Practice Paper #7",     detail: "Chemistry · 60 min",    color: "#c0392b" },
  { time: "6 PM",  name: "Doubt Clearing Session",    detail: "Physics Mechanics",      color: "#c9922a" },
];

// SVG outline icons — plain, professional
const NAV_ICONS = {
  MockTests: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <line x1="8" y1="7" x2="16" y2="7"/>
      <line x1="8" y1="11" x2="16" y2="11"/>
      <line x1="8" y1="15" x2="12" y2="15"/>
      <polyline points="14 16 16 18 20 14"/>
    </svg>
  ),
  Flashcards: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2"/>
      <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
    </svg>
  ),
  Planner: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Analytics: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
      <line x1="2"  y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Progress: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
};

const TOP_NAV = [
  { key: "MockTests",  label: "Mock Tests", path: "/mock-tests"    },
  { key: "Flashcards", label: "Flashcards", path: "/flashcards"    },
  { key: "Planner",    label: "Planner",    path: "/study-planner" },
  { key: "Analytics",  label: "Analytics",  path: "/analytics"     },
  { key: "Progress",   label: "Progress",   path: "/progress"      },
];

export default function Home({ userName, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <PageLayout userName={userName} onLogout={onLogout}>
      <div className="home-page">

        {/* ── Professional Top Navbar ── */}
        <header className="home-topbar">
          <div className="home-topbar-left">
            <span className="home-topbar-title">Dashboard</span>
          </div>
          <div className="home-topbar-right">
            <nav className="home-topnav">
              {TOP_NAV.map(item => (
                <button
                  key={item.key}
                  className={`home-topnav-btn ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="home-topnav-icon">{NAV_ICONS[item.key]}</span>
                  <span className="home-topnav-label">{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="home-topbar-divider" />
            <div className="home-topbar-user">
              <div className="home-topbar-avatar">
                {userName?.[0]?.toUpperCase() || "S"}
              </div>
              <span className="home-topbar-username">{userName}</span>
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="home-hero">
          <div className="home-hero-inner">
            <div className="home-hero-content">
              <div className="home-hero-tag">✨ 2025–26 Session Active</div>
              <h1>Hello, <span className="home-hero-name">{userName}!</span><br />Ready to Study?</h1>
              <p>Your personalised dashboard is loaded. Continue where you left off or explore new chapters today.</p>
              <div className="home-hero-btns">
                <button className="home-btn-solid"   onClick={() => navigate('/neet')}>Start Preparing</button>
                <button className="home-btn-outline" onClick={() => navigate('/mock-tests')}>Take a Mock Test</button>
              </div>
            </div>
            <div className="home-hero-stats">
              {[["247","Chapters Done"],["89%","Avg. Score"],["18","Day Streak"]].map(([n,l]) => (
                <div key={l} className="home-stat-card">
                  <div className="home-stat-num">{n}</div>
                  <div className="home-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="home-main">
          {/* Quick Access */}
          <div className="home-section-header">
            <h2 className="home-section-title">Quick <span>Access</span></h2>
          </div>
          <div className="home-quick-grid">
            {TOP_NAV.map(q => (
              <div key={q.key} className="home-quick-card fade-up" onClick={() => navigate(q.path)}>
                <div className="home-quick-icon">{NAV_ICONS[q.key]}</div>
                <div className="home-quick-text">
                  <div className="home-quick-title">{q.label}</div>
                </div>
                <div className="home-quick-arrow">›</div>
              </div>
            ))}
          </div>

          {/* Progress + Schedule */}
          <div className="home-section-header">
            <h2 className="home-section-title">Your <span>Progress</span></h2>
            <button className="home-see-all" onClick={() => navigate('/progress')}>Full Report →</button>
          </div>
          <div className="home-progress-section">
            <div className="home-progress-card">
              <h3>Chapter Progress</h3>
              {CHAPTERS.map(c => (
                <div key={c.name} className="home-chapter-item">
                  <div className="home-chapter-icon" style={{ background: c.bg }}>{c.icon}</div>
                  <div className="home-chapter-info">
                    <div className="home-chapter-name">{c.name}</div>
                    <div className="home-chapter-sub">{c.subject}</div>
                    <div className="home-progress-bar-wrap">
                      <div className="home-progress-bar">
                        <div className="home-progress-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                      </div>
                      <div className="home-progress-pct" style={{ color: c.color }}>{c.pct}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="home-progress-card">
              <h3>Today's Schedule</h3>
              <div className="home-schedule-list">
                {SCHEDULE.map(s => (
                  <div key={s.time} className="home-schedule-item">
                    <div className="home-schedule-dot" style={{ background: s.color }} />
                    <div style={{ flex: 1 }}>
                      <div className="home-schedule-time">{s.time}</div>
                      <div className="home-schedule-name">{s.name}</div>
                      <div className="home-schedule-detail">{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}