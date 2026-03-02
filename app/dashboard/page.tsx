"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

type Job = {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  location?: string;
  created_at?: string;
};

const STATUS = {
  Applied:   { color: "#a78bfa", bg: "rgba(167,139,250,0.1)",  border: "rgba(167,139,250,0.25)", dot: "#7c3aed", glow: "rgba(167,139,250,0.2)"  },
  Interview: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.25)",  dot: "#d97706", glow: "rgba(251,191,36,0.2)"   },
  Offer:     { color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)",  dot: "#059669", glow: "rgba(52,211,153,0.2)"   },
  Rejected:  { color: "#6b7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)",  dot: "#374151", glow: "rgba(107,114,128,0.1)"  },
};

const CHAR_COLORS: Record<number, string> = {
  0: "#f87171", 1: "#fb923c", 2: "#fbbf24", 3: "#a3e635",
  4: "#34d399", 5: "#22d3ee", 6: "#818cf8", 7: "#e879f9",
};

function getCharColor(char: string) {
  return CHAR_COLORS[char.toLowerCase().charCodeAt(0) % 8];
}

function Avatar({ name, size = 38 }: { name: string; size?: number }) {
  const col = getCharColor(name[0] || "a");
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      background: `${col}14`, border: `1.5px solid ${col}38`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 600, color: col,
      letterSpacing: "-0.02em", fontFamily: "'Outfit', sans-serif",
    }}>
      {name[0].toUpperCase()}
    </div>
  );
}

function LoadSpinner({ color = "#c9a84c", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      style={{ animation: "dashSpin 0.75s linear infinite" }}>
      <circle cx="8" cy="8" r="6" stroke={`${color}30`} strokeWidth="2.5" />
      <path d="M8 2a6 6 0 016 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const NAV = [
  { id: "Dashboard", svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="1.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/><rect x="8.5" y="1.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/><rect x="1.5" y="8.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/><rect x="8.5" y="8.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { id: "Jobs",      svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="4" width="12" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 4V3A1.5 1.5 0 016.5 1.5h2A1.5 1.5 0 0110 3v1" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 8h12" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { id: "Analytics", svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 12l3.5-5 3 2.5 3.5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 2v11h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  { id: "Settings",  svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2.3" stroke="currentColor" strokeWidth="1.4"/><path d="M7.5 1.5v1.3M7.5 12.2v1.3M1.5 7.5h1.3M12.2 7.5h1.3M3.4 3.4l.9.9M10.7 10.7l.9.9M3.4 11.6l.9-.9M10.7 4.3l.9-.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
];

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [dark, setDark] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [mounted, setMounted] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<Job["status"]>("Applied");
  

  useEffect(() => { setMounted(true); }, []);

  // ✅ LOAD USER + JOBS
  useEffect(() => {
    const init = async () => {
      const { data: sd } = await supabase.auth.getSession();
      if (!sd.session) { router.push("/login"); return; }
      const user = sd.session.user;
      setUserEmail(user.email || "");
      const { data } = await supabase.from("jobs").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) setJobs(data);
      setLoading(false);
    };
    init();
  }, [router]);

  const resetForm = () => { setCompany(""); setRole(""); setLocation(""); setStatus("Applied"); setEditJob(null); };
  const openEdit = (job: Job) => { setEditJob(job); setCompany(job.company); setRole(job.role); setLocation(job.location || ""); setStatus(job.status); setShowModal(true); };

  // ✅ ADD / EDIT JOB
  const handleSave = async () => {
    if (!company.trim() || !role.trim()) return;
    setAddLoading(true);
    const { data: sd } = await supabase.auth.getSession();
    const user = sd.session?.user;
    if (!user) return;
    if (editJob) {
      const { data, error } = await supabase.from("jobs").update({ company, role, status, location }).eq("id", editJob.id).select();
      if (!error && data) setJobs(p => p.map(j => j.id === editJob.id ? data[0] : j));
    } else {
      const { data, error } = await supabase.from("jobs").insert([{ user_id: user.id, company, role, status, location }]).select();
      if (!error && data) setJobs(p => [data[0], ...p]);
    }
    setAddLoading(false); resetForm(); setShowModal(false);
  };

  // ✅ DELETE JOB
  const handleDelete = async (id: string) => {
    setDeleteId(id);
    await supabase.from("jobs").delete().eq("id", id);
    setJobs(p => p.filter(j => j.id !== id));
    setDeleteId(null);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); };

  const filtered = filterStatus === "All" ? jobs : jobs.filter(j => j.status === filterStatus);
  const stats = [
    { label: "Applied",   value: jobs.filter(j => j.status === "Applied").length,   icon: "📨", trend: "+2" },
    { label: "Interview", value: jobs.filter(j => j.status === "Interview").length,  icon: "🎤", trend: "+1" },
    { label: "Offers",    value: jobs.filter(j => j.status === "Offer").length,      icon: "🏆", trend: "Active" },
    { label: "Total",     value: jobs.length,                                         icon: "📋", trend: "All time" },
  ];

  const bg     = dark ? "#0c0b0a" : "#f4f2ef";
  const bgS    = dark ? "#0f0e0d" : "#ede9e4";
  const bgCard = dark ? "#141210" : "#ffffff";
  const bgGlass= dark ? "rgba(20,18,16,0.85)" : "rgba(255,255,255,0.85)";
  const brd    = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const brdSub = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";
  const tx     = dark ? "#ede9e2" : "#1c1a17";
  const txM    = dark ? "#5a5650" : "#a09890";
  const txF    = dark ? "#2e2c2a" : "#d4cfc9";
  const gold   = dark ? "#c9a84c" : "#9a7318";
  const goldM  = dark ? "rgba(201,168,76,0.12)" : "rgba(154,115,24,0.1)";
  const goldB  = dark ? "rgba(201,168,76,0.28)" : "rgba(154,115,24,0.3)";
  const inBg   = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const inBgF  = dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const rowH   = dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)";
  const glowH  = dark ? "0 0 0 1px rgba(201,168,76,0.2)" : "0 0 0 1px rgba(154,115,24,0.2)";

  if (!mounted || loading) return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap'); @keyframes dashSpin{to{transform:rotate(360deg);}}`}</style>
      <LoadSpinner color={gold} size={24} />
      <span style={{ color: txM, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>Preparing workspace</span>
    </div>
  );

  const initials = userEmail.split("@")[0].slice(0, 2).toUpperCase();
  const inputSt: React.CSSProperties = { width: "100%", padding: "11px 14px", background: inBg, border: `1px solid ${brd}`, borderRadius: 10, color: tx, fontSize: 13.5, outline: "none", fontFamily: "'Outfit', sans-serif", transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes dashSpin{to{transform:rotate(360deg);}}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-8px);}to{opacity:1;transform:translateX(0);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
        @keyframes shimmer{from{background-position:200% 0;}to{background-position:-200% 0;}}
        .s-up{animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${brd};border-radius:4px;}
        ::placeholder{color:${txM};}
        .nb{cursor:pointer;background:none;border:none;font-family:'Outfit',sans-serif;}
        .card-hover{transition:border-color 0.2s,box-shadow 0.2s,transform 0.2s;}
        .card-hover:hover{border-color:${goldB}!important;box-shadow:0 0 0 1px ${goldB},0 8px 32px rgba(0,0,0,0.2)!important;transform:translateY(-2px);}
        .row-hover{transition:background 0.15s;}
        .row-hover:hover{background:${rowH}!important;}
        .nav-item{transition:background 0.15s,color 0.15s,border-color 0.15s;}
        .btn-g{transition:opacity 0.15s,transform 0.15s,box-shadow 0.2s;cursor:pointer;}
        .btn-g:hover:not(:disabled){opacity:0.88;transform:translateY(-1px);box-shadow:0 6px 24px rgba(201,168,76,0.4)!important;}
        .btn-g:active:not(:disabled){transform:translateY(0)!important;}
        .act-btn{transition:color 0.15s,background 0.15s,transform 0.1s;cursor:pointer;}
        .act-btn:hover{transform:scale(1.1);}
        .spl-btn{transition:background 0.15s,border-color 0.15s,color 0.15s;cursor:pointer;}
        .filter-chip{transition:background 0.15s,color 0.15s,border-color 0.15s;cursor:pointer;}
        .tog{transition:background 0.15s;cursor:pointer;}
        .tog:hover{background:${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}!important;}
        input:focus{border-color:${goldB}!important;box-shadow:0 0 0 3px ${goldM}!important;background:${inBgF}!important;}
        .mob-hide{display:none;}
        @media(min-width:1024px){.mob-hide{display:flex;}}
        @media(min-width:640px){.sm-show{display:inline!important;}}
        .sm-show{display:none;}

        /* Glowing status badge */
        .badge-glow{transition:box-shadow 0.2s;}
        .badge-glow:hover{box-shadow:0 0 10px var(--badge-glow);}

        /* Sidebar gradient line accent */
        .sidebar-accent{background:linear-gradient(to bottom, ${gold}60, transparent);}
      `}</style>

      <div style={{ minHeight: "100vh", background: bg, display: "flex", fontFamily: "'Outfit', sans-serif", color: tx }}>

        {/* ── Mobile overlay ── */}
        {sidebarOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", zIndex: 20 }}
            onClick={() => setSidebarOpen(false)} />
        )}

        {/* ════════════════ SIDEBAR ════════════════ */}
        {/* Desktop: sticky 225px wide in flex row. Mobile: 0-width, inner is fixed overlay */}
        <aside style={{
          width: 0, flexShrink: 0,
          position: "relative",
          zIndex: 30,
        }} className="sidebar-aside">
          {/* Mobile slide-in override */}
          <style>{`
            @media(min-width:1024px){
              .sidebar-aside{ width: 225px !important; }
              .sidebar-el-inner{
                position:sticky;top:0;height:100vh;width:225px;
                background:${bgS};border-right:1px solid ${brd};
                transform:none;flex-shrink:0;
                display:flex;flex-direction:column;
              }
            }
            @media(max-width:1023px){
              .sidebar-el-inner{
                position:fixed!important;top:0;left:0;height:100vh!important;width:225px;
                transform:${sidebarOpen ? "translateX(0)" : "translateX(-100%)"};
                transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);
                z-index:30;
                background:${bgS};
                border-right:1px solid ${brd};
                display:flex;flex-direction:column;
              }
            }
          `}</style>
          <div className="sidebar-el-inner" style={{ display: "flex", flexDirection: "column" }}>

          {/* Gold accent line */}
          <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 2, borderRadius: 2 }} className="sidebar-accent" />

          {/* Logo */}
          <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${brdSub}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: `linear-gradient(135deg, ${gold}, ${dark ? "#8b6914" : "#c9a84c"})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 16px ${goldM}`,
              }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2.5 4h10M2.5 7.5h7M2.5 11h4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 500, color: tx, letterSpacing: "0.02em", lineHeight: 1 }}>Trackr</p>
                <p style={{ fontSize: 9, color: txM, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>Job Intelligence</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
            <p style={{ color: txF, fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", padding: "6px 10px 8px" }}>Navigation</p>
            {NAV.map(({ id, svg }) => {
              const route = `/${id.toLowerCase() === "dashboard" ? "dashboard" : id.toLowerCase()}`;
              const active = pathname === route;
              return (
                <button key={id} className="nb nav-item"
                  onClick={() => { router.push(route); setSidebarOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                    borderRadius: 10, color: active ? gold : txM,
                    background: active ? goldM : "transparent",
                    border: `1px solid ${active ? goldB : "transparent"}`,
                    fontSize: 13.5, fontWeight: active ? 500 : 400, textAlign: "left",
                    position: "relative",
                  }}>
                  <span style={{ opacity: active ? 1 : 0.6 }}>{svg}</span>
                  {id}
                  {active && <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: gold }} />}
                </button>
              );
            })}

            {/* Pipeline section */}
            <div style={{ marginTop: 20 }}>
              <p style={{ color: txF, fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", padding: "0 10px 10px" }}>Pipeline</p>
              {Object.entries(STATUS).map(([key, cfg]) => {
                const count = jobs.filter(j => j.status === key).length;
                const pct = jobs.length > 0 ? (count / jobs.length) * 100 : 0;
                return (
                  <div key={key} style={{ padding: "7px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot }} />
                        <span style={{ color: txM, fontSize: 12 }}>{key}</span>
                      </div>
                      <span style={{ color: count > 0 ? cfg.color : txF, fontSize: 11, fontWeight: 500, fontFamily: "monospace" }}>
                        {String(count).padStart(2, "0")}
                      </span>
                    </div>
                    {/* Mini progress bar */}
                    <div style={{ height: 2, background: `${cfg.dot}20`, borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: cfg.dot, borderRadius: 2, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* User card */}
          <div style={{ padding: 12, borderTop: `1px solid ${brdSub}` }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 12,
              background: goldM, border: `1px solid ${goldB}`,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${gold}, #8b6914)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 600, color: "#0c0b0a",
              }}>{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: tx, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {userEmail.split("@")[0]}
                </p>
                <p style={{ fontSize: 10, color: txM, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {userEmail}
                </p>
              </div>
              <button className="nb act-btn" onClick={handleLogout} style={{ color: txM, padding: 4, borderRadius: 6, flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={e => (e.currentTarget.style.color = txM)}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M5 2H2.5A1.5 1.5 0 001 3.5v6A1.5 1.5 0 002.5 11H5M9 9.5L12 6.5 9 3.5M12 6.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          </div>{/* end sidebar-el-inner */}
        </aside>

        {/* ════════════════ MAIN ════════════════ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

            {/* ── TOPBAR ── */}
            <header style={{
              height: 58, display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 28px", position: "sticky", top: 0, zIndex: 10,
              background: bgGlass, backdropFilter: "blur(20px)",
              borderBottom: `1px solid ${brdSub}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {/* Hamburger */}
                <button className="nb tog" onClick={() => setSidebarOpen(true)}
                  style={{ padding: "7px 8px", borderRadius: 8, color: txM, display: "flex" }}>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M2 4h13M2 8.5h9M2 13h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 400, color: tx, letterSpacing: "0.01em" }}>
                    {activeNav}
                  </h1>
                  <span className="sm-show" style={{ color: txF, fontSize: 12 }}>
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Theme toggle */}
                <button className="nb tog" onClick={() => setDark(!dark)}
                  style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${brd}`, color: txM, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {dark
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l-1.41 1.41M4.93 19.07l1.41-1.41" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  }
                </button>

                {/* Add button */}
                <button className="nb btn-g" onClick={() => { resetForm(); setShowModal(true); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 18px", borderRadius: 11,
                    background: `linear-gradient(135deg, ${gold}, ${dark ? "#a07820" : "#7a5a10"})`,
                    color: "#0c0b0a", fontSize: 13, fontWeight: 600,
                    boxShadow: `0 4px 20px ${goldM}`,
                    letterSpacing: "0.02em",
                  }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Add<span className="sm-show"> Application</span></span>
                </button>
              </div>
            </header>

            {/* ── BODY ── */}
            <main style={{ flex: 1, padding: "28px 28px 48px", display: "flex", flexDirection: "column", gap: 28, overflowY: "auto" }}>

              {/* ── GREETING BAND ── */}
              <div className="s-up" style={{
                padding: "20px 24px",
                background: `linear-gradient(135deg, ${goldM}, transparent)`,
                border: `1px solid ${goldB}`,
                borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
              }}>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 400, color: tx, letterSpacing: "0.01em" }}>
                    Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
                    <em>{userEmail.split("@")[0]}</em> ✦
                  </p>
                  <p style={{ color: txM, fontSize: 13, marginTop: 4, fontWeight: 300 }}>
                    You have <strong style={{ color: gold }}>{jobs.filter(j => j.status === "Interview").length}</strong> upcoming interviews and <strong style={{ color: gold }}>{jobs.filter(j => j.status === "Applied").length}</strong> pending applications.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {(["All", "Applied", "Interview", "Offer", "Rejected"] as const).map((f) => {
                    const active = filterStatus === f;
                    const cfg = f !== "All" ? STATUS[f] : null;
                    return (
                      <button key={f} className="nb filter-chip"
                        onClick={() => setFilterStatus(f)}
                        style={{
                          padding: "5px 13px", borderRadius: 100,
                          fontSize: 12, fontWeight: active ? 500 : 400,
                          background: active ? (cfg ? cfg.bg : goldM) : "transparent",
                          border: `1px solid ${active ? (cfg ? cfg.border : goldB) : brd}`,
                          color: active ? (cfg ? cfg.color : gold) : txM,
                        }}>
                        {f}{f !== "All" && <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.8 }}>{jobs.filter(j => j.status === f).length}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── STATS ROW ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                <style>{`@media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr)!important;}}@media(max-width:480px){.stats-grid{grid-template-columns:1fr 1fr!important;}}`}</style>
                {stats.map((s, i) => {
                  const sKey = s.label as keyof typeof STATUS;
                  const cfg = sKey in STATUS ? STATUS[sKey] : null;
                  return (
                    <div key={i} className="s-up card-hover" style={{
                      background: bgCard, border: `1px solid ${brd}`,
                      borderRadius: 16, padding: "20px 20px 16px",
                      animationDelay: `${i * 70}ms`, position: "relative", overflow: "hidden",
                    }}>
                      {/* Subtle top accent */}
                      {cfg && <div style={{ position: "absolute", top: 0, left: 16, right: 16, height: 2, borderRadius: "0 0 2px 2px", background: cfg.dot, opacity: 0.4 }} />}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                        <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: txM }}>{s.label}</p>
                        <span style={{ fontSize: 14 }}>{s.icon}</span>
                      </div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 400, color: cfg ? cfg.color : gold, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: 8 }}>
                        {s.value}
                      </p>
                      <p style={{ fontSize: 11, color: txF }}>{s.trend}</p>
                    </div>
                  );
                })}
              </div>
              <style>{`.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}`}</style>

              {/* ── JOB TABLE ── */}
              <div className="s-up" style={{ animationDelay: "280ms" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: txM }}>Applications</p>
                    <span style={{ fontSize: 10, color: txF, fontFamily: "monospace" }}>{String(filtered.length).padStart(2, "0")}</span>
                    {filterStatus !== "All" && (
                      <span style={{ fontSize: 11, color: gold, background: goldM, border: `1px solid ${goldB}`, borderRadius: 100, padding: "2px 10px" }}>
                        {filterStatus}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: txM }}>
                    {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>

                {/* Empty state */}
                {filtered.length === 0 ? (
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    padding: "64px 24px", border: `1px dashed ${brd}`, borderRadius: 20,
                    background: bgCard, textAlign: "center",
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16, marginBottom: 20,
                      background: goldM, border: `1px solid ${goldB}`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                    }}>📋</div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 400, color: tx, marginBottom: 8 }}>
                      {filterStatus === "All" ? "No applications yet" : `No ${filterStatus} applications`}
                    </p>
                    <p style={{ color: txM, fontSize: 13, fontWeight: 300, marginBottom: 24 }}>
                      {filterStatus === "All" ? "Start tracking your job search journey" : "Applications will appear here"}
                    </p>
                    {filterStatus === "All" && (
                      <button className="nb btn-g"
                        onClick={() => { resetForm(); setShowModal(true); }}
                        style={{
                          padding: "10px 22px", borderRadius: 11,
                          background: `linear-gradient(135deg, ${gold}, ${dark ? "#a07820" : "#7a5a10"})`,
                          color: "#0c0b0a", fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
                          boxShadow: `0 4px 20px ${goldM}`,
                        }}>
                        Add first application
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* ── Desktop table ── */}
                    <div style={{ display: "none" }} className="desk-view">
                      <style>{`@media(min-width:700px){.desk-view{display:block!important;}.mob-view{display:none!important;}}`}</style>
                      <div style={{ background: bgCard, border: `1px solid ${brd}`, borderRadius: 18, overflow: "hidden" }}>
                        {/* Head */}
                        <div style={{
                          display: "grid", gridTemplateColumns: "2.2fr 2fr 1.2fr 1fr 80px",
                          padding: "12px 20px", gap: 14,
                          borderBottom: `1px solid ${brdSub}`,
                          background: dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)",
                        }}>
                          {["Company", "Role", "Location", "Status", ""].map(h => (
                            <p key={h} style={{ fontSize: 9.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: txF }}>{h}</p>
                          ))}
                        </div>

                        {/* Rows */}
                        {filtered.map((job, i) => {
                          const cfg = STATUS[job.status];
                          return (
                            <div key={job.id} className="row-hover"
                              style={{
                                display: "grid", gridTemplateColumns: "2.2fr 2fr 1.2fr 1fr 80px",
                                padding: "14px 20px", gap: 14, alignItems: "center",
                                borderBottom: i < filtered.length - 1 ? `1px solid ${brdSub}` : "none",
                              }}>
                              {/* Company */}
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <Avatar name={job.company} size={36} />
                                <div>
                                  <p style={{ fontSize: 13.5, fontWeight: 500, color: tx }}>{job.company}</p>
                                  {job.created_at && <p style={{ fontSize: 10.5, color: txF, fontFamily: "monospace" }}>
                                    {new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </p>}
                                </div>
                              </div>
                              {/* Role */}
                              <p style={{ fontSize: 13, color: txM, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.role}</p>
                              {/* Location */}
                              <p style={{ fontSize: 12.5, color: txF, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.location || "—"}</p>
                              {/* Status */}
                              <div>
                                <span className="badge-glow" style={{
                                  display: "inline-flex", alignItems: "center", gap: 6,
                                  padding: "4px 10px", borderRadius: 100,
                                  background: cfg.bg, border: `1px solid ${cfg.border}`,
                                  color: cfg.color, fontSize: 11.5, fontWeight: 500,
                                  "--badge-glow": cfg.glow,
                                } as React.CSSProperties}>
                                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot }} />
                                  {job.status}
                                </span>
                              </div>
                              {/* Actions */}
                              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                                <button className="nb act-btn" onClick={() => openEdit(job)}
                                  style={{ color: txM, padding: 6, borderRadius: 7, display: "flex" }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = gold; (e.currentTarget as HTMLElement).style.background = goldM; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = txM; (e.currentTarget as HTMLElement).style.background = "none"; }}>
                                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <path d="M9.5 2l1.5 1.5-7 7H2.5V9L9.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </button>
                                <button className="nb act-btn" onClick={() => handleDelete(job.id)} disabled={deleteId === job.id}
                                  style={{ color: txM, padding: 6, borderRadius: 7, display: "flex", opacity: deleteId === job.id ? 0.5 : 1 }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ef4444"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = txM; (e.currentTarget as HTMLElement).style.background = "none"; }}>
                                  {deleteId === job.id
                                    ? <LoadSpinner color="#ef4444" size={13} />
                                    : <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                        <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M5.5 6v3M7.5 6v3M3 3.5l.5 7.5h6L10 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                  }
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── Mobile cards ── */}
                    <div className="mob-view" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {filtered.map((job, i) => {
                        const cfg = STATUS[job.status];
                        return (
                          <div key={job.id} className="s-up" style={{
                            background: bgCard, border: `1px solid ${brd}`,
                            borderRadius: 16, padding: 16,
                            animationDelay: `${i * 40}ms`,
                          }}>
                            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                              <Avatar name={job.company} size={38} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                                  <p style={{ fontSize: 13.5, fontWeight: 500, color: tx, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.company}</p>
                                  <span style={{
                                    display: "inline-flex", alignItems: "center", gap: 5,
                                    padding: "3px 9px", borderRadius: 100, flexShrink: 0,
                                    background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: 11, fontWeight: 500,
                                  }}>
                                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: cfg.dot }} />
                                    {job.status}
                                  </span>
                                </div>
                                <p style={{ fontSize: 12.5, color: txM, marginBottom: 10 }}>{job.role}</p>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <p style={{ fontSize: 11.5, color: txF }}>{job.location || "—"}</p>
                                  <div style={{ display: "flex", gap: 4 }}>
                                    <button className="nb act-btn" onClick={() => openEdit(job)} style={{ color: txM, padding: 5, borderRadius: 6, display: "flex" }}
                                      onMouseEnter={e => (e.currentTarget.style.color = gold)}
                                      onMouseLeave={e => (e.currentTarget.style.color = txM)}>
                                      <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                                        <path d="M9.5 2l1.5 1.5-7 7H2.5V9L9.5 2z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </button>
                                    <button className="nb act-btn" onClick={() => handleDelete(job.id)} style={{ color: txM, padding: 5, borderRadius: 6, display: "flex" }}
                                      onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                                      onMouseLeave={e => (e.currentTarget.style.color = txM)}>
                                      <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                                        <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M5.5 6v3M7.5 6v3M3 3.5l.5 7.5h6L10 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </main>
          </div>
        </div>

        {/* ════════════════ MODAL ════════════════ */}
        {showModal && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 16 }}>
            <style>{`@media(min-width:640px){.modal-pos{align-items:center!important;}}`}</style>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
              onClick={() => { resetForm(); setShowModal(false); }} />

            <div className="s-up" style={{
              position: "relative", width: "100%", maxWidth: 430,
              background: dark ? "#131110" : "#fff",
              border: `1px solid ${brd}`,
              borderRadius: 20, overflow: "hidden",
              boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px ${goldB}`,
            }}>
              {/* Gold top accent */}
              <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />

              {/* Modal header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: `1px solid ${brdSub}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 9,
                    background: goldM, border: `1px solid ${goldB}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {editJob
                      ? <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9.5 2l1.5 1.5-7 7H2.5V9L9.5 2z" stroke={gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke={gold} strokeWidth="1.8" strokeLinecap="round"/></svg>
                    }
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: tx }}>{editJob ? "Edit Application" : "New Application"}</p>
                    <p style={{ fontSize: 11.5, color: txM }}>{editJob ? `Editing — ${editJob.company}` : "Track a new opportunity"}</p>
                  </div>
                </div>
                <button className="nb act-btn" onClick={() => { resetForm(); setShowModal(false); }}
                  style={{ color: txM, padding: 6, borderRadius: 8, display: "flex" }}
                  onMouseEnter={e => (e.currentTarget.style.color = tx)}
                  onMouseLeave={e => (e.currentTarget.style.color = txM)}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M3 3l9 9M12 3l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Modal body */}
              <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Company", val: company, set: setCompany, ph: "e.g. Stripe, Vercel, Linear" },
                  { label: "Role",    val: role,    set: setRole,    ph: "e.g. Senior Frontend Engineer" },
                  { label: "Location",val: location, set: setLocation, ph: "e.g. Remote, New York" },
                ].map(({ label, val, set, ph }) => (
                  <div key={label}>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: txM, marginBottom: 7 }}>
                      {label}
                    </label>
                    <input type="text" value={val} placeholder={ph} onChange={e => set(e.target.value)} style={inputSt} />
                  </div>
                ))}

                {/* Status grid */}
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: txM, marginBottom: 8 }}>Status</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {(["Applied", "Interview", "Offer", "Rejected"] as const).map(s => {
                      const cfg = STATUS[s];
                      const active = status === s;
                      return (
                        <button key={s} className="nb spl-btn"
                          onClick={() => setStatus(s)}
                          style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "10px 13px",
                            borderRadius: 11, textAlign: "left",
                            background: active ? cfg.bg : inBg,
                            border: `1px solid ${active ? cfg.border : brd}`,
                            color: active ? cfg.color : txM,
                            fontSize: 12.5, fontWeight: active ? 600 : 400,
                          }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: active ? cfg.dot : txF, flexShrink: 0, boxShadow: active ? `0 0 6px ${cfg.dot}` : "none" }} />
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div style={{ display: "flex", gap: 10, padding: "0 24px 24px" }}>
                <button className="nb" onClick={() => { resetForm(); setShowModal(false); }}
                  style={{ flex: 1, padding: "12px", borderRadius: 11, background: inBg, border: `1px solid ${brd}`, color: txM, fontSize: 13, cursor: "pointer" }}>
                  Cancel
                </button>
                <button className="nb btn-g" onClick={handleSave}
                  disabled={addLoading || !company.trim() || !role.trim()}
                  style={{
                    flex: 1, padding: "12px", borderRadius: 11,
                    background: `linear-gradient(135deg, ${gold}, ${dark ? "#a07820" : "#7a5a10"})`,
                    color: "#0c0b0a", fontSize: 13, fontWeight: 600,
                    opacity: addLoading || !company.trim() || !role.trim() ? 0.45 : 1,
                    cursor: addLoading || !company.trim() || !role.trim() ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: `0 4px 16px ${goldM}`,
                    letterSpacing: "0.02em",
                  }}>
                  {addLoading ? <><LoadSpinner color="#0c0b0a" size={14} /> Saving…</> : editJob ? "Save Changes" : "Add Application"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}