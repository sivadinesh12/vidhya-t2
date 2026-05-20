import React from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import "./index.css";

const CHAPTERS = [
  { name: "Cell: The Unit of Life", subject: "NCERT Biology XI", pct: 78, color: "#1e8449", bg: "#d5f5e3", icon: "🧬" },
  { name: "Thermodynamics", subject: "NCERT Physics XI", pct: 55, color: "#1a5276", bg: "#d6eaf8", icon: "⚛️" },
  { name: "Chemical Bonding", subject: "NCERT Chemistry XI", pct: 90, color: "#7d3c98", bg: "#e8daef", icon: "🧪" },
  { name: "Organic Chemistry", subject: "NCERT Chemistry XII", pct: 42, color: "#c0392b", bg: "#fadbd8", icon: "🔬" },
];

const SCHEDULE = [
  { time: "9 AM",  name: "NEET Mock Test – Physics",  detail: "90 min · Full Syllabus", color: "#1a5276" },
  { time: "12 PM", name: "NCERT Biology – Genetics",   detail: "Chapter 5 & 6 Revision", color: "#1e8449" },
  { time: "3 PM",  name: "JEE Practice Paper #7",     detail: "Chemistry · 60 min",     color: "#c0392b" },
  { time: "6 PM",  name: "Doubt Clearing Session",     detail: "Physics Mechanics",       color: "#c9922a" },
];

const QUICK = [
  { icon: "📝", title: "Mock Tests",    sub: "250+ tests available",  path: "/mock-tests" },
  { icon: "📊", title: "Analytics",    sub: "Track your progress",   path: "/analytics" },
  { icon: "🗂️", title: "Flashcards",  sub: "Smart revision",        path: "/flashcards" },
  { icon: "🎯", title: "Study Planner",sub: "Custom schedule",       path: "/study-planner" },
];

export default function Home({ userName }) {
  const navigate = useNavigate();

  return (
    <PageLayout userName={userName}>
      <div className="home-page">
        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero-inner">
            <div className="home-hero-content">
              <div className="home-hero-tag">✨ 2025–26 Session Active</div>
              <h1>Hello, <span className="home-hero-name">{userName}!</span><br />Ready to Study?</h1>
              <p>Your personalised dashboard is loaded. Continue where you left off or explore new chapters today.</p>
              <div className="home-hero-btns">
                <button className="home-btn-solid" onClick={() => navigate('/neet')}>Start Preparing</button>
                <button className="home-btn-outline" onClick={() => navigate('/mock-tests')}>Take a Mock Test</button>
              </div>
            </div>
            <div className="home-hero-stats">
              {[["247", "Chapters Done"], ["89%", "Avg. Score"], ["18", "Day Streak"]].map(([n, l]) => (
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
            {QUICK.map(q => (
              <div key={q.title} className="home-quick-card fade-up" onClick={() => navigate(q.path)}>
                <div className="home-quick-icon">{q.icon}</div>
                <div className="home-quick-text">
                  <div className="home-quick-title">{q.title}</div>
                  <div className="home-quick-sub">{q.sub}</div>
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
