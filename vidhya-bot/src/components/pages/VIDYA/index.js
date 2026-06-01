import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./vidya.css";

const TEXT_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-120b:free",
  "google/gemma-3-27b-it:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
];
const VISION_MODELS = [
  "google/gemma-3-27b-it:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "google/gemma-4-31b-it:free",
];

// ── SVG outline icons (plain, professional) ───────────────────────────────
const NAV_ICONS = {
  Home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
      <polyline points="9 21 9 12 15 12 15 21"/>
    </svg>
  ),
  MockTests: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <line x1="8" y1="7" x2="16" y2="7"/>
      <line x1="8" y1="11" x2="16" y2="11"/>
      <line x1="8" y1="15" x2="12" y2="15"/>
      <polyline points="14 16 16 18 20 14"/>
    </svg>
  ),
  Flashcards: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2"/>
      <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
    </svg>
  ),
  Planner: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="8" y1="14" x2="8" y2="14"/>
      <line x1="12" y1="14" x2="12" y2="14"/>
      <line x1="16" y1="14" x2="16" y2="14"/>
    </svg>
  ),
  Analytics: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Progress: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
};

const TOP_NAV = [
  { key: "Home",       label: "Home",       path: "/home" },
  { key: "MockTests",  label: "Mock Tests", path: "/mock-tests" },
  { key: "Flashcards", label: "Flashcards", path: "/flashcards" },
  { key: "Planner",    label: "Planner",    path: "/study-planner" },
  { key: "Analytics",  label: "Analytics",  path: "/analytics" },
  { key: "Progress",   label: "Progress",   path: "/progress" },
];

const VIDYA = {
  color: "#a78bfa",
  colorRGB: "167,139,250",
  examBg: "rgba(167,139,250,0.12)",
  examBorder: "rgba(167,139,250,0.35)",
  pitch: 1.0,
  rate: 0.80,

  system: `You are VIDYA, an all-in-one AI tutor for Indian students preparing for NEET UG, JEE Mains, JEE Advanced, and Class 11-12 Board exams. You are an expert in ALL four subjects:\n\nBIOLOGY: Botany, Zoology, Human Physiology from NCERT Class 11 & 12. Use mnemonics and simple analogies.\nPHYSICS: Mechanics, Electrodynamics, Optics, Modern Physics. Reference HC Verma and DC Pandey. Give JEE tricks and step-by-step solutions.\nCHEMISTRY: Organic, Inorganic, and Physical Chemistry. Make reactions easy with story-like explanations. Reference NCERT and P. Bahadur.\nMATHEMATICS: Calculus, Algebra, Coordinate Geometry, Trigonometry, Probability. Give shortcuts and JEE solving tricks.\n\nWhen a student asks about any topic, automatically detect which subject it belongs to and answer as an expert in that subject. Always mention the relevant NCERT chapter. Be warm, patient, encouraging, and speak in simple clear Indian English like a friendly teacher talking directly to the student.\n\nIf the student sends a photo of a question, diagram, circuit, equation, or textbook page — read it carefully and explain or solve it completely.\n\nSTRICT RULES: Never use markdown, asterisks, bullet points, dashes, headers, or table symbols. Never use *, **, #, -, or |. Write ONLY in plain flowing sentences and short paragraphs, exactly like a teacher speaking out loud to a student.`,

  greeting: "Namaste! I am VIDYA, your all-in-one AI tutor for NEET, JEE, and Board exams. I can help you with Biology, Physics, Chemistry, and Mathematics — all in one place! Just ask me any doubt, or send me a photo of any question or diagram, and I will explain everything step by step. What would you like to study today?",

  quickTopics: [
    "Difference between mitosis and meiosis?",
    "Explain Newton's laws with JEE examples",
    "How to master Organic Chemistry reactions?",
    "How to solve integration problems fast?",
    "Most important NEET Biology chapters?",
    "Important JEE Physics formulas",
    "Mole concept step by step",
    "Tricks for JEE coordinate geometry",
  ],

  subjects: ["Biology", "Physics", "Chemistry", "Mathematics"],

  svg: `<svg viewBox="0 0 140 220" xmlns="http://www.w3.org/2000/svg" style="width:130px;height:210px">
    <path d="M30 122 Q70 110 110 122 L104 205 L36 205 Z" fill="#1e1240"/>
    <path d="M30 122 Q70 110 110 122 L112 140 Q70 150 28 140 Z" fill="#a78bfa" opacity="0.4"/>
    <rect x="63" y="108" width="14" height="16" rx="4" fill="#d4a574"/>
    <ellipse cx="70" cy="78" rx="27" ry="30" fill="#d4a574"/>
    <ellipse cx="70" cy="52" rx="25" ry="14" fill="#1a0800"/>
    <ellipse cx="70" cy="46" rx="16" ry="10" fill="#1a0800"/>
    <path d="M44 66 Q43 50 58 44" stroke="#1a0800" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M96 66 Q97 50 82 44" stroke="#1a0800" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="49" y="72" width="16" height="11" rx="5" fill="none" stroke="#a78bfa" stroke-width="2"/>
    <rect x="75" y="72" width="16" height="11" rx="5" fill="none" stroke="#a78bfa" stroke-width="2"/>
    <line x1="65" y1="77" x2="75" y2="77" stroke="#a78bfa" stroke-width="2"/>
    <ellipse cx="57" cy="77" rx="4" ry="4" fill="#1a0a00"/>
    <ellipse cx="83" cy="77" rx="4" ry="4" fill="#1a0a00"/>
    <circle cx="58.5" cy="75.5" r="1.3" fill="white"/>
    <circle cx="84.5" cy="75.5" r="1.3" fill="white"/>
    <path d="M50 70 Q57 67 64 70" stroke="#1a0800" stroke-width="1.8" fill="none"/>
    <path d="M76 70 Q83 67 90 70" stroke="#1a0800" stroke-width="1.8" fill="none"/>
    <path d="M68 87 Q70 91 72 87" stroke="#b07850" stroke-width="1.2" fill="none"/>
    <path id="mouth" d="M63 96 Q70 101 77 96" stroke="#c06050" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="43" cy="79" rx="5" ry="7" fill="#d4a574"/>
    <ellipse cx="97" cy="79" rx="5" ry="7" fill="#d4a574"/>
    <circle cx="43" cy="87" r="3" fill="#a78bfa"/>
    <circle cx="97" cy="87" r="3" fill="#a78bfa"/>
    <path d="M108 130 Q124 148 118 170" stroke="#1e1240" stroke-width="13" fill="none" stroke-linecap="round"/>
    <rect x="100" y="162" width="26" height="32" rx="3" fill="#a78bfa" opacity="0.9"/>
    <rect x="100" y="162" width="26" height="32" rx="3" fill="none" stroke="#7c5cbf" stroke-width="1.5"/>
    <line x1="113" y1="165" x2="113" y2="191" stroke="#7c5cbf" stroke-width="1"/>
    <line x1="104" y1="170" x2="111" y2="170" stroke="white" stroke-width="1" opacity="0.6"/>
    <line x1="104" y1="175" x2="111" y2="175" stroke="white" stroke-width="1" opacity="0.6"/>
    <line x1="104" y1="180" x2="111" y2="180" stroke="white" stroke-width="1" opacity="0.4"/>
    <text x="42" y="155" font-family="serif" font-size="9" fill="#a78bfa" opacity="0.7">🧬</text>
    <text x="58" y="170" font-family="serif" font-size="9" fill="#a78bfa" opacity="0.7">⚛️</text>
    <text x="42" y="183" font-family="serif" font-size="8" fill="#a78bfa" opacity="0.6">🧪</text>
    <text x="57" y="155" font-family="serif" font-size="8" fill="#a78bfa" opacity="0.5">∫</text>
    <circle cx="25" cy="100" r="3" fill="#a78bfa" opacity="0.5"/>
    <circle cx="18" cy="118" r="2" fill="#a78bfa" opacity="0.3"/>
    <circle cx="115" cy="100" r="3" fill="#a78bfa" opacity="0.5"/>
    <circle cx="122" cy="118" r="2" fill="#a78bfa" opacity="0.3"/>
  </svg>`,
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function VIDYAPage({ userName, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem("vidya_openrouter_key") || "");
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [voiceReady, setVoiceReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fileInputRef = useRef(null);
  const chatboxRef = useRef(null);
  const mouthIntervalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatboxRef.current)
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    setMessages([{ role: "greeting", text: VIDYA.greeting, id: Date.now() }]);
  }, []);

  useEffect(() => {
    // Pre-load voices (required on Chrome — voices load async)
    const load = () => {
      window.speechSynthesis.getVoices();
      setVoiceReady(true);
    };
    if (window.speechSynthesis) {
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      clearInterval(mouthIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!apiKey) setShowKeyPrompt(true);
    else setShowKeyPrompt(false);
  }, [apiKey]);

  function saveApiKey() {
    const k = apiKeyInput.replace(/[^\x20-\x7E]/g, "").trim();
    if (!k) return;
    localStorage.setItem("vidya_openrouter_key", k);
    setApiKey(k);
    setApiKeyInput("");
  }

  async function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Image too large. Please use under 5MB."); return; }
    try {
      const base64 = await fileToBase64(file);
      setUploadedImage({ base64, mimeType: file.type, previewUrl: URL.createObjectURL(file), name: file.name });
    } catch { alert("Could not read image. Please try again."); }
    e.target.value = "";
  }

  function removeImage() {
    if (uploadedImage?.previewUrl) URL.revokeObjectURL(uploadedImage.previewUrl);
    setUploadedImage(null);
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`]/g, "").replace(/\n+/g, ". ");
    const u = new SpeechSynthesisUtterance(clean);
    u.pitch = 1.0; u.rate = 0.85; u.volume = 1;
    const voices = window.speechSynthesis.getVoices() || [];
    const en = voices.filter(v => /en/i.test(v.lang));
    const voice = en.find(v => /female/i.test(v.name)) || en[0] || voices[0];
    if (voice) u.voice = voice;
    u.onstart = () => { setIsSpeaking(true); startMouth(); };
    u.onend   = () => { setIsSpeaking(false); stopMouth(); };
    u.onerror = () => { setIsSpeaking(false); stopMouth(); };
    window.speechSynthesis.speak(u);
  }

  function stopSpeaking() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    stopMouth();
  }

  function startMouth() {
    const ring = document.getElementById("vidya-pulse-ring");
    if (ring) ring.classList.add("pulsing");
    clearInterval(mouthIntervalRef.current);
    mouthIntervalRef.current = setInterval(() => {
      const m = document.getElementById("mouth");
      if (!m) return;
      const y = 97 + Math.random() * 9;
      m.setAttribute("d", `M63 96 Q70 ${y} 77 96`);
    }, 120);
  }

  function stopMouth() {
    clearInterval(mouthIntervalRef.current);
    const ring = document.getElementById("vidya-pulse-ring");
    if (ring) ring.classList.remove("pulsing");
    const m = document.getElementById("mouth");
    if (m) m.setAttribute("d", "M63 96 Q70 101 77 96");
  }

  async function tryModel(model, messagesPayload) {
    const cleanKey = apiKey.replace(/[^\x20-\x7E]/g, "").trim();
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cleanKey,
        "HTTP-Referer": window.location.origin,
        "X-Title": "VIDYA Tutor",
      },
      body: JSON.stringify({ model, messages: messagesPayload, max_tokens: 1024, temperature: 0.7 }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.error?.message || `API error ${res.status}`;
      if (res.status === 401 || res.status === 403) {
        setShowKeyPrompt(true);
        setApiKey("");
        localStorage.removeItem("vidya_openrouter_key");
        throw new Error("__AUTH__:" + msg);
      }
      throw new Error(msg);
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) throw new Error("Empty response");
    return raw;
  }

  async function sendMessage(overrideText) {
    if (busy) return;
    const text = (overrideText || input).trim();
    const hasImage = !!uploadedImage;
    if (!text && !hasImage) return;
    if (!apiKey) { setShowKeyPrompt(true); return; }

    setInput("");
    setMessages(prev => [...prev, {
      role: "user",
      text: text || "📷 (image sent)",
      imagePreview: hasImage ? uploadedImage.previewUrl : null,
      id: Date.now(),
    }]);

    const imageData = uploadedImage;
    setUploadedImage(null);
    setBusy(true);

    try {
      let userContent;
      if (hasImage) {
        userContent = [
          { type: "image_url", image_url: { url: `data:${imageData.mimeType};base64,${imageData.base64}` } },
          { type: "text", text: text || "Please explain or solve what is shown in this image." },
        ];
      } else {
        userContent = text;
      }

      const messagesPayload = [
        { role: "system", content: VIDYA.system },
        ...chatHistory,
        { role: "user", content: userContent },
      ];

      const modelList = hasImage ? VISION_MODELS : TEXT_MODELS;
      let rawReply = null;
      let lastError = null;

      for (const model of modelList) {
        try {
          rawReply = await tryModel(model, messagesPayload);
          break;
        } catch (e) {
          if (e.message.startsWith("__AUTH__:")) throw e;
          lastError = e;
        }
      }

      if (!rawReply) throw lastError || new Error("All models are currently busy. Please try again.");

      const reply = rawReply
        .replace(/#{1,6}\s*/g, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`{1,3}[^`]*`{1,3}/g, "")
        .replace(/^\s*[-•]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        .replace(/\|.*\|/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      setChatHistory(prev => [...prev,
        { role: "user", content: text || "(image question)" },
        { role: "assistant", content: reply },
      ].slice(-20));

      setMessages(prev => [...prev, { role: "bot", text: reply, id: Date.now() }]);
      speak(reply);

    } catch (e) {
      const errMsg = e.message.startsWith("__AUTH__:")
        ? "Invalid API key. Please enter your key again."
        : e.message || "Connection issue. Please check your internet and try again.";
      setMessages(prev => [...prev, { role: "bot", text: `⚠️ ${errMsg}`, id: Date.now() }]);
    }

    setBusy(false);
    inputRef.current?.focus();
  }

  const accentStyle = { "--vidya-accent": VIDYA.color, "--vidya-accent-rgb": VIDYA.colorRGB };

  return (
    <div className="vidya-root" style={accentStyle}>

      {/* ── API Key Modal ── */}
      {showKeyPrompt && (
        <div className="vidya-key-overlay">
          <div className="vidya-key-modal">
            <div className="vidya-key-icon">🔑</div>
            <h2>Enter your OpenRouter API Key</h2>
            <p>
              VIDYA AI uses OpenRouter (100% free). Get your free key from{" "}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">openrouter.ai/keys</a>
              {" "}— sign up with Google, no billing needed.
            </p>
            <input
              className="vidya-key-input"
              type="password"
              placeholder="Paste your OpenRouter API key here…"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") saveApiKey(); }}
              autoFocus
            />
            <button className="vidya-key-btn" onClick={saveApiKey}
              style={{ background: `linear-gradient(135deg,${VIDYA.color},#7c5cbf)` }}>
              Save & Start Chatting →
            </button>
            <p className="vidya-key-note">Your key is saved locally in your browser only.</p>
          </div>
        </div>
      )}

      {/* ── VIDYA Sidebar ── */}
      <aside className="vidya-sidebar">
        <div className="vidya-sidebar-top">
          <div className="vidya-brand">
            <img
              src={require("../../../assets/vidya_icon.png")}
              alt="Vidya"
              className="vidya-brand-logo-icon"
            />
            <img
              src={require("../../../assets/vidya_text.png")}
              alt="Vidya"
              className="vidya-brand-logo-text"
            />
          </div>

          <div className="vidya-exam-row">
            <span className="vidya-badge badge-neet">NEET</span>
            <span className="vidya-badge badge-jeem">JEE Mains</span>
            <span className="vidya-badge badge-jeea">JEE Adv</span>
            <span className="vidya-badge badge-board">Boards</span>
          </div>

          <div className="vidya-avatar-stage">
            <div className="vidya-stage-bg"
              style={{ background: `radial-gradient(ellipse at 50% 110%, rgba(${VIDYA.colorRGB},0.2) 0%, transparent 65%)` }} />
            <div className="vidya-stage-glow" style={{ background: `rgba(${VIDYA.colorRGB},0.25)` }} />
            <div className="vidya-pulse-ring" id="vidya-pulse-ring" style={{ borderColor: VIDYA.color }} />
            <div className="vidya-avatar-wrap" dangerouslySetInnerHTML={{ __html: VIDYA.svg }} />
          </div>

          <div className="vidya-teacher-info">
            <span className="vidya-role-tag" style={{ background: VIDYA.examBg, color: VIDYA.color }}>
              All Subjects · NEET &amp; JEE
            </span>

          </div>
        </div>

        <div className="vidya-divider" />

        <div className="vidya-qt-wrap">
          <div className="vidya-qt-label">QUICK QUESTIONS</div>
          {VIDYA.quickTopics.map(q => (
            <button key={q} className="vidya-qt-btn" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>

        <div className="vidya-divider" />

        {apiKey && (
          <div className="vidya-voice-wrap">
            <button className="vidya-voice-btn"
              onClick={() => { setShowKeyPrompt(true); setApiKey(""); localStorage.removeItem("vidya_openrouter_key"); }}>
              🔑 Change API Key
            </button>
          </div>
        )}
      </aside>

      {/* ── Chat main ── */}
      <main className="vidya-chat-main">

        {/* ── TOP NAVBAR ── */}
        <header className="vidya-topbar">
          {/* Left: status + stop speaking */}
          <div className="vidya-topbar-left">
            <span className="vidya-topbar-status">
              <span className="vidya-topbar-dot" />
              {apiKey ? "Online" : "API key needed"}
            </span>
            {isSpeaking && (
              <button className="vidya-stop-btn" onClick={stopSpeaking} title="Stop speaking">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                </svg>
                <span>Stop</span>
              </button>
            )}
          </div>

          {/* Right: nav links + user */}
          <div className="vidya-topbar-right">
            <nav className="vidya-topnav">
              {TOP_NAV.map(item => (
                <button
                  key={item.key}
                  className={`vidya-topnav-btn ${location.pathname === item.path ? "active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="vidya-topnav-icon">{NAV_ICONS[item.key]}</span>
                  <span className="vidya-topnav-label">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="vidya-topbar-divider" />

            {/* User avatar + logout */}
            <div className="vidya-topbar-user">
              <div className="vidya-topbar-avatar">
                {userName?.[0]?.toUpperCase() || "S"}
              </div>
              <span className="vidya-topbar-username">{userName}</span>
            </div>
            <button className="vidya-topbar-logout" onClick={onLogout} title="Sign Out">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="vidya-chatbox" ref={chatboxRef}>
          <div className="vidya-welcome-card"
            style={{ borderColor: `rgba(${VIDYA.colorRGB},0.2)`, background: `linear-gradient(135deg,rgba(${VIDYA.colorRGB},0.08),rgba(0,0,0,0.2))` }}>
            <h3>Your All-in-One NEET &amp; JEE Tutor</h3>
            <p>Ask any doubt in Biology, Physics, Chemistry, or Maths. You can also send a photo of any question or diagram.</p>
            <div className="vidya-w-tags">
              <span className="vidya-w-tag">Biology</span>
              <span className="vidya-w-tag">Physics</span>
              <span className="vidya-w-tag">Chemistry</span>
              <span className="vidya-w-tag">Mathematics</span>
              <span className="vidya-w-tag">NCERT Based</span>
              <span className="vidya-w-tag">Image Support</span>
            </div>
          </div>

          {messages.map(msg => (
            <div key={msg.id}
              className={`vidya-msg ${msg.role === "user" ? "user" : "bot"}`}
              style={msg.role === "user"
                ? { background: `linear-gradient(135deg,${VIDYA.color},#7c5cbf)` }
                : {}}>
              {msg.imagePreview && (
                <img src={msg.imagePreview} alt="uploaded"
                  style={{ display: "block", maxWidth: "220px", maxHeight: "180px", borderRadius: "8px",
                    marginBottom: msg.text && msg.text !== "📷 (image sent)" ? "8px" : "0",
                    objectFit: "contain", background: "rgba(255,255,255,0.1)" }} />
              )}
              {msg.text && msg.text !== "📷 (image sent)" && msg.text}
            </div>
          ))}

          {busy && (
            <div className="vidya-msg bot vidya-typing"><span /><span /><span /></div>
          )}
        </div>

        {/* Image preview bar */}
        {uploadedImage && (
          <div className="vidya-img-preview-bar">
            <img src={uploadedImage.previewUrl} alt="preview" className="vidya-img-preview-thumb" />
            <div className="vidya-img-preview-name">📷 {uploadedImage.name}</div>
            <button className="vidya-img-preview-remove" onClick={removeImage}>✕</button>
          </div>
        )}

        {/* Input area */}
        <div className="vidya-input-area">
          <input ref={fileInputRef} type="file" accept="image/*"
            style={{ display: "none" }} onChange={handleImageSelect} />

          <button
            className={`vidya-upload-btn ${uploadedImage ? "active" : ""}`}
            title="Send a photo of your question or diagram"
            onClick={() => fileInputRef.current?.click()}
            disabled={!apiKey}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>

          <input ref={inputRef} className="vidya-input" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } }}
            placeholder={
              uploadedImage ? "Add a question about this image (optional)…"
              : apiKey ? "Ask any Biology, Physics, Chemistry or Maths doubt…"
              : "Enter API key to start chatting…"
            }
            disabled={!apiKey}
          />

          <button className="vidya-send-btn"
            style={{ background: `linear-gradient(135deg,${VIDYA.color},#7c5cbf)` }}
            onClick={() => sendMessage()}
            disabled={busy || !apiKey || (!input.trim() && !uploadedImage)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}