"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Job = {
  id: string;
  company: string;
  role: string;
  status: string;
  location?: string;
  created_at?: string;
};

const STATUS_CFG: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  Applied:   { color: "#a78bfa", bg: "rgba(167,139,250,0.1)",  border: "rgba(167,139,250,0.25)", dot: "#7c3aed" },
  Interview: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",   border: "rgba(251,191,36,0.25)",  dot: "#d97706" },
  Offer:     { color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.25)",  dot: "#059669" },
  Rejected:  { color: "#6b7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.2)",  dot: "#374151" },
};

const CC: Record<number, string> = { 0:"#f87171",1:"#fb923c",2:"#fbbf24",3:"#a3e635",4:"#34d399",5:"#22d3ee",6:"#818cf8",7:"#e879f9" };
function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const col = CC[(name.toLowerCase().charCodeAt(0) || 0) % 8];
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, flexShrink: 0, background: `${col}14`, border: `1.5px solid ${col}38`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 600, color: col, fontFamily: "'Outfit', sans-serif" }}>
      {name[0]?.toUpperCase() || "?"}
    </div>
  );
}

function Spinner({ color = "#c9a84c", size = 20 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ animation: "trackrSpin 0.8s linear infinite" }}>
      <circle cx="10" cy="10" r="7" stroke={`${color}28`} strokeWidth="2.5" />
      <path d="M10 3a7 7 0 017 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "company" | "status">("date");

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

  useEffect(() => {
    const load = async () => {
      const { data: sd } = await supabase.auth.getSession();
      if (!sd.session) { router.push("/login"); return; }
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
      if (sortBy === "status")  return a.status.localeCompare(b.status);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

  if (loading) return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@keyframes trackrSpin{to{transform:rotate(360deg);}}`}</style>
      <Spinner color={gold} size={22} />
      <span style={{ color: txM, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>Loading applications</span>
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
        .rh{transition:background 0.12s,border-color 0.15s;}
        .rh:hover{background:rgba(201,168,76,0.04)!important;border-color:${goldB}!important;}
        .chip{transition:background 0.15s,color 0.15s,border-color 0.15s;cursor:pointer;}
        .sb{transition:background 0.15s,color 0.15s;cursor:pointer;}
        .sb:hover{background:${inBg}!important;color:${tx}!important;}
        input{outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
        input::placeholder{color:${txM};}
        input:focus{border-color:${goldB}!important;box-shadow:0 0 0 3px ${goldM}!important;}
        @media(min-width:700px){.dv{display:block!important;}.mv{display:none!important;}}
      `}</style>

      <div style={{ padding: "32px 28px 64px", display: "flex", flexDirection: "column", gap: 24, fontFamily: "'Outfit', sans-serif", color: tx }}>

        {/* Header */}
        <div className="sup">
          <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: txM, marginBottom: 8 }}>Browse</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 400, color: tx, letterSpacing: "0.01em", marginBottom: 6 }}>
            All Applications
          </h1>
          <p style={{ color: txM, fontSize: 13, fontWeight: 300 }}>
            {jobs.length} application{jobs.length !== 1 ? "s" : ""} in your pipeline.
          </p>
        </div>

        {/* ── CONTROLS ── */}
        <div className="sup" style={{ animationDelay: "60ms", display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 200, maxWidth: 340 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: txM, pointerEvents: "none" }}>
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search company, role, location…"
              style={{ width: "100%", padding: "10px 14px 10px 36px", background: bgCard, border: `1px solid ${brd}`, borderRadius: 11, color: tx, fontSize: 13, fontFamily: "'Outfit', sans-serif" }}
            />
          </div>

          {/* Status filter chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", "Applied", "Interview", "Offer", "Rejected"].map(s => {
              const active = filterStatus === s;
              const cfg = s !== "All" ? STATUS_CFG[s] : null;
              return (
                <button key={s} className="chip"
                  onClick={() => setFilterStatus(s)}
                  style={{ padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: active ? 500 : 400, background: active ? (cfg ? cfg.bg : goldM) : "transparent", border: `1px solid ${active ? (cfg ? cfg.border : goldB) : brd}`, color: active ? (cfg ? cfg.color : gold) : txM, fontFamily: "'Outfit', sans-serif" }}>
                  {s}
                  {s !== "All" && <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.75 }}>{jobs.filter(j => j.status === s).length}</span>}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div style={{ display: "flex", gap: 4, marginLeft: "auto", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: txF, marginRight: 4 }}>Sort:</span>
            {(["date", "company", "status"] as const).map(s => (
              <button key={s} className="sb"
                onClick={() => setSortBy(s)}
                style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: sortBy === s ? goldM : "transparent", color: sortBy === s ? gold : txM, fontSize: 12, fontFamily: "'Outfit', sans-serif", textTransform: "capitalize" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── LIST ── */}
        {filtered.length === 0 ? (
          <div className="sup" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 24px", border: `1px dashed ${brd}`, borderRadius: 20, background: bgCard, textAlign: "center", animationDelay: "120ms" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, marginBottom: 20, background: goldM, border: `1px solid ${goldB}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔍</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: tx, marginBottom: 8 }}>
              {search || filterStatus !== "All" ? "No results found" : "No applications yet"}
            </p>
            <p style={{ color: txM, fontSize: 13, fontWeight: 300 }}>
              {search ? `No matches for "${search}"` : filterStatus !== "All" ? `No ${filterStatus} applications` : "Add applications from the dashboard"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="dv" style={{ display: "none" }}>
              <div style={{ background: bgCard, border: `1px solid ${brd}`, borderRadius: 18, overflow: "hidden" }}>
                {/* Head */}
                <div style={{ display: "grid", gridTemplateColumns: "2.2fr 2fr 1.2fr 1fr 90px", padding: "11px 20px", gap: 14, borderBottom: `1px solid ${brdSub}`, background: "rgba(255,255,255,0.015)" }}>
                  {["Company", "Role", "Location", "Status", "Added"].map(h => (
                    <p key={h} style={{ fontSize: 9.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: txF }}>{h}</p>
                  ))}
                </div>
                {filtered.map((job, i) => {
                  const cfg = STATUS_CFG[job.status] || STATUS_CFG["Rejected"];
                  return (
                    <div key={job.id} className="sup rh" style={{ display: "grid", gridTemplateColumns: "2.2fr 2fr 1.2fr 1fr 90px", padding: "15px 20px", gap: 14, alignItems: "center", borderBottom: i < filtered.length - 1 ? `1px solid ${brdSub}` : "none", border: "1px solid transparent", animationDelay: `${i * 30}ms` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar name={job.company} size={34} />
                        <p style={{ fontSize: 13.5, fontWeight: 500, color: tx, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.company}</p>
                      </div>
                      <p style={{ fontSize: 13, color: txM, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.role}</p>
                      <p style={{ fontSize: 12.5, color: txF, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.location || "—"}</p>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: 11.5, fontWeight: 500 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.dot }} />
                        {job.status}
                      </span>
                      <p style={{ fontSize: 11, color: txF, fontFamily: "monospace" }}>
                        {job.created_at ? new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile cards */}
            <div className="mv" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((job, i) => {
                const cfg = STATUS_CFG[job.status] || STATUS_CFG["Rejected"];
                return (
                  <div key={job.id} className="sup rh" style={{ background: bgCard, border: `1px solid ${brd}`, borderRadius: 16, padding: 16, animationDelay: `${i * 35}ms` }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <Avatar name={job.company} size={38} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          <p style={{ fontSize: 13.5, fontWeight: 500, color: tx, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.company}</p>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 100, flexShrink: 0, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: 11, fontWeight: 500 }}>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: cfg.dot }} />
                            {job.status}
                          </span>
                        </div>
                        <p style={{ fontSize: 12.5, color: txM, marginBottom: 6 }}>{job.role}</p>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <p style={{ fontSize: 11.5, color: txF }}>{job.location || "—"}</p>
                          <p style={{ fontSize: 11, color: txF, fontFamily: "monospace" }}>
                            {job.created_at ? new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p style={{ fontSize: 11.5, color: txF, textAlign: "right", marginTop: 8 }}>
              Showing {filtered.length} of {jobs.length}
            </p>
          </>
        )}
      </div>
    </>
  );
}