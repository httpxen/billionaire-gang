"use client";

import { useState, useEffect } from "react";

const sections = [
  {
    id: "hero",
    label: "Home",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12L12 3l9 9" />
        <path d="M9 21V12h6v9" />
        <path d="M5 10v11h14V10" />
      </svg>
    ),
  },
  {
    id: "contenthub",
    label: "Content Hub",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <polygon points="10,8 17,12 10,16" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "members",
    label: "Members",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="7" r="4" />
        <path d="M2 21v-1a6 6 0 0 1 12 0v1" />
        <path d="M17 11a3 3 0 1 0 0-6" />
        <path d="M22 21v-1a5 5 0 0 0-4-4.9" />
      </svg>
    ),
  },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#bg-nav-menu")) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');

        #bg-nav-menu {
          --gold: #C9A84C;
          --gold-light: #E8C96A;
          --gold-dim: rgba(201,168,76,0.15);
          --bg-panel: #0A0A0A;
          --bg-row: rgba(255,255,255,0.02);
          --bg-row-hover: rgba(201,168,76,0.07);
          --border: rgba(201,168,76,0.2);
          --text-primary: #F5F0E8;
          --text-muted: rgba(245,240,232,0.4);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Trigger button ── */
        .bg-trigger {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #0A0A0A;
          border: 1px solid var(--border);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          flex-direction: column;
          transition: border-color 0.2s, background 0.2s;
          padding: 0;
        }
        .bg-trigger:hover {
          border-color: var(--gold);
          background: rgba(201,168,76,0.05);
        }
        .bg-trigger-bar {
          width: 18px;
          height: 1.5px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
          transform-origin: center;
        }
        .bg-trigger.is-open .bg-trigger-bar:nth-child(1) {
          transform: translateY(5px) rotate(45deg);
        }
        .bg-trigger.is-open .bg-trigger-bar:nth-child(2) {
          opacity: 0;
          width: 0;
        }
        .bg-trigger.is-open .bg-trigger-bar:nth-child(3) {
          transform: translateY(-5px) rotate(-45deg);
        }

        /* ── Overlay backdrop ── */
        .bg-overlay {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .bg-overlay.is-open {
          opacity: 1;
          pointer-events: all;
        }

        /* ── Side panel ── */
        .bg-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          width: 300px;
          background: var(--bg-panel);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .bg-panel.is-open {
          transform: translateX(0);
        }
        .bg-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }

        /* ── Panel header ── */
        .bg-panel-header {
          padding: 28px 24px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bg-panel-logo-img {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .bg-panel-title {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .bg-panel-title span:first-child {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 2px;
          color: var(--text-primary);
          line-height: 1;
        }
        .bg-panel-title span:last-child {
          font-size: 11px;
          color: var(--gold);
          letter-spacing: 1px;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* ── Section label ── */
        .bg-section-label {
          padding: 16px 24px 8px;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 600;
        }

        /* ── Nav items ── */
        .bg-nav-list {
          list-style: none;
          margin: 0;
          padding: 0 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .bg-nav-item {
          border-radius: 8px;
          overflow: hidden;
        }
        .bg-nav-btn {
          width: 100%;
          background: var(--bg-row);
          border: none;
          cursor: pointer;
          padding: 11px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 8px;
          transition: background 0.15s ease, color 0.15s ease;
          position: relative;
          text-align: left;
        }
        .bg-nav-btn:hover {
          background: var(--bg-row-hover);
        }
        .bg-nav-btn.active {
          background: var(--gold-dim);
        }
        .bg-nav-btn.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 60%;
          background: var(--gold);
          border-radius: 0 2px 2px 0;
        }
        .bg-nav-icon {
          color: var(--text-muted);
          flex-shrink: 0;
          transition: color 0.15s;
          display: flex;
          align-items: center;
        }
        .bg-nav-btn.active .bg-nav-icon,
        .bg-nav-btn:hover .bg-nav-icon {
          color: var(--gold);
        }
        .bg-nav-label {
          font-size: 13.5px;
          font-weight: 500;
          color: var(--text-primary);
          flex: 1;
          letter-spacing: 0.2px;
        }
        .bg-nav-btn.active .bg-nav-label {
          color: var(--gold-light);
        }
        .bg-nav-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          opacity: 0;
          transition: opacity 0.15s;
          flex-shrink: 0;
        }
        .bg-nav-btn.active .bg-nav-dot {
          opacity: 1;
        }

        /* ── Divider ── */
        .bg-divider {
          height: 1px;
          background: var(--border);
          margin: 12px 24px;
        }

        /* ── Footer ── */
        .bg-panel-footer {
          margin-top: auto;
          padding: 20px 24px;
          border-top: 1px solid var(--border);
        }
        .bg-join-btn {
          width: 100%;
          padding: 12px;
          background: var(--gold);
          border: none;
          border-radius: 8px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 2.5px;
          color: #0A0A0A;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .bg-join-btn:hover {
          background: var(--gold-light);
          transform: translateY(-1px);
        }
        .bg-join-btn:active {
          transform: translateY(0);
        }
        .bg-panel-sub {
          margin-top: 10px;
          text-align: center;
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }
      `}</style>

      <div id="bg-nav-menu">
        {/* Trigger */}
        <button
          className={`bg-trigger ${open ? "is-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span className="bg-trigger-bar" />
          <span className="bg-trigger-bar" />
          <span className="bg-trigger-bar" />
        </button>

        {/* Backdrop */}
        <div
          className={`bg-overlay ${open ? "is-open" : ""}`}
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <nav className={`bg-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
          {/* Header */}
          <div className="bg-panel-header">
            <img
              src="/images/BG.jpg"
              alt="BG Logo"
              className="bg-panel-logo-img"
            />
            <div className="bg-panel-title">
              <span>Billionaire Gang</span>
              <span>Navigation</span>
            </div>
          </div>

          {/* Nav */}
          <p className="bg-section-label">Sections</p>
          <ul className="bg-nav-list">
            {sections.map(({ id, label, icon }) => (
              <li key={id} className="bg-nav-item">
                <button
                  className={`bg-nav-btn ${activeSection === id ? "active" : ""}`}
                  onClick={() => scrollTo(id)}
                >
                  <span className="bg-nav-icon">{icon}</span>
                  <span className="bg-nav-label">{label}</span>
                  <span className="bg-nav-dot" />
                </button>
              </li>
            ))}
          </ul>

          <div className="bg-divider" />

          {/* Footer CTA */}
            <div className="bg-panel-footer">
            <button
                className="bg-join-btn"
                onClick={() =>
                window.open("https://www.youtube.com/@officialbillionairegang", "_blank")
                }
            >
                Join the Gang
            </button>

            <p className="bg-panel-sub">2.89M subscribers · Philippines</p>
            </div>
        </nav>
      </div>
    </>
  );
}