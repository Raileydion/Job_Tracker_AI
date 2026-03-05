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
    bg: dark ? "#1a1815" : "#f4f2ef",
    bgS: dark ? "#1f1d1a" : "#ede9e4",
    bgCard: dark ? "#28251f" : "#ffffff",
    bgGlass: dark ? "rgba(40,37,31,0.85)" : "rgba(255,255,255,0.85)",
    brd: dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)",
    brdSub: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    tx: dark ? "#f5f1eb" : "#1c1a17",
    txM: dark ? "#8a7f78" : "#a09890",
    txF: dark ? "#5a5550" : "#d4cfc9",
    gold: dark ? "#d4b563" : "#9a7318",
    goldM: dark ? "rgba(212,181,99,0.14)" : "rgba(154,115,24,0.1)",
    goldB: dark ? "rgba(212,181,99,0.32)" : "rgba(154,115,24,0.3)",
    inBg: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    inBgF: dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)",
    rowH: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)",
    glowH: dark ? "0 0 0 1px rgba(212,181,99,0.25)" : "0 0 0 1px rgba(154,115,24,0.2)",
  };
}
