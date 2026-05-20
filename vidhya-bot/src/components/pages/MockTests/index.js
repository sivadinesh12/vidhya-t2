import React, { useState } from "react";
import PageLayout from "../../Layout/PageLayout";
import "../page.css";
import "./MockTests.css";

const TESTS = [
  {
    icon: "⚛️", title: "NEET Mock Test – Physics", sub: "90 min · Full Syllabus · 45 Questions",
    difficulty: "Hard", color: "#1a5276", bg: "#d6eaf8", attempts: 1240, duration: 90,
    questions: [
      { q: "A body is moving with uniform velocity. The net force acting on it is:", options: ["Zero", "Equal to mass × velocity", "Greater than zero", "Cannot be determined"], ans: 0 },
      { q: "The SI unit of electric current is:", options: ["Volt", "Ohm", "Ampere", "Watt"], ans: 2 },
      { q: "Which of the following is a scalar quantity?", options: ["Force", "Velocity", "Speed", "Displacement"], ans: 2 },
      { q: "The work done by a force is maximum when the angle between force and displacement is:", options: ["90°", "180°", "0°", "45°"], ans: 2 },
      { q: "A wave with frequency 500 Hz has a wavelength of 0.6 m. Its speed is:", options: ["300 m/s", "833 m/s", "200 m/s", "500 m/s"], ans: 0 },
    ],
  },
  {
    icon: "🧪", title: "NEET Mock Test – Chemistry", sub: "60 min · Organic Focus · 35 Questions",
    difficulty: "Medium", color: "#7d3c98", bg: "#e8daef", attempts: 980, duration: 60,
    questions: [
      { q: "The IUPAC name of CH3-CH2-OH is:", options: ["Methanol", "Ethanol", "Propanol", "Butanol"], ans: 1 },
      { q: "Which gas is produced when sodium reacts with water?", options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon dioxide"], ans: 2 },
      { q: "The atomic number of Carbon is:", options: ["4", "6", "8", "12"], ans: 1 },
      { q: "Which of the following is an isotope of hydrogen?", options: ["Helium", "Deuterium", "Oxygen", "Lithium"], ans: 1 },
      { q: "PH of a neutral solution at 25°C is:", options: ["0", "7", "14", "1"], ans: 1 },
    ],
  },
  {
    icon: "🧬", title: "NEET Mock Test – Biology", sub: "90 min · Full Syllabus · 90 Questions",
    difficulty: "Medium", color: "#1e8449", bg: "#d5f5e3", attempts: 1540, duration: 90,
    questions: [
      { q: "The powerhouse of the cell is:", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], ans: 2 },
      { q: "DNA replication occurs in which phase of cell cycle?", options: ["G1", "S phase", "G2", "M phase"], ans: 1 },
      { q: "Which of the following is NOT a function of the liver?", options: ["Detoxification", "Bile secretion", "Insulin production", "Glycogen storage"], ans: 2 },
      { q: "Photosynthesis occurs in:", options: ["Mitochondria", "Ribosome", "Chloroplast", "Nucleus"], ans: 2 },
      { q: "Which blood group is the universal donor?", options: ["A", "B", "AB", "O"], ans: 3 },
    ],
  },
  {
    icon: "📋", title: "NEET Full Mock – Paper 1", sub: "3 hrs · 200 Questions · All Subjects",
    difficulty: "Hard", color: "#c0392b", bg: "#fadbd8", attempts: 2100, duration: 180,
    questions: [
      { q: "Newton's first law of motion is also known as:", options: ["Law of gravitation", "Law of inertia", "Law of acceleration", "Law of action-reaction"], ans: 1 },
      { q: "The chemical formula of water is:", options: ["H2O2", "H2O", "HO", "H3O"], ans: 1 },
      { q: "Which organelle is responsible for protein synthesis?", options: ["Lysosome", "Centrosome", "Ribosome", "Vacuole"], ans: 2 },
      { q: "The speed of light in vacuum is approximately:", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], ans: 1 },
      { q: "Mendel's Law of Segregation states:", options: ["Genes are linked", "Alleles separate during gamete formation", "All traits are dominant", "Genes mutate randomly"], ans: 1 },
    ],
  },
  {
    icon: "⚗️", title: "JEE Mock Test – Maths", sub: "60 min · Calculus + Algebra · 30 Questions",
    difficulty: "Hard", color: "#c9922a", bg: "#fdebd0", attempts: 760, duration: 60,
    questions: [
      { q: "The derivative of sin(x) is:", options: ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"], ans: 0 },
      { q: "∫x dx equals:", options: ["x²", "x²/2 + C", "2x + C", "x + C"], ans: 1 },
      { q: "The value of log(1) is:", options: ["1", "0", "-1", "Undefined"], ans: 1 },
      { q: "If A = {1,2,3} and B = {2,3,4}, then A∩B is:", options: ["{1,2,3,4}", "{2,3}", "{1}", "{4}"], ans: 1 },
      { q: "The sum of interior angles of a hexagon is:", options: ["540°", "720°", "360°", "900°"], ans: 1 },
    ],
  },
  {
    icon: "📐", title: "JEE Mock Test – Physics", sub: "60 min · Mechanics · 30 Questions",
    difficulty: "Medium", color: "#1a5276", bg: "#d6eaf8", attempts: 820, duration: 60,
    questions: [
      { q: "In a perfectly elastic collision, which quantity is conserved?", options: ["Only momentum", "Only kinetic energy", "Both momentum and kinetic energy", "Neither"], ans: 2 },
      { q: "The unit of pressure in SI system is:", options: ["Newton", "Pascal", "Joule", "Watt"], ans: 1 },
      { q: "Ohm's law relates:", options: ["Voltage and frequency", "Current and resistance", "Voltage, current and resistance", "Resistance and power"], ans: 2 },
      { q: "The acceleration due to gravity on the surface of Earth is approximately:", options: ["5 m/s²", "9.8 m/s²", "12 m/s²", "15 m/s²"], ans: 1 },
      { q: "Which lens is used to correct myopia?", options: ["Convex", "Bifocal", "Concave", "Cylindrical"], ans: 2 },
    ],
  },
];

const DIFF_COLOR = {
  Hard:   { bg: "#fadbd8", c: "#c0392b" },
  Medium: { bg: "#fdebd0", c: "#c9922a" },
  Easy:   { bg: "#d5f5e3", c: "#1e8449" },
};

// ── Mock Test Session ──────────────────────────────────────────────────
function TestSession({ test, onFinish, onBack }) {
  const total = test.questions.length;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(total).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);

  React.useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); setSubmitted(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const pick = (i) => {
    if (submitted) return;
    const a = [...answers];
    a[current] = i;
    setAnswers(a);
  };

  const submit = () => setSubmitted(true);

  if (submitted) {
    const score = answers.filter((a, i) => a === test.questions[i].ans).length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="mt-result">
        <div className="mt-result-card">
          <div className="mt-result-emoji">{pct >= 80 ? "🎉" : pct >= 50 ? "📚" : "💪"}</div>
          <h2 className="mt-result-title">{test.title}</h2>
          <div className="mt-result-score">
            <span className="mt-score-num" style={{ color: pct >= 80 ? "#1e8449" : pct >= 50 ? "#c9922a" : "#c0392b" }}>
              {score}/{total}
            </span>
            <span className="mt-score-pct">{pct}%</span>
          </div>
          <div className="mt-result-breakdown">
            {test.questions.map((q, i) => (
              <div key={i} className={`mt-rb-row ${answers[i] === q.ans ? "correct" : "wrong"}`}>
                <span className="mt-rb-icon">{answers[i] === q.ans ? "✅" : "❌"}</span>
                <span className="mt-rb-q">{q.q}</span>
                {answers[i] !== q.ans && (
                  <span className="mt-rb-ans">Ans: {q.options[q.ans]}</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-result-btns">
            <button className="mt-btn-primary" onClick={onBack}>← Back to Tests</button>
            <button className="mt-btn-outline" onClick={onFinish}>View All Results</button>
          </div>
        </div>
      </div>
    );
  }

  const q = test.questions[current];
  const answered = answers.filter(a => a !== null).length;
  const urgent = timeLeft < 120;

  return (
    <div className="mt-session">
      {/* Top bar */}
      <div className="mt-session-topbar">
        <button className="mt-back-btn" onClick={onBack}>← Exit Test</button>
        <div className="mt-session-info">
          <span className="mt-session-title">{test.title}</span>
          <span className={`mt-timer ${urgent ? "urgent" : ""}`}>⏱ {fmtTime(timeLeft)}</span>
        </div>
        <button className="mt-submit-btn" onClick={submit}>Submit Test</button>
      </div>

      {/* Progress bar */}
      <div className="mt-progress-track">
        <div className="mt-progress-fill" style={{ width: `${(answered / total) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="mt-body">
        <div className="mt-q-panel">
          <div className="mt-q-meta">Question {current + 1} of {total} · {answered} answered</div>
          <div className="mt-q-text">{q.q}</div>
          <div className="mt-options">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`mt-option ${answers[current] === i ? "selected" : ""}`}
                onClick={() => pick(i)}
              >
                <span className="mt-opt-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
          <div className="mt-nav-btns">
            <button className="mt-nav-btn" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>← Prev</button>
            {current < total - 1
              ? <button className="mt-nav-btn primary" onClick={() => setCurrent(c => c + 1)}>Next →</button>
              : <button className="mt-nav-btn primary" onClick={submit}>Submit Test ✓</button>
            }
          </div>
        </div>

        {/* Question palette */}
        <div className="mt-palette-panel">
          <div className="mt-palette-title">Question Palette</div>
          <div className="mt-palette-grid">
            {test.questions.map((_, i) => (
              <button
                key={i}
                className={`mt-palette-btn ${i === current ? "active" : ""} ${answers[i] !== null ? "done" : ""}`}
                onClick={() => setCurrent(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-palette-legend">
            <span className="mt-legend-dot done" /> Answered
            <span className="mt-legend-dot" style={{ marginLeft: 14 }} /> Not answered
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main MockTests page ────────────────────────────────────────────────
export default function MockTests({ userName }) {
  const [filter, setFilter] = useState("All");
  const [activeTest, setActiveTest] = useState(null);
  const filtered = filter === "All" ? TESTS : TESTS.filter(t => t.difficulty === filter);

  if (activeTest) {
    return (
      <PageLayout userName={userName}>
        <TestSession
          test={activeTest}
          onBack={() => setActiveTest(null)}
          onFinish={() => setActiveTest(null)}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout userName={userName}>
      <div className="page-wrap">
        <div className="page-hero" style={{ background: "linear-gradient(135deg,#0d1b2a,#1a3a5c)" }}>
          <div className="page-hero-badge">📝 Practice Arena</div>
          <h1>Mock Tests</h1>
          <p>250+ timed tests designed to simulate real exam conditions for NEET and JEE. Track every attempt.</p>
          <div className="page-hero-meta">
            {[["250+","Tests"],["45K+","Attempts"],["98%","Accuracy"]].map(([n,l]) => (
              <div key={l} className="page-hero-stat">
                <div className="page-hero-stat-num">{n}</div>
                <div className="page-hero-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:10, marginBottom:28 }}>
          {["All","Hard","Medium","Easy"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"7px 18px", borderRadius:20, border:"1.5px solid",
              borderColor: filter===f ? "var(--teal)" : "var(--border)",
              background: filter===f ? "var(--teal)" : "white",
              color: filter===f ? "white" : "var(--slate)",
              fontSize:13, fontWeight:600, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
            }}>{f}</button>
          ))}
        </div>

        <h2 className="page-section-title">Available <span>Tests</span></h2>
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:40 }}>
          {filtered.map((t, i) => (
            <div key={i} className="list-row" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", flexWrap:"nowrap" }}>
              <div className="list-row-icon" style={{ background:t.bg, flexShrink:0 }}>{t.icon}</div>
              <div style={{ flex:1, minWidth:0, overflow:"hidden" }}>
                <div className="list-row-title" style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.title}</div>
                <div className="list-row-sub" style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.sub} · {t.attempts.toLocaleString()} attempts</div>
              </div>
              <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:DIFF_COLOR[t.difficulty].bg, color:DIFF_COLOR[t.difficulty].c, flexShrink:0, whiteSpace:"nowrap" }}>{t.difficulty}</span>
              <button
                onClick={() => setActiveTest(t)}
                style={{
                  flexShrink:0,
                  width:70,
                  padding:"5px 0",
                  borderRadius:8,
                  border:"none",
                  background:t.color,
                  color:"#fff",
                  fontSize:12,
                  fontWeight:700,
                  cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif",
                  whiteSpace:"nowrap",
                }}
              >
                Start →
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
