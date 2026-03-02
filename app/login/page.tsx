"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/dashboard");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  // CSS variables driven by dark/light
  const t = dark
    ? {
        bg: "#0f0e0d",
        bgCard: "#161513",
        border: "rgba(255,255,255,0.07)",
        borderStrong: "rgba(255,255,255,0.12)",
        text: "#f5f0eb",
        textMuted: "#6b6560",
        textSub: "#9b9490",
        inputBg: "rgba(255,255,255,0.04)",
        inputBgFocus: "rgba(255,255,255,0.07)",
        accent: "#c9a84c",
        accentMuted: "rgba(201,168,76,0.12)",
        accentBorder: "rgba(201,168,76,0.3)",
        shadow: "0 32px 80px rgba(0,0,0,0.6)",
        errorBg: "rgba(239,68,68,0.08)",
        errorBorder: "rgba(239,68,68,0.2)",
        toggleBg: "rgba(255,255,255,0.06)",
      }
    : {
        bg: "#f7f5f2",
        bgCard: "#ffffff",
        border: "rgba(0,0,0,0.07)",
        borderStrong: "rgba(0,0,0,0.12)",
        text: "#1a1714",
        textMuted: "#9b9490",
        textSub: "#6b6560",
        inputBg: "rgba(0,0,0,0.03)",
        inputBgFocus: "rgba(0,0,0,0.06)",
        accent: "#b8942e",
        accentMuted: "rgba(184,148,46,0.1)",
        accentBorder: "rgba(184,148,46,0.35)",
        shadow: "0 32px 80px rgba(0,0,0,0.1)",
        errorBg: "rgba(239,68,68,0.05)",
        errorBorder: "rgba(239,68,68,0.2)",
        toggleBg: "rgba(0,0,0,0.06)",
      };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${t.bg}; }
        .auth-input { transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
        .auth-input::placeholder { color: ${t.textMuted}; }
        .auth-btn { transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s; }
        .auth-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(201,168,76,0.4) !important; }
        .auth-btn:active:not(:disabled) { transform: translateY(0); }
        .toggle-btn { transition: background 0.2s; }
        .toggle-btn:hover { background: ${t.toggleBg} !important; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease both; }
        .link-hover { transition: color 0.15s; }
        .link-hover:hover { color: ${t.accent} !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>

        {/* Subtle texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: dark
            ? "radial-gradient(ellipse 60% 50% at 20% 20%, rgba(201,168,76,0.04) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 80%, rgba(201,168,76,0.03) 0%, transparent 70%)"
            : "radial-gradient(ellipse 60% 50% at 20% 20%, rgba(184,148,46,0.05) 0%, transparent 70%)",
        }} />

        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="toggle-btn"
          style={{
            position: "fixed", top: "24px", right: "24px",
            width: "38px", height: "38px", borderRadius: "50%",
            border: `1px solid ${t.border}`,
            background: t.toggleBg,
            color: t.textMuted, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
          }}
        >
          {dark ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l-1.41 1.41M4.93 19.07l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="fade-in" style={{ width: "100%", maxWidth: "420px" }}>

          {/* Logo mark */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "12px",
              border: `1px solid ${t.accentBorder}`,
              background: t.accentMuted,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 4.5h12M3 9h8M3 13.5h5.5" stroke={t.accent} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 500, color: t.text, letterSpacing: "0.04em" }}>
              Trackr
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            borderRadius: "20px",
            padding: "40px",
            boxShadow: t.shadow,
          }}>
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 400, color: t.text, letterSpacing: "0.01em", lineHeight: 1.2, marginBottom: "8px" }}>
                Welcome back
              </h1>
              <p style={{ color: t.textMuted, fontSize: "13.5px", fontWeight: 300 }}>
                Sign in to continue your job search
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Email */}
              <div>
                <label style={{ display: "block", color: t.textSub, fontSize: "10.5px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="you@example.com"
                  className="auth-input"
                  style={{
                    width: "100%", padding: "13px 16px",
                    background: t.inputBg,
                    border: `1px solid ${t.border}`,
                    borderRadius: "12px",
                    color: t.text, fontSize: "14px",
                    outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = t.accentBorder;
                    e.target.style.boxShadow = `0 0 0 3px ${t.accentMuted}`;
                    e.target.style.background = t.inputBgFocus;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = t.border;
                    e.target.style.boxShadow = "none";
                    e.target.style.background = t.inputBg;
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ color: t.textSub, fontSize: "10.5px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Password
                  </label>
                  <a href="#" className="link-hover" style={{ color: t.textMuted, fontSize: "12px" }}>
                    Forgot?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="auth-input"
                  style={{
                    width: "100%", padding: "13px 16px",
                    background: t.inputBg,
                    border: `1px solid ${t.border}`,
                    borderRadius: "12px",
                    color: t.text, fontSize: "14px",
                    outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = t.accentBorder;
                    e.target.style.boxShadow = `0 0 0 3px ${t.accentMuted}`;
                    e.target.style.background = t.inputBgFocus;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = t.border;
                    e.target.style.boxShadow = "none";
                    e.target.style.background = t.inputBg;
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px 14px", borderRadius: "12px",
                  background: t.errorBg, border: `1px solid ${t.errorBorder}`,
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.3" />
                    <path d="M7 4v3M7 9v.5" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>
                </div>
              )}

              {/* Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="auth-btn"
                style={{
                  width: "100%", padding: "14px",
                  background: t.accent,
                  border: "none", borderRadius: "12px",
                  color: "#0f0e0d", fontSize: "13.5px", fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.04em",
                  boxShadow: `0 4px 20px rgba(201,168,76,0.25)`,
                }}
              >
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <svg className="spin" width="14" height="14" viewBox="0 0 14 14" fill="none"
                      style={{ animation: "spin 0.8s linear infinite" }}>
                      <circle cx="7" cy="7" r="5" stroke="rgba(15,14,13,0.3)" strokeWidth="2" />
                      <path d="M7 2a5 5 0 015 5" stroke="#0f0e0d" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign in"}
              </button>

              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

              <p style={{ textAlign: "center", color: t.textMuted, fontSize: "13px" }}>
                No account?{" "}
                <Link href="/signup" className="link-hover" style={{ color: t.accent, fontWeight: 500 }}>
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {/* Footer line */}
          <p style={{ textAlign: "center", marginTop: "32px", color: t.textMuted, fontSize: "11.5px", letterSpacing: "0.05em" }}>
            TRACKR · JOB INTELLIGENCE
          </p>
        </div>
      </div>
    </>
  );
}