"use client";

export function LoadSpinner({ color = "#c9a84c", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      style={{ animation: "dashSpin 0.75s linear infinite" }}>
      <circle cx="8" cy="8" r="6" stroke={`${color}30`} strokeWidth="2.5" />
      <path d="M8 2a6 6 0 016 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function getCharColor(char: string) {
  const CHAR_COLORS: Record<number, string> = {
    0: "#f87171", 1: "#fb923c", 2: "#fbbf24", 3: "#a3e635",
    4: "#34d399", 5: "#22d3ee", 6: "#818cf8", 7: "#e879f9",
  };
  return CHAR_COLORS[char.toLowerCase().charCodeAt(0) % 8];
}

export function Avatar({ name, size = 38 }: { name: string; size?: number }) {
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
