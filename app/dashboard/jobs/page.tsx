"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";
import { LoadSpinner, Avatar } from "@/components/shared/UI";
import { STATUS } from "@/lib/theme";

type Job = {
  id: string;
  company: string;
  role: string;
  status: string;
  location?: string;
  job_description?: string;
  created_at?: string;
};

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "company">("date");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  useEffect(() => { setMounted(true); }, []);

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
  const goldB  = dark ? "rgba(212,181,99,0.32)" : "rgba(154,115,24,0.3)";
  const bgCard = dark ? "#28251f" : "#ffffff";
  const brd    = dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)";
  const brdSub = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const tx     = dark ? "#f5f1eb" : "#1c1a17";
  const txM    = dark ? "#8a7f78" : "#a09890";
  const txF    = dark ? "#5a5550" : "#d4cfc9";
  const inBg   = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

  useEffect(() => {
    const load = async () => {
      const { data: sd } = await supabase.auth.getSession();
      if (!sd.session) { router.push("/login"); return; }
      setUserEmail(sd.session.user.email || "");
      const { data } = await supabase.from("jobs").select("*").eq("user_id", sd.session.user.id).order("created_at", { ascending: false });
      if (data) setJobs(data);
      setLoading(false);
    };
    load();
  }, [router]);

  const filtered = jobs
    .filter(j => filterStatus === "All" || j.status === filterStatus)
    .filter(j => {
      const q = search.toLowerCase();
      return !q || j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q) || (j.location || "").toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

  const toggleExpanded = (jobId: string) => {
    const newExpanded = new Set(expandedJobs);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedJobs(newExpanded);
  };

  if (!mounted || loading) return (
    <div style={{ minHeight: "100vh", background: bgCard, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap'); @keyframes dashSpin{to{transform:rotate(360deg);}}`}</style>
      <LoadSpinner color={gold} size={24} />
      <span style={{ color: txM, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>Loading applications</span>
    </div>
  );

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
        inBg: "rgba(255,255,255,0.06)",
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
        inBg: "rgba(0,0,0,0.04)",
      };

  const { bg, bgS, bgGlass } = theme;

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
        .card-hover{transition:border-color 0.2s,box-shadow 0.2s,transform 0.2s;}
        .card-hover:hover{border-color:${theme.goldB}!important;box-shadow:0 0 0 1px ${theme.goldB}!important;transform:translateY(-2px);}
        .row-hover{transition:background 0.15s;}
        .row-hover:hover{background:${dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)"}!important;}
        .chip{transition:background 0.15s,color 0.15s,border-color 0.15s;cursor:pointer;}
        .sb{transition:background 0.15s,color 0.15s;cursor:pointer;}
        .sb:hover{background:${theme.inBg}!important;color:${theme.tx}!important;}
        .tog{transition:background 0.15s;cursor:pointer;}
        .tog:hover{background:${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}!important;}
        input:focus{border-color:${theme.goldB}!important;box-shadow:0 0 0 3px ${theme.goldM}!important;}
        @media(min-width:700px){.dv{display:block!important;}.mv{display:none!important;}}
        @media(min-width:1024px){.mob-hide{display:flex;}}
        .mob-hide{display:none;}
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
            title="Jobs"
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
              <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: theme.txM, marginBottom: 8 }}>Browse</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: theme.tx, letterSpacing: "0.01em", marginBottom: 6 }}>
                All Applications
              </h1>
              <p style={{ color: theme.txM, fontSize: 13, fontWeight: 300 }}>
                {jobs.length} application{jobs.length !== 1 ? "s" : ""} in your pipeline.
              </p>
            </div>

            {/* Controls */}
            <div className="s-up" style={{ animationDelay: "60ms", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              {/* Search */}
              <div style={{ position: "relative", flex: "1 1 220px", minWidth: 200, maxWidth: 340 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: theme.txM, pointerEvents: "none" }}>
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search company, role, location…"
                  style={{ width: "100%", padding: "10px 14px 10px 36px", background: theme.bgCard, border: `1px solid ${theme.brd}`, borderRadius: 11, color: theme.tx, fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
                />
              </div>

              {/* Status filter chips */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["All", "Applied", "Interview", "Offer", "Rejected"].map(s => {
                  const active = filterStatus === s;
                  const cfg = s !== "All" ? (STATUS as any)[s] : null;
                  return (
                    <button key={s} className="nb chip"
                      onClick={() => setFilterStatus(s)}
                      style={{ padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: active ? 500 : 400, background: active ? (cfg ? cfg.bg : theme.goldM) : "transparent", border: `1px solid ${active ? (cfg ? cfg.border : theme.goldB) : theme.brd}`, color: active ? (cfg ? cfg.color : theme.gold) : theme.txM, fontFamily: "'Outfit', sans-serif" }}>
                      {s}
                      {s !== "All" && <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.75 }}>{jobs.filter(j => j.status === s).length}</span>}
                    </button>
                  );
                })}
              </div>

              {/* Sort */}
              <div style={{ display: "flex", gap: 4, marginLeft: "auto", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: theme.txF, marginRight: 4 }}>Sort:</span>
                {(["date", "company"] as const).map(s => (
                  <button key={s} className="nb sb"
                    onClick={() => setSortBy(s)}
                    style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: sortBy === s ? theme.goldM : "transparent", color: sortBy === s ? theme.gold : theme.txM, fontSize: 12, fontFamily: "'Outfit', sans-serif", textTransform: "capitalize" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* LIST */}
            {filtered.length === 0 ? (
              <div className="s-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 24px", border: `1px dashed ${theme.brd}`, borderRadius: 20, background: theme.bgCard, textAlign: "center", animationDelay: "120ms" }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, marginBottom: 20, background: theme.goldM, border: `1px solid ${theme.goldB}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔍</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: theme.tx, marginBottom: 8 }}>
                  {search || filterStatus !== "All" ? "No results found" : "No applications yet"}
                </p>
                <p style={{ color: theme.txM, fontSize: 13, fontWeight: 300 }}>
                  {search ? `No matches for "${search}"` : filterStatus !== "All" ? `No ${filterStatus} applications` : "Add applications from the dashboard"}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="dv" style={{ display: "none" }}>
                  <div style={{ background: theme.bgCard, border: `1px solid ${theme.brd}`, borderRadius: 18, overflow: "hidden" }}>
                    {/* Head */}
                    <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.5fr 1.8fr 1.2fr 1fr 90px 40px", padding: "11px 20px", gap: 14, borderBottom: `1px solid ${theme.brdSub}`, background: dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.02)" }}>
                      {["Company", "Role", "Job Description", "Location", "Status", "Added", ""].map(h => (
                        <p key={h} style={{ fontSize: 9.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: theme.txF }}>{h}</p>
                      ))}
                    </div>
                    {filtered.map((job, i) => {
                      const cfg = (STATUS as any)[job.status] || (STATUS as any)["Rejected"];
                      const isExpanded = expandedJobs.has(job.id);
                      return (
                        <div key={job.id}>
                          <div className="s-up row-hover" style={{ display: "grid", gridTemplateColumns: "2.2fr 1.5fr 1.8fr 1.2fr 1fr 90px 40px", padding: "15px 20px", gap: 14, alignItems: "center", borderBottom: `1px solid ${theme.brdSub}`, animationDelay: `${i * 30}ms` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <Avatar name={job.company} size={34} />
                              <p style={{ fontSize: 13.5, fontWeight: 500, color: theme.tx, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.company}</p>
                            </div>
                            <p style={{ fontSize: 13, color: theme.txM, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.role}</p>
                            <p style={{ fontSize: 12, color: theme.txF, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{job.job_description ? (job.job_description.length > 70 ? job.job_description.substring(0, 70) + "..." : job.job_description) : "—"}</p>
                            <p style={{ fontSize: 12.5, color: theme.txF, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.location || "—"}</p>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: 11.5, fontWeight: 500 }}>
                              <div style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot }} />
                              {job.status}
                            </span>
                            <p style={{ fontSize: 11, color: theme.txF, fontFamily: "monospace" }}>
                              {job.created_at ? new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                            </p>
                            <button className="nb tog" onClick={() => toggleExpanded(job.id)}
                              style={{ padding: "4px", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: theme.txM, transition: "color 0.2s" }}
                              title={job.job_description ? "View description" : "No description"}>
                              {job.job_description ? (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }}>
                                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              ) : (
                                <span style={{ fontSize: 11, opacity: 0.5 }}>—</span>
                              )}
                            </button>
                          </div>
                          {isExpanded && job.job_description && (
                            <div style={{ padding: "12px 20px 0", borderTop: `1px solid ${theme.brdSub}`, background: "transparent" }}>
                              <div style={{ padding: "12px 14px 12px", background: dark ? "rgba(212,181,99,0.08)" : "rgba(212,181,99,0.05)", borderRadius: 8, border: `1px solid ${dark ? "rgba(212,181,99,0.15)" : "rgba(212,181,99,0.12)"}`, marginBottom: 12 }}>
                                <p style={{ fontSize: 11.5, color: theme.txM, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 200, overflowY: "auto" }}>
                                  {job.job_description}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile cards */}
                <div className="mv" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filtered.map((job, i) => {
                    const cfg = (STATUS as any)[job.status] || (STATUS as any)["Rejected"];
                    const isExpanded = expandedJobs.has(job.id);
                    return (
                      <div key={job.id} className="s-up card-hover" style={{ background: theme.bgCard, border: `1px solid ${theme.brd}`, borderRadius: 16, overflow: "hidden", animationDelay: `${i * 35}ms` }}>
                        <div style={{ padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <Avatar name={job.company} size={38} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 3 }}>
                              <p style={{ fontSize: 13.5, fontWeight: 500, color: theme.tx, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.company}</p>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 100, flexShrink: 0, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: 11, fontWeight: 500 }}>
                                <div style={{ width: 4, height: 4, borderRadius: "50%", background: cfg.dot }} />
                                {job.status}
                              </span>
                            </div>
                            <p style={{ fontSize: 12.5, color: theme.txM, marginBottom: 6 }}>{job.role}</p>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <p style={{ fontSize: 11.5, color: theme.txF }}>{job.location || "—"}</p>
                              <p style={{ fontSize: 11, color: theme.txF, fontFamily: "monospace" }}>
                                {job.created_at ? new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {job.job_description && (
                          <>
                            <div style={{ height: "1px", background: theme.brdSub }} />
                            <button className="nb tog" onClick={() => toggleExpanded(job.id)}
                              style={{ width: "100%", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: theme.txM, background: "transparent", border: "none", fontSize: 12, fontWeight: 500, transition: "color 0.2s" }}>
                              <span>{isExpanded ? "Hide" : "Show"} Description</span>
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            {isExpanded && (
                              <div style={{ padding: "12px 16px 16px", background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)", borderTop: `1px solid ${theme.brdSub}` }}>
                                <p style={{ fontSize: 11.5, color: theme.txM, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 250, overflowY: "auto" }}>
                                  {job.job_description}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p style={{ fontSize: 11.5, color: theme.txF, textAlign: "right", marginTop: 8 }}>
                  Showing {filtered.length} of {jobs.length}
                </p>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}