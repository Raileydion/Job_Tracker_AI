export type Job = {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  location?: string;
  job_description?: string;
  created_at?: string;
  user_id?: string;
};

export type Status = "Applied" | "Interview" | "Offer" | "Rejected";

export type ThemeColors = {
  bg: string;
  bgS: string;
  bgCard: string;
  bgGlass: string;
  brd: string;
  brdSub: string;
  tx: string;
  txM: string;
  txF: string;
  gold: string;
  goldM: string;
  goldB: string;
  inBg?: string;
  inBgF?: string;
};
