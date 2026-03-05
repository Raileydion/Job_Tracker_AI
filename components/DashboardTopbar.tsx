"use client";

interface DashboardTopbarProps {
  title: string;
  setSidebarOpen: (open: boolean) => void;
  dark: boolean;
  setDark: (dark: boolean) => void;
  onAddClick?: () => void;
  bgGlass: string;
  brdSub: string;
  tx: string;
  txM: string;
  gold: string;
  goldM: string;
}

export default function DashboardTopbar({
  title,
  setSidebarOpen,
  dark,
  setDark,
  onAddClick,
  bgGlass,
  brdSub,
  tx,
  txM,
  gold,
  goldM,
}: DashboardTopbarProps) {
  return (
    <header style={{
      height: 58, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", position: "sticky", top: 0, zIndex: 10,
      background: bgGlass, backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${brdSub}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Hamburger - Only show on mobile/tablet */}
        <button className="nb tog hamburger-menu" onClick={() => setSidebarOpen(true)}
          style={{ padding: "7px 8px", borderRadius: 8, color: txM, display: "flex", transition: "background 0.15s", cursor: "pointer" }}>
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M2 4h13M2 8.5h9M2 13h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <style>{`@media(min-width:1024px){ .hamburger-menu { display: none !important; } }`}</style>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 400, color: tx, letterSpacing: "0.01em" }}>
            {title}
          </h1>
          <span className="sm-show" style={{ color: `rgba(${dark ? '237,233,226' : '28,26,23'},0.4)`, fontSize: 12 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Theme toggle */}
        <button className="nb tog" onClick={() => setDark(!dark)}
          style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${brdSub}`, color: txM, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s", cursor: "pointer" }}>
          {dark
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l-1.41 1.41M4.93 19.07l1.41-1.41" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          }
        </button>

        {/* Add button (optional) */}
        {onAddClick && (
          <button className="nb btn-g" onClick={onAddClick}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 18px", borderRadius: 11,
              background: `linear-gradient(135deg, ${gold}, ${dark ? "#a07820" : "#7a5a10"})`,
              color: "#0c0b0a", fontSize: 13, fontWeight: 600,
              boxShadow: `0 4px 20px ${goldM}`,
              letterSpacing: "0.02em", transition: "opacity 0.15s,transform 0.15s,box-shadow 0.2s", cursor: "pointer",
            }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Add<span className="sm-show"> Application</span></span>
          </button>
        )}
      </div>
    </header>
  );
}
