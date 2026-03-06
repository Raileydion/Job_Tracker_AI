"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const router = useRouter();

  const handleSignup = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!agreeTerms) { setError("You must agree to the Terms and Conditions."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else { setSuccess(true); setTimeout(() => router.push("/login"), 2500); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSignup();
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setDark(false);
    } else {
      setDark(true);
    }
  }, []);

  const handleSetDark = (isDark: boolean) => {
    setDark(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const t = dark
    ? {
        bg: "#1a1815", bgCard: "#28251f", border: "rgba(255,255,255,0.09)",
        text: "#f5f1eb", textMuted: "#8a7f78", textSub: "#a89f96",
        inputBg: "rgba(255,255,255,0.05)", inputBgFocus: "rgba(255,255,255,0.08)",
        accent: "#d4b563", accentMuted: "rgba(212,181,99,0.14)", accentBorder: "rgba(212,181,99,0.35)",
        shadow: "0 32px 80px rgba(0,0,0,0.4)",
        errorBg: "rgba(239,68,68,0.1)", errorBorder: "rgba(239,68,68,0.25)",
        toggleBg: "rgba(255,255,255,0.07)",
        strengthOff: "rgba(255,255,255,0.09)",
      }
    : {
        bg: "#f7f5f2", bgCard: "#ffffff", border: "rgba(0,0,0,0.07)",
        text: "#1a1714", textMuted: "#9b9490", textSub: "#6b6560",
        inputBg: "rgba(0,0,0,0.03)", inputBgFocus: "rgba(0,0,0,0.06)",
        accent: "#b8942e", accentMuted: "rgba(184,148,46,0.1)", accentBorder: "rgba(184,148,46,0.35)",
        shadow: "0 32px 80px rgba(0,0,0,0.1)",
        errorBg: "rgba(239,68,68,0.05)", errorBorder: "rgba(239,68,68,0.2)",
        toggleBg: "rgba(0,0,0,0.06)",
        strengthOff: "rgba(0,0,0,0.08)",
      };

  const strengthLevel = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : password.length < 14 ? 3 : 4;
  const strengthColor = strengthLevel <= 1 ? "#ef4444" : strengthLevel === 2 ? "#f59e0b" : strengthLevel === 3 ? "#84cc16" : "#10b981";
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strengthLevel];

  if (success) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
        <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 400, color: t.text, marginBottom: "8px" }}>Account created</h2>
            <p style={{ color: t.textMuted, fontSize: "13.5px" }}>Redirecting you to sign in…</p>
          </div>
        </div>
      </>
    );
  }

  const inputShared: React.CSSProperties = {
    width: "100%", padding: "13px 16px",
    background: t.inputBg, border: `1px solid ${t.border}`,
    borderRadius: "12px", color: t.text, fontSize: "14px",
    outline: "none", fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-input { transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
        .auth-input::placeholder { color: ${t.textMuted}; }
        .auth-btn { transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s; }
        .auth-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(201,168,76,0.4) !important; }
        .auth-btn:active:not(:disabled) { transform: translateY(0); }
        .toggle-btn { transition: background 0.2s; }
        .toggle-btn:hover { background: ${t.toggleBg} !important; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .link-hover { transition: color 0.15s; }
        .link-hover:hover { color: ${t.accent} !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>

        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: dark
            ? "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 70%)"
            : "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(184,148,46,0.05) 0%, transparent 70%)",
        }} />

        {/* Theme toggle */}
        <button onClick={() => handleSetDark(!dark)} className="toggle-btn" style={{
          position: "fixed", top: "24px", right: "24px",
          width: "38px", height: "38px", borderRadius: "50%",
          border: `1px solid ${t.border}`, background: t.toggleBg,
          color: t.textMuted, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
        }}>
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

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "12px",
              border: `1px solid ${t.accentBorder}`, background: t.accentMuted,
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 4.5h12M3 9h8M3 13.5h5.5" stroke={t.accent} strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 500, color: t.text, letterSpacing: "0.04em" }}>
              Aurevia AI
            </p>
          </div>

          {/* Card */}
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: "20px", padding: "40px", boxShadow: t.shadow }}>
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 400, color: t.text, letterSpacing: "0.01em", lineHeight: 1.2, marginBottom: "8px" }}>
                Start your journey
              </h1>
              <p style={{ color: t.textMuted, fontSize: "13.5px", fontWeight: 300 }}>
                Begin tracking your career journey
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Email */}
              <div>
                <label style={{ display: "block", color: t.textSub, fontSize: "10.5px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder="you@example.com" className="auth-input" style={inputShared}
                  onFocus={(e) => { e.target.style.borderColor = t.accentBorder; e.target.style.boxShadow = `0 0 0 3px ${t.accentMuted}`; e.target.style.background = t.inputBgFocus; }}
                  onBlur={(e) => { e.target.style.borderColor = t.border; e.target.style.boxShadow = "none"; e.target.style.background = t.inputBg; }}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", color: t.textSub, fontSize: "10.5px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>Password</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Min. 6 characters" className="auth-input" style={{ ...inputShared, paddingRight: "42px" }}
                    onFocus={(e) => { e.target.style.borderColor = t.accentBorder; e.target.style.boxShadow = `0 0 0 3px ${t.accentMuted}`; e.target.style.background = t.inputBgFocus; }}
                    onBlur={(e) => { e.target.style.borderColor = t.border; e.target.style.boxShadow = "none"; e.target.style.background = t.inputBg; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-btn"
                    style={{
                      position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", color: t.textMuted, cursor: "pointer",
                      padding: "4px 6px", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = t.textSub; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = t.textMuted; }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1, display: "flex", gap: "4px" }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{
                          flex: 1, height: "2px", borderRadius: "2px",
                          background: i <= strengthLevel ? strengthColor : t.strengthOff,
                          transition: "background 0.3s",
                        }} />
                      ))}
                    </div>
                    <span style={{ color: strengthLevel > 0 ? strengthColor : t.textMuted, fontSize: "11px", fontWeight: 500, minWidth: "32px" }}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "12px", background: t.errorBg, border: `1px solid ${t.errorBorder}` }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.3" />
                    <path d="M7 4v3M7 9v.5" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>
                </div>
              )}

              {/* Terms and Conditions */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{
                    marginTop: "4px", width: "18px", height: "18px", cursor: "pointer",
                    accentColor: t.accent,
                  }}
                />
                <label htmlFor="agree-terms" style={{ color: t.textMuted, fontSize: "13px", cursor: "pointer", lineHeight: 1.4 }}>
                  I agree to the{" "}
                  <a href="#" style={{ color: t.accent, textDecoration: "none" }} onClick={(e) => { e.preventDefault(); window.open("#", "_blank"); }}>
                    Terms and Conditions
                  </a>
                  {" "}and{" "}
                  <a href="#" style={{ color: t.accent, textDecoration: "none" }} onClick={(e) => { e.preventDefault(); window.open("#", "_blank"); }}>
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Button */}
              <button onClick={handleSignup} disabled={loading || !agreeTerms} className="auth-btn" style={{
                width: "100%", padding: "14px",
                background: t.accent, border: "none", borderRadius: "12px",
                color: "#0f0e0d", fontSize: "13.5px", fontWeight: 500,
                cursor: loading || !agreeTerms ? "not-allowed" : "pointer",
                opacity: loading || !agreeTerms ? 0.6 : 1,
                fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em",
                boxShadow: "0 4px 20px rgba(201,168,76,0.25)",
              }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                      <circle cx="7" cy="7" r="5" stroke="rgba(15,14,13,0.3)" strokeWidth="2" />
                      <path d="M7 2a5 5 0 015 5" stroke="#0f0e0d" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Creating account…
                  </span>
                ) : "Create account"}
              </button>

              <p style={{ color: t.textMuted, fontSize: "11.5px", textAlign: "center" }}>
                By continuing you agree to our{" "}
                <a href="#" className="link-hover" style={{ color: t.textSub }}>Terms</a>{" "}and{" "}
                <a href="#" className="link-hover" style={{ color: t.textSub }}>Privacy</a>
              </p>
            </div>

            <p style={{ textAlign: "center", color: t.textMuted, fontSize: "13px", marginTop: "28px" }}>
              Already have an account?{" "}
              <Link href="/login" className="link-hover" style={{ color: t.accent, fontWeight: 500 }}>
                Sign in
              </Link>
            </p>
          </div>

          <p style={{ textAlign: "center", marginTop: "32px", color: t.textMuted, fontSize: "11.5px", letterSpacing: "0.05em" }}>
            AUREVIA AI · CAREER INTELLIGENCE
          </p>
        </div>
      </div>
    </>
  );
}