"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";

type Job = {
  id: string;
  company: string;
  role: string;
  status: string;
  location?: string;
  created_at?: string;
};

function Spinner({ color = "#c9a84c", size = 20 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ animation: "trackrSpin 0.8s linear infinite" }}>
      <circle cx="10" cy="10" r="7" stroke={`${color}28`} strokeWidth="2.5" />
      <path d="M10 3a7 7 0 017 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

type Section = { id: string; label: string };
const SECTIONS: Section[] = [
  { id: "profile",   label: "Profile"   },
  { id: "account",  label: "Account"   },
  { id: "danger",   label: "Danger Zone"},
];

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const [savingPw, setSavingPw] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [showDanger, setShowDanger] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []); // Initialize mounted state

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

  const gold   = dark ? "#d4b563" : "#9a7318";
  const goldM  = dark ? "rgba(212,181,99,0.14)" : "rgba(154,115,24,0.1)";
  const bgCard = dark ? "#28251f" : "#ffffff";
  const brd    = dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)";
  const brdSub = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const tx     = dark ? "#f5f1eb" : "#1c1a17";
  const txM    = dark ? "#8a7f78" : "#a09890";
  const txF    = dark ? "#5a5550" : "#d4cfc9";
  const inBg   = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const red    = "#ef4444";
  const redM   = dark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.05)";
  const redB   = dark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.2)";

  useEffect(() => {
    const load = async () => {
      const { data: sd } = await supabase.auth.getSession();
      if (!sd.session) { router.push("/login"); return; }
      const u = sd.session.user;
      setEmail(u.email || "");
      setUserEmail(u.email || "");
      setDisplayName(u.email?.split("@")[0] || "");
      const { data } = await supabase.from("jobs").select("*").eq("user_id", sd.session.user.id).order("created_at", { ascending: false });
      if (data) setJobs(data);
      setLoading(false);
    };
    load();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const theme = dark 
    ? {
        bg: "#1a1815",
        bgS: "#1f1d1a",
        bgCard: "#28251f",
        bgGlass: "rgba(40,37,31,0.85)",
        brd: "rgba(255,255,255,0.09)",
        brdSub: "rgba(255,255,255,0.05)",
        tx: "#f5f1eb",
        txM: "#8a7f78",
        txF: "#5a5550",
        gold: "#d4b563",
        goldM: "rgba(212,181,99,0.14)",
        goldB: "rgba(212,181,99,0.32)",
      }
    : {
        bg: "#f4f2ef",
        bgS: "#ede9e4",
        bgCard: "#ffffff",
        bgGlass: "rgba(255,255,255,0.85)",
        brd: "rgba(0,0,0,0.08)",
        brdSub: "rgba(0,0,0,0.05)",
        tx: "#1c1a17",
        txM: "#a09890",
        txF: "#d4cfc9",
        gold: "#9a7318",
        goldM: "rgba(154,115,24,0.1)",
        goldB: "rgba(154,115,24,0.3)",
      };

  const { bg, bgS, bgGlass } = theme;

  const handleChangePassword = async () => {
    if (!newPw || !confirmPw) { setPwMsg({ text: "Please fill all fields", ok: false }); return; }
    if (newPw !== confirmPw)   { setPwMsg({ text: "Passwords do not match", ok: false }); return; }
    if (newPw.length < 6)      { setPwMsg({ text: "Password must be at least 6 characters", ok: false }); return; }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setSavingPw(false);
    if (error) setPwMsg({ text: error.message, ok: false });
    else { setPwMsg({ text: "Password updated successfully", ok: true }); setNewPw(""); setConfirmPw(""); }
    setTimeout(() => setPwMsg(null), 4000);
  };

  const inputSt: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: theme.bgCard === "#141210" ? inBg : "rgba(0,0,0,0.02)", border: `1px solid ${theme.brd}`,
    borderRadius: 10, color: theme.tx, fontSize: 13.5,
    fontFamily: "'Outfit', sans-serif",
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
  };

  const initials = email.split("@")[0].slice(0, 2).toUpperCase();

  if (!mounted || loading) return (
    <div style={{ minHeight: "100vh", background: theme.bgCard, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap'); @keyframes dashSpin{to{transform:rotate(360deg);}}`}</style>
      <Spinner color={theme.gold} size={24} />
      <span style={{ color: theme.txM, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>Loading settings</span>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes dashSpin{to{transform:rotate(360deg);}}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        .s-up{animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${theme.brd};border-radius:4px;}
        ::placeholder{color:${theme.txM};}
        .nb{cursor:pointer;background:none;border:none;font-family:'Outfit',sans-serif;}
        .ch{transition:border-color 0.2s,box-shadow 0.2s;}
        input{outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;}
        input::placeholder{color:${theme.txM};}
        input:focus{border-color:${theme.goldB}!important;box-shadow:0 0 0 3px ${theme.goldM}!important;background:${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.02)"}!important;}
        .snav{transition:background 0.15s,color 0.15s,border-color 0.15s;cursor:pointer;}
        .btn-primary{transition:opacity 0.15s,transform 0.15s,box-shadow 0.2s;}
        .btn-primary:hover:not(:disabled){opacity:0.88;transform:translateY(-1px);}
        .btn-primary:active:not(:disabled){transform:translateY(0)!important;}
        .btn-danger{transition:opacity 0.15s,transform 0.15s;}
        .btn-danger:hover:not(:disabled){opacity:0.9;transform:translateY(-1px);}
      `}</style>

      <div style={{ minHeight: "100vh", background: bg, display: "flex", fontFamily: "'Outfit', sans-serif", color: theme.tx }}>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", zIndex: 20 }}
            onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <DashboardSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userEmail={userEmail}
          jobs={jobs}
          dark={dark}
          gold={theme.gold}
          goldM={theme.goldM}
          goldB={theme.goldB}
          bgS={bgS}
          brd={theme.brd}
          brdSub={theme.brdSub}
          tx={theme.tx}
          txM={theme.txM}
          txF={theme.txF}
          onLogout={async () => { await supabase.auth.signOut(); router.push("/login"); }}
        />

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <DashboardTopbar
            title="Settings"
            setSidebarOpen={setSidebarOpen}
            dark={dark}
            setDark={handleSetDark}
            bgGlass={bgGlass}
            brdSub={theme.brdSub}
            tx={theme.tx}
            txM={theme.txM}
            gold={theme.gold}
            goldM={theme.goldM}
          />

          <main style={{ flex: 1, padding: "28px 28px 48px", display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}>

            {/* Header */}
            <div className="s-up">
              <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: theme.txM, marginBottom: 8 }}>Preferences</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: theme.tx, letterSpacing: "0.01em", marginBottom: 6 }}>
                Settings
              </h1>
              <p style={{ color: theme.txM, fontSize: 13, fontWeight: 300 }}>Manage your account preferences and security.</p>
            </div>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

              {/* Sidebar nav */}
              <div className="s-up" style={{ animationDelay: "60ms", width: 180, flexShrink: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {SECTIONS.map(s => {
                    const active = activeSection === s.id;
                    return (
                      <button key={s.id} className="nb snav"
                        onClick={() => setActiveSection(s.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 14px", borderRadius: 10, textAlign: "left",
                          background: active ? theme.goldM : "transparent",
                          border: `1px solid ${active ? theme.goldB : "transparent"}`,
                          color: active ? theme.gold : theme.txM,
                          fontSize: 13, fontWeight: active ? 500 : 400,
                        }}>
                        {s.id === "profile"  && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
                        {s.id === "account" && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="5" width="10" height="7" rx="1.3" stroke="currentColor" strokeWidth="1.3"/><path d="M4 5V4a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
                        {s.id === "danger"  && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5l5 9H1.5l5-9z" stroke={active ? theme.gold : red} strokeWidth="1.3" strokeLinejoin="round"/><path d="M6.5 5.5v2M6.5 9v.5" stroke={active ? theme.gold : red} strokeWidth="1.3" strokeLinecap="round"/></svg>}
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content panels */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>

                {/* ── PROFILE SECTION ── */}
                {activeSection === "profile" && (
                  <div className="s-up" style={{ animationDelay: "80ms" }}>
                    {/* Avatar card */}
                    <div className="ch" style={{ background: theme.bgCard, border: `1px solid ${theme.brd}`, borderRadius: 16, padding: "24px 24px 20px", marginBottom: 14 }}>
                      <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.13em", color: theme.txM, marginBottom: 20 }}>Account Identity</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: "50%",
                          background: `linear-gradient(135deg, ${theme.gold}, #8b6914)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18, fontWeight: 600, color: "#0c0b0a",
                          fontFamily: "'Playfair Display', serif",
                          boxShadow: `0 4px 20px ${theme.goldM}`,
                          flexShrink: 0,
                        }}>
                          {initials}
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: theme.tx, marginBottom: 3 }}>
                            {displayName || email.split("@")[0]}
                          </p>
                          <p style={{ fontSize: 12, color: theme.txM }}>{email}</p>
                        </div>
                      </div>

                      {/* Email field (read-only) */}
                      <div style={{ marginBottom: 14 }}>
                        <label style={{ display: "block", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.txM, marginBottom: 7 }}>
                          Email Address
                        </label>
                        <div style={{ ...inputSt, color: theme.txM, background: theme.bgCard, borderColor: theme.brd, display: "flex", alignItems: "center", gap: 10 }}>
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <rect x="1.5" y="3" width="10" height="7.5" rx="1.3" stroke={theme.txM} strokeWidth="1.3"/>
                            <path d="M1.5 5l5 3 5-3" stroke={theme.txM} strokeWidth="1.3"/>
                          </svg>
                          {email}
                          <span style={{ marginLeft: "auto", fontSize: 10, background: theme.goldM, border: `1px solid ${theme.goldB}`, color: theme.gold, padding: "2px 8px", borderRadius: 100 }}>Verified</span>
                        </div>
                      </div>

                      {/* Member since */}
                      <div style={{ padding: "12px 14px", background: theme.bgCard === "#141210" ? inBg : "rgba(0,0,0,0.02)", borderRadius: 10, border: `1px solid ${theme.brdSub}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: theme.txM }}>Member since</span>
                        <span style={{ fontSize: 12, color: theme.txF, fontFamily: "monospace" }}>{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ACCOUNT / SECURITY ── */}
                {activeSection === "account" && (
                  <div className="s-up" style={{ animationDelay: "80ms" }}>
                    <div className="ch" style={{ background: theme.bgCard, border: `1px solid ${theme.brd}`, borderRadius: 16, padding: "24px 24px 22px" }}>
                      <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.13em", color: theme.txM, marginBottom: 20 }}>Change Password</p>

                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {[
                          { label: "New Password",     val: newPw,     set: setNewPw,     ph: "Min. 6 characters", type: "password" },
                          { label: "Confirm Password", val: confirmPw, set: setConfirmPw, ph: "Repeat password",    type: "password" },
                        ].map(({ label, val, set, ph, type }) => (
                          <div key={label}>
                            <label style={{ display: "block", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.txM, marginBottom: 7 }}>{label}</label>
                            <input type={type} value={val} placeholder={ph} onChange={e => set(e.target.value)} style={inputSt} />
                          </div>
                        ))}

                    {/* Password strength */}
                    {newPw.length > 0 && (
                      <div>
                        <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
                        {[1,2,3,4].map(i => {
                            const lvl = newPw.length < 6 ? 1 : newPw.length < 9 ? 2 : newPw.length < 12 ? 3 : 4;
                            const c = lvl >= 3 ? "#34d399" : lvl >= 2 ? "#fbbf24" : "#ef4444";
                            return <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i <= lvl ? c : theme.brdSub, transition: "background 0.3s" }} />;
                          })}
                        </div>
                        <p style={{ fontSize: 11, color: newPw.length < 6 ? red : newPw.length < 9 ? "#fbbf24" : "#34d399" }}>
                          {newPw.length < 6 ? "Too short" : newPw.length < 9 ? "Fair" : newPw.length < 12 ? "Good" : "Strong"}
                        </p>
                      </div>
                    )}

                    {/* Message */}
                    {pwMsg && (
                      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 13px", borderRadius: 10, background: pwMsg.ok ? "rgba(52,211,153,0.08)" : redM, border: `1px solid ${pwMsg.ok ? "rgba(52,211,153,0.25)" : redB}` }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          {pwMsg.ok
                            ? <path d="M2.5 6.5l3 3 5-5" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            : <><circle cx="6.5" cy="6.5" r="5" stroke={red} strokeWidth="1.3"/><path d="M6.5 4v2.5M6.5 8.5v.5" stroke={red} strokeWidth="1.3" strokeLinecap="round"/></>
                          }
                        </svg>
                        <p style={{ fontSize: 12.5, color: pwMsg.ok ? "#34d399" : red }}>{pwMsg.text}</p>
                      </div>
                    )}

                    <button
                      className="btn-primary nb"
                      onClick={handleChangePassword}
                      disabled={savingPw}
                      style={{
                        padding: "12px", borderRadius: 11,
                        background: `linear-gradient(135deg, ${gold}, #a07820)`,
                        color: "#0c0b0a", fontSize: 13, fontWeight: 600,
                        opacity: savingPw ? 0.6 : 1,
                        cursor: savingPw ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        boxShadow: `0 4px 16px ${goldM}`, letterSpacing: "0.02em",
                      }}>
                      {savingPw ? <><Spinner color="#0c0b0a" size={14} />Saving…</> : "Update Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── DANGER ZONE ── */}
            {activeSection === "danger" && (
              <div className="sup" style={{ animationDelay: "80ms", display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Sign out */}
                <div className="ch" style={{ background: bgCard, border: `1px solid ${brd}`, borderRadius: 16, padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 500, color: tx, marginBottom: 3 }}>Sign out</p>
                      <p style={{ fontSize: 12, color: txM, fontWeight: 300 }}>Sign out of your account on this device.</p>
                    </div>
                    <button className="nb btn-primary"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      style={{ padding: "9px 18px", borderRadius: 10, background: inBg, border: `1px solid ${brd}`, color: txM, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, opacity: loggingOut ? 0.6 : 1 }}>
                      {loggingOut ? <Spinner color={txM} size={13} /> : (
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M5 2H2.5A1.5 1.5 0 001 3.5v6A1.5 1.5 0 002.5 11H5M9 9.5L12 6.5 9 3.5M12 6.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      Sign out
                    </button>
                  </div>
                </div>

                {/* Delete account */}
                <div className="ch" style={{ background: bgCard, border: `1px solid ${redB}`, borderRadius: 16, padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: red }} />
                        <p style={{ fontSize: 13.5, fontWeight: 500, color: red }}>Delete Account</p>
                      </div>
                      <p style={{ fontSize: 12, color: txM, fontWeight: 300, lineHeight: 1.5, maxWidth: 300 }}>
                        Permanently delete your account and all data. This action cannot be undone.
                      </p>
                    </div>
                    {!showDanger ? (
                      <button className="nb btn-danger"
                        onClick={() => setShowDanger(true)}
                        style={{ padding: "9px 18px", borderRadius: 10, background: redM, border: `1px solid ${redB}`, color: red, fontSize: 13, fontWeight: 500 }}>
                        Delete Account
                      </button>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 200 }}>
                        <p style={{ fontSize: 12, color: red, fontWeight: 400 }}>Are you absolutely sure?</p>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="nb"
                            onClick={() => setShowDanger(false)}
                            style={{ flex: 1, padding: "8px", borderRadius: 9, background: inBg, border: `1px solid ${brd}`, color: txM, fontSize: 12, cursor: "pointer" }}>
                            Cancel
                          </button>
                          <button className="nb btn-danger"
                            style={{ flex: 1, padding: "8px", borderRadius: 9, background: red, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                            Confirm
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Version info */}
                <div style={{ padding: "12px 16px", borderRadius: 12, border: `1px solid ${brdSub}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: txF, letterSpacing: "0.06em" }}>TRACKR · JOB INTELLIGENCE</span>
                  <span style={{ fontSize: 11, color: txF, fontFamily: "monospace" }}>v1.0.0</span>
                </div>
              </div>
            )}
          </div>
            </div>
        </main>
        </div>
      </div>
    </>
  );
}