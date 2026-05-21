import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import vidyaIcon from "../../assets/vidya_icon.png";   // the colourful pentagon
import vidyaText from "../../assets/vidya_text.png";   // the VIDYA wordmark
import "./index.css";

export default function Welcome() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      vx: (Math.random() - 0.5) * 2.5,
      vy: -(Math.random() * 4 + 2),
      radius: Math.random() * 5 + 2,
      color: ["#38bdf8", "#0284c7", "#f59e0b", "#7dd3fc", "#bae6fd"][Math.floor(Math.random() * 5)],
      alpha: 1,
      decay: Math.random() * 0.008 + 0.004,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.alpha -= p.decay;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="wv-root">
      {/* Layer 0: particles */}
      <canvas ref={canvasRef} className="wv-canvas" />

      {/* Layer 1: orbs */}
      <div className="wv-orb wv-orb--1" />
      <div className="wv-orb wv-orb--2" />
      <div className="wv-orb wv-orb--3" />

      {/* Layer 2a: icon pinned to LEFT of viewport */}
      <img src={vidyaIcon} alt="" className="wv-watermark__icon" aria-hidden="true" />

      {/* Layer 2b: VIDYA text pinned to RIGHT of viewport */}
      <img src={vidyaText} alt="" className="wv-watermark__text" aria-hidden="true" />

      {/* Layer 3: card */}
      <div className={`wv-stage ${visible ? "wv-stage--in" : ""}`}>

        {/* Top badge */}
        <div className="wv-badge wv-reveal" style={{ "--d": "0s" }}>
          <span className="wv-badge__dot" /> Account Created
        </div>

        {/* Headline */}
        <h1 className="wv-headline wv-reveal" style={{ "--d": "0.15s" }}>
          You're all set,<br />let's begin.
        </h1>

        <p className="wv-sub wv-reveal" style={{ "--d": "0.3s" }}>
          Your Vidya account is live. Start learning smarter — explore your
          personalised dashboard and take your first step forward.
        </p>

        {/* Stats strip */}
        <div className="wv-stats wv-reveal" style={{ "--d": "0.45s" }}>
          {[
            { value: "10K+", label: "Learners" },
            { value: "Neet&jee", label: "Courses" },
            { value: "98%",  label: "Satisfaction" },
          ].map(({ value, label }) => (
            <div className="wv-stat" key={label}>
              <span className="wv-stat__value">{value}</span>
              <span className="wv-stat__label">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          className="wv-cta wv-reveal"
          style={{ "--d": "0.6s" }}
          onClick={() => navigate("/Home")}
        >
          <span>Go to Dashboard</span>
          <span className="wv-cta__arrow">→</span>
        </button>
      </div>
    </div>
  );
}