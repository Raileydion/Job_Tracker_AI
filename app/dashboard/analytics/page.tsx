"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";
import { LoadSpinner } from "@/components/shared/UI";

type StatData = {
  total: number;
  applied: number;
  interviews: number;
  offers: number;
  rejected: number;
};

type Job = {
  id: string;
  company: string;
  role: string;
  status: string;
  location?: string;
  created_at?: string;
};

function ArcMeter({ pct, color, size = 64 }: { pct: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct / 100, 1);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}18`} strokeWidth="5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)", transition: "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)" }}
      />
      <text x={size/2} y={size/2 + 4} textAnchor="middle"
        fill={color} fontSize="11" fontWeight="600" fontFamily="'Outfit', sans-serif">
        {pct}%
      </text>
    </svg>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<StatData>({ total: 0, applied: 0, interviews: 0, offers: 0, rejected: 0 });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const gold   = "#c9a84c";
  const goldM  = "rgba(201,168,76,0.11)";
  const goldB  = "rgba(201,168,76,0.27)";
  const bgCard = "#141210";
  const brd    = "rgba(255,255,255,0.07)";
  const tx     = "#ede9e2";
  const txM    = "#5a5650";
  const txF    = "#2e2c2a";

  useEffect(() => {
    const load = async () => {
      const { data: sd } = await supabase.auth.getSession();
      if (!sd.session) { router.push("/login"); return; }
      setUserEmail(sd.session.user.email || "");
      const { data } = await supabase.from("jobs").select("*").eq("user_id", sd.session.user.id).order("created_at", { ascending: false });
      if (!data) { setLoading(false); return; }
      setJobs(data);
      setStats({
        total:      data.length,
        applied:    data.filter(j => j.status === "Applied").length,
        interviews: data.filter(j => j.status === "Interview").length,
        offers:     data.filter(j => j.status === "Offer").length,
        rejected:   data.filter(j => j.status === "Rejected").length,
      });
      setLoading(false);
    };
    load();
  }, [router]);

  const responseRate = stats.total > 0 ? Math.round(((stats.interviews + stats.offers) / stats.total) * 100) : 0;
  const offerRate    = stats.total > 0 ? Math.round((stats.offers / stats.total) * 100) : 0;
  const activeRate   = stats.total > 0 ? Math.round(((stats.total - stats.rejected) / stats.total) * 100) : 0;

  const STAT_CARDS = [
    { label: "Applied",   value: stats.applied,    color: "#a78bfa", dot: "#7c3aed", sub: "pending review"    },
    { label: "Interview", value: stats.interviews,  color: "#fbbf24", dot: "#d97706", sub: "scheduled"         },
    { label: "Offers",    value: stats.offers,      color: "#34d399", dot: "#059669", sub: "received"          },
    { label: "Rejected",  value: stats.rejected,    color: "#6b7280", dot: "#374151", sub: "keep going"        },
  ];

  const RATE_CARDS = [
    { label: "Response Rate",   pct: responseRate, color: "#a78bfa", desc: "Applications that received a reply" },
    { label: "Offer Rate",      pct: offerRate,    color: "#34d399", desc: "Applications converted to offers" },
    { label: "Active Pipeline", pct: activeRate,   color: gold,      desc: "Applications still in progress" },
  ];

  const FUNNEL = [
    { label: "Applied",   count: stats.total,     color: "#7c3aed", glow: "rgba(124,58,237,0.35)"  },
    { label: "Interview", count: stats.interviews, color: "#d97706", glow: "rgba(217,119,6,0.35)"   },
    { label: "Offer",     count: stats.offers,     color: "#059669", glow: "rgba(5,150,105,0.35)"   },
  ];

  const theme = dark 
    ? {
        bg: "#0c0b0a",
        bgS: "#0f0e0d",
        bgCard: "#141210",
        bgGlass: "rgba(20,18,16,0.85)",
        brd: "rgba(255,255,255,0.07)",
        brdSub: "rgba(255,255,255,0.04)",
        tx: "#ede9e2",
        txM: "#5a5650",
        txF: "#2e2c2a",
        gold: "#c9a84c",
        goldM: "rgba(201,168,76,0.12)",
        goldB: "rgba(201,168,76,0.28)",
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

  if (!mounted || loading) return (
    <div style={{ minHeight: "100vh", background: bgCard, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap'); @keyframes dashSpin{to{transform:rotate(360deg);}}`}</style>
      <LoadSpinner color={gold} size={24} />
      <span style={{ color: txM, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>Loading analytics</span>
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
        .ch{transition:border-color 0.2s,box-shadow 0.2s,transform 0.2s;}
        .ch:hover{border-color:${theme.goldB}!important;transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.3)!important;}
        @keyframes sup{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes barIn{from{width:0;}to{width:var(--tw);}}
        .sup{animation:sup 0.38s cubic-bezier(0.16,1,0.3,1) both;}
        .bar{animation:barIn 0.9s cubic-bezier(0.16,1,0.3,1) both;}
        @media(max-width:860px){.sg4{grid-template-columns:repeat(2,1fr)!important;}}
        @media(max-width:720px){.sg2{grid-template-columns:1fr!important;}}
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
            title="Analytics"
            setSidebarOpen={setSidebarOpen}
            dark={dark}
            setDark={setDark}
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
              <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: theme.txM, marginBottom: 8 }}>Overview</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: theme.tx, letterSpacing: "0.01em", marginBottom: 6 }}>
                Analytics
              </h1>
              <p style={{ color: theme.txM, fontSize: 13, fontWeight: 300 }}>
                {stats.total} total application{stats.total !== 1 ? "s" : ""} tracked across your search.
              </p>
            </div>

            {/* ── STAT CARDS ── */}
            <div className="sg4" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(4,1fr)" }}>
              {STAT_CARDS.map((s, i) => (
                <div key={s.label} className="s-up ch" style={{
                  background: theme.bgCard, border: `1px solid ${theme.brd}`, borderRadius: 16,
                  padding: "20px 20px 16px", animationDelay: `${i * 55}ms`,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 16, right: 16, height: "2px", background: s.dot, borderRadius: "0 0 2px 2px", opacity: 0.55 }} />
                  <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.13em", color: theme.txM, marginBottom: 16 }}>{s.label}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 400, color: s.color, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: 14 }}>
                    {s.value}
                  </p>
                  <div style={{ height: "3px", background: `${s.dot}1a`, borderRadius: 3, marginBottom: 8, overflow: "hidden" }}>
                    <div className="bar" style={{
                      height: "100%", background: s.dot, borderRadius: 3,
                      width: stats.total > 0 ? `${(s.value / stats.total) * 100}%` : "0%",
                      "--tw": stats.total > 0 ? `${(s.value / stats.total) * 100}%` : "0%",
                      animationDelay: `${i * 55 + 250}ms`,
                    } as React.CSSProperties} />
                  </div>
                  <p style={{ fontSize: 11, color: theme.txF }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* ── FUNNEL + RATES ── */}
            <div className="sg2" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>

              {/* Funnel */}
              <div className="s-up ch" style={{ background: theme.bgCard, border: `1px solid ${theme.brd}`, borderRadius: 16, padding: "24px 24px 22px", animationDelay: "240ms" }}>
                <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.13em", color: theme.txM, marginBottom: 22 }}>Conversion Funnel</p>
                {stats.total === 0 ? (
                  <p style={{ textAlign: "center", padding: "28px 0", color: theme.txF, fontSize: 13 }}>Add applications to see your funnel</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {FUNNEL.map((f, i) => {
                      const pct = (f.count / (stats.total || 1)) * 100;
                      const prev = FUNNEL[i - 1];
                      const conv = i > 0 && prev.count > 0 ? Math.round((f.count / prev.count) * 100) : null;
                      return (
                        <div key={f.label}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.color }} />
                              <span style={{ fontSize: 12.5, color: theme.txM }}>{f.label}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                              {conv !== null && <span style={{ fontSize: 10, color: theme.txF }}>{conv}% from prev</span>}
                              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: f.color }}>{f.count}</span>
                            </div>
                          </div>
                          <div style={{ height: 8, background: `${f.color}14`, borderRadius: 8 }}>
                            <div className="bar" style={{
                              height: "100%", borderRadius: 8, background: f.color,
                              width: `${pct}%`, "--tw": `${pct}%`,
                              boxShadow: `0 0 10px ${f.glow}`,
                              animationDelay: `${i * 80 + 350}ms`,
                            } as React.CSSProperties} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Rate cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {RATE_CARDS.map((r, i) => (
                  <div key={r.label} className="s-up ch" style={{
                    background: theme.bgCard, border: `1px solid ${theme.brd}`, borderRadius: 14,
                    padding: "16px 20px", animationDelay: `${i * 70 + 240}ms`,
                    display: "flex", alignItems: "center", gap: 18, flex: 1,
                  }}>
                    <ArcMeter pct={r.pct} color={r.color} size={60} />
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 500, color: theme.tx, marginBottom: 4 }}>{r.label}</p>
                      <p style={{ fontSize: 12, color: theme.txM, fontWeight: 300, lineHeight: 1.5 }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── STATUS BREAKDOWN ── */}
            <div className="s-up ch" style={{ background: theme.bgCard, border: `1px solid ${theme.brd}`, borderRadius: 16, padding: "24px 24px 22px", animationDelay: "400ms" }}>
              <p style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.13em", color: theme.txM, marginBottom: 20 }}>Status Distribution</p>
              {stats.total === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: theme.txM, marginBottom: 6 }}>No data yet</p>
                  <p style={{ color: theme.txF, fontSize: 13 }}>Start adding applications to visualise your pipeline</p>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", height: 14, borderRadius: 14, overflow: "hidden", gap: 2, marginBottom: 18 }}>
                    {[
                      { pct: (stats.applied    / stats.total) * 100, color: "#7c3aed" },
                      { pct: (stats.interviews / stats.total) * 100, color: "#d97706" },
                      { pct: (stats.offers     / stats.total) * 100, color: "#059669" },
                      { pct: (stats.rejected   / stats.total) * 100, color: "#374151" },
                    ].filter(s => s.pct > 0).map((s, i) => (
                      <div key={i} style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 3, boxShadow: `0 0 8px ${s.color}55`, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 24px" }}>
                    {[
                      { label: "Applied",   count: stats.applied,    color: "#7c3aed" },
                      { label: "Interview", count: stats.interviews,  color: "#d97706" },
                      { label: "Offer",     count: stats.offers,      color: "#059669" },
                      { label: "Rejected",  count: stats.rejected,    color: "#374151" },
                    ].map(s => (
                      <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                        <span style={{ fontSize: 12, color: theme.txM }}>{s.label}</span>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: theme.tx }}>{s.count}</span>
                        <span style={{ fontSize: 11, color: theme.txF }}>({Math.round((s.count / stats.total) * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}