"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const [saveMsg, setSaveMsg] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [showDanger, setShowDanger] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const gold   = "#c9a84c";
  const goldM  = "rgba(201,168,76,0.11)";
  const goldB  = "rgba(201,168,76,0.27)";
  const bgCard = "#141210";
  const brd    = "rgba(255,255,255,0.07)";
  const brdSub = "rgba(255,255,255,0.04)";
  const tx     = "#ede9e2";
  const txM    = "#5a5650";
  const txF    = "#2e2c2a";
  const inBg   = "rgba(255,255,255,0.04)";
  const inBgF  = "rgba(255,255,255,0.07)";
  const red    = "#ef4444";
  const redM   = "rgba(239,68,68,0.1)";
  const redB   = "rgba(239,68,68,0.25)";

  useEffect(() => {
    const load = async () => {
      const { data: sd } = await supabase.auth.getSession();
      if (!sd.session) { router.push("/login"); return; }
      const u = sd.session.user;
      setEmail(u.email || "");
      setDisplayName(u.email?.split("@")[0] || "");
      setLoading(false);
    };
    load();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleChangePassword = async () => {
    if (!newPw || !confirmPw) { setPwMsg({ text: "Please fill all fields", ok: false }); return; }
    if (newPw !== confirmPw)   { setPwMsg({ text: "Passwords do not match", ok: false }); return; }
    if (newPw.length < 6)      { setPwMsg({ text: "Password must be at least 6 characters", ok: false }); return; }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setSavingPw(false);
    if (error) setPwMsg({ text: error.message, ok: false });
    else { setPwMsg({ text: "Password updated successfully", ok: true }); setOldPw(""); setNewPw(""); setConfirmPw(""); }
    setTimeout(() => setPwMsg(null), 4000);
  };

  const inputSt: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    background: inBg, border: `1px solid ${brd}`,
    borderRadius: 10, color: tx, fontSize: 13.5,
    fontFamily: "'Outfit', sans-serif",
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
  };

  const initials = email.split("@")[0].slice(0, 2).toUpperCase();

  if (loading) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@keyframes trackrSpin{to{transform:rotate(360deg);}}`}</style>
      <Spinner color={gold} size={22} />
      <span style={{ color: txM, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>Loading settings</span>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
        *{box-sizing:border-box;}
        @keyframes trackrSpin{to{transform:rotate(360deg);}}
        @keyframes sup{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        .sup{animation:sup 0.38s cubic-bezier(0.16,1,0.3,1) both;}
        .ch{transition:border-color 0.2s,box-shadow 0.2s;}
        input{outline:none;transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;}
        input::placeholder{color:${txM};}
        input:focus{border-color:${goldB}!important;box-shadow:0 0 0 3px ${goldM}!important;background:${inBgF}!important;}
        .nb{cursor:pointer;background:none;border:none;font-family:'Outfit',sans-serif;}
        .snav{transition:background 0.15s,color 0.15s,border-color 0.15s;cursor:pointer;}
        .btn-primary{transition:opacity 0.15s,transform 0.15s,box-shadow 0.2s;}
        .btn-primary:hover:not(:disabled){opacity:0.88;transform:translateY(-1px);}
        .btn-primary:active:not(:disabled){transform:translateY(0)!important;}
        .btn-danger{transition:opacity 0.15s,transform 0.15s;}
        .btn-danger:hover:not(:disabled){opacity:0.9;transform:translateY(-1px);}
      `}</style>

      <div style={{ padding: "32px 28px 64px", display: "flex", flexDirection: "column", gap: 28, fontFamily: "'Outfit', sans-serif", color: tx, maxWidth: 780 }}>

        {/* Header */}
        <div className="sup">
          <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: txM, marginBottom: 8 }}>Preferences</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 400, color: tx, letterSpacing: "0.01em", marginBottom: 6 }}>
            Settings
          </h1>
          <p style={{ color: txM, fontSize: 13, fontWeight: 300 }}>Manage your account preferences and security.</p>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

          {/* Sidebar nav */}
          <div className="sup" style={{ animationDelay: "60ms", width: 180, flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {SECTIONS.map(s => {
                const active = activeSection === s.id;
                return (
                  <button key={s.id} className="nb snav"
                    onClick={() => setActiveSection(s.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 14px", borderRadius: 10, textAlign: "left",
                      background: active ? goldM : "transparent",
                      border: `1px solid ${active ? goldB : "transparent"}`,
                      color: active ? gold : txM,
                      fontSize: 13, fontWeight: active ? 500 : 400,
                    }}>
                    {s.id === "profile"  && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 12c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
                    {s.id === "account" && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="5" width="10" height="7" rx="1.3" stroke="currentColor" strokeWidth="1.3"/><path d="M4 5V4a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
                    {s.id === "danger"  && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5l5 9H1.5l5-9z" stroke={active ? gold : red} strokeWidth="1.3" strokeLinejoin="round"/><path d="M6.5 5.5v2M6.5 9v.5" stroke={active ? gold : red} strokeWidth="1.3" strokeLinecap="round"/></svg>}
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
              <div className="sup" style={{ animationDelay: "80ms" }}>
                {/* Avatar card */}
                <div className="ch" style={{ background: bgCard, border: `1px solid ${brd}`, borderRadius: 16, padding: "24px 24px 20px", marginBottom: 14 }}>
                  <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.13em", color: txM, marginBottom: 20 }}>Account Identity</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${gold}, #8b6914)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, fontWeight: 600, color: "#0c0b0a",
                      fontFamily: "'Playfair Display', serif",
                      boxShadow: `0 4px 20px ${goldM}`,
                      flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, color: tx, marginBottom: 3 }}>
                        {displayName || email.split("@")[0]}
                      </p>
                      <p style={{ fontSize: 12, color: txM }}>{email}</p>
                    </div>
                  </div>

                  {/* Email field (read-only) */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: txM, marginBottom: 7 }}>
                      Email Address
                    </label>
                    <div style={{ ...inputSt, color: txM, background: inBg, borderColor: brd, display: "flex", alignItems: "center", gap: 10 }}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <rect x="1.5" y="3" width="10" height="7.5" rx="1.3" stroke={txM} strokeWidth="1.3"/>
                        <path d="M1.5 5l5 3 5-3" stroke={txM} strokeWidth="1.3"/>
                      </svg>
                      {email}
                      <span style={{ marginLeft: "auto", fontSize: 10, background: goldM, border: `1px solid ${goldB}`, color: gold, padding: "2px 8px", borderRadius: 100 }}>Verified</span>
                    </div>
                  </div>

                  {/* Member since */}
                  <div style={{ padding: "12px 14px", background: inBg, borderRadius: 10, border: `1px solid ${brdSub}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: txM }}>Member since</span>
                    <span style={{ fontSize: 12, color: txF, fontFamily: "monospace" }}>{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── ACCOUNT / SECURITY ── */}
            {activeSection === "account" && (
              <div className="sup" style={{ animationDelay: "80ms" }}>
                <div className="ch" style={{ background: bgCard, border: `1px solid ${brd}`, borderRadius: 16, padding: "24px 24px 22px" }}>
                  <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.13em", color: txM, marginBottom: 20 }}>Change Password</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      { label: "New Password",     val: newPw,     set: setNewPw,     ph: "Min. 6 characters", type: "password" },
                      { label: "Confirm Password", val: confirmPw, set: setConfirmPw, ph: "Repeat password",    type: "password" },
                    ].map(({ label, val, set, ph, type }) => (
                      <div key={label}>
                        <label style={{ display: "block", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: txM, marginBottom: 7 }}>{label}</label>
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
                            return <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i <= lvl ? c : brdSub, transition: "background 0.3s" }} />;
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
      </div>
    </>
  );
}