"use client";

import { useRouter, usePathname } from "next/navigation";

const NAV = [
  { id: "Dashboard", svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="1.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/><rect x="8.5" y="1.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/><rect x="1.5" y="8.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/><rect x="8.5" y="8.5" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { id: "Jobs",      svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="4" width="12" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 4V3A1.5 1.5 0 016.5 1.5h2A1.5 1.5 0 0110 3v1" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 8h12" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { id: "Analytics", svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 12l3.5-5 3 2.5 3.5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 2v11h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  { id: "Settings",  svg: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2.3" stroke="currentColor" strokeWidth="1.4"/><path d="M7.5 1.5v1.3M7.5 12.2v1.3M1.5 7.5h1.3M12.2 7.5h1.3M3.4 3.4l.9.9M10.7 10.7l.9.9M3.4 11.6l.9-.9M10.7 4.3l.9-.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
];

const STATUS = {
  Applied:   { dot: "#7c3aed" },
  Interview: { dot: "#d97706" },
  Offer:     { dot: "#059669" },
  Rejected:  { dot: "#374151" },
};

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userEmail: string;
  jobs: Array<{ id: string; status: string }>;
  dark: boolean;
  gold: string;
  goldM: string;
  goldB: string;
  bgS: string;
  brd: string;
  brdSub: string;
  tx: string;
  txM: string;
  txF: string;
  onLogout: () => void;
}

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
  userEmail,
  jobs,
  dark,
  gold,
  goldM,
  goldB,
  bgS,
  brd,
  brdSub,
  tx,
  txM,
  txF,
  onLogout,
}: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const initials = userEmail.split("@")[0].slice(0, 2).toUpperCase();

  return (
    <>
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

      <aside style={{
        width: 0, flexShrink: 0,
        position: "relative",
        zIndex: 30,
      }} className="sidebar-aside">
        <div className="sidebar-el-inner" style={{ display: "flex", flexDirection: "column" }}>

          {/* Gold accent line */}
          <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 2, borderRadius: 2, background: `linear-gradient(to bottom, ${gold}60, transparent)` }} />

          {/* Logo */}
          <div style={{ padding: "22px 20px 18px", borderBottom: `1px solid ${brdSub}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: `linear-gradient(135deg, ${gold}, ${dark ? "#8b6914" : "#c9a84c"})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 16px rgba(201,168,76,0.12)`,
              }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2.5 4h10M2.5 7.5h7M2.5 11h4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 500, color: tx, letterSpacing: "0.02em", lineHeight: 1 }}>Aurevia AI</p>
                <p style={{ fontSize: 9, color: txM, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>Career Intelligence</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
            <p style={{ color: txF, fontSize: 9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", padding: "6px 10px 8px" }}>Navigation</p>
            {NAV.map(({ id, svg }) => {
              const route = id.toLowerCase() === "dashboard" ? "/dashboard" : `/dashboard/${id.toLowerCase()}`;
              const active = pathname === route;
              return (
                <button key={id} className="nb nav-item"
                  onClick={() => { router.push(route); setSidebarOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                    borderRadius: 10, color: active ? gold : tx,
                    background: active ? `rgba(201,168,76,0.12)` : "transparent",
                    border: `1px solid ${active ? `rgba(201,168,76,0.28)` : "transparent"}`,
                    fontSize: 13.5, fontWeight: active ? 500 : 400, textAlign: "left",
                    position: "relative", transition: "background 0.15s,color 0.15s,border-color 0.15s", cursor: "pointer",
                  }}>
                  <span style={{ opacity: active ? 1 : 0.8 }}>{svg}</span>
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
                      <span style={{ color: count > 0 ? cfg.dot : txF, fontSize: 11, fontWeight: 500, fontFamily: "monospace" }}>
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
              <button className="nb act-btn" onClick={onLogout} style={{ color: txM, padding: 4, borderRadius: 6, flexShrink: 0, transition: "color 0.15s,transform 0.1s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={e => (e.currentTarget.style.color = txM)}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M5 2H2.5A1.5 1.5 0 001 3.5v6A1.5 1.5 0 002.5 11H5M9 9.5L12 6.5 9 3.5M12 6.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
