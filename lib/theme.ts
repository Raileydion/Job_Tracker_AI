export const STATUS = {
  Applied:   { 
    color: "#a78bfa", 
    bg: "rgba(167,139,250,0.1)",  
    border: "rgba(167,139,250,0.25)", 
    dot: "#7c3aed", 
    glow: "rgba(167,139,250,0.2)" 
  },
  Interview: { 
    color: "#fbbf24", 
    bg: "rgba(251,191,36,0.1)",   
    border: "rgba(251,191,36,0.25)",  
    dot: "#d97706", 
    glow: "rgba(251,191,36,0.2)" 
  },
  Offer:     { 
    color: "#34d399", 
    bg: "rgba(52,211,153,0.1)",   
    border: "rgba(52,211,153,0.25)",  
    dot: "#059669", 
    glow: "rgba(52,211,153,0.2)" 
  },
  Rejected:  { 
    color: "#6b7280", 
    bg: "rgba(107,114,128,0.08)", 
    border: "rgba(107,114,128,0.2)",  
    dot: "#374151", 
    glow: "rgba(107,114,128,0.1)" 
  },
};

export const CHAR_COLORS: Record<number, string> = {
  0: "#f87171", 1: "#fb923c", 2: "#fbbf24", 3: "#a3e635",
  4: "#34d399", 5: "#22d3ee", 6: "#818cf8", 7: "#e879f9",
};

export function getCharColor(char: string) {
  return CHAR_COLORS[char.toLowerCase().charCodeAt(0) % 8];
}

export function getThemeColors(dark: boolean) {
  return {
    bg: dark ? "#0c0b0a" : "#f4f2ef",
    bgS: dark ? "#0f0e0d" : "#ede9e4",
    bgCard: dark ? "#141210" : "#ffffff",
    bgGlass: dark ? "rgba(20,18,16,0.85)" : "rgba(255,255,255,0.85)",
    brd: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    brdSub: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)",
    tx: dark ? "#ede9e2" : "#1c1a17",
    txM: dark ? "#5a5650" : "#a09890",
    txF: dark ? "#2e2c2a" : "#d4cfc9",
    gold: dark ? "#c9a84c" : "#9a7318",
    goldM: dark ? "rgba(201,168,76,0.12)" : "rgba(154,115,24,0.1)",
    goldB: dark ? "rgba(201,168,76,0.28)" : "rgba(154,115,24,0.3)",
    inBg: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
    inBgF: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    rowH: dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)",
    glowH: dark ? "0 0 0 1px rgba(201,168,76,0.2)" : "0 0 0 1px rgba(154,115,24,0.2)",
  };
}
