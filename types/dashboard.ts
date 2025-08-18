/** ===== 타입 ===== */
export interface KpiItem {
  label: string;
  value: number | string;
}

export interface ScoreBin {
  score: number;
  count: number;
}
export interface CategoryStat {
  category: string;
  avg: number;
  answers: number;
}
export interface CalendarDay {
  date: string;
  count: number;
}
export interface CalendarBlock {
  month: string;
  days: CalendarDay[];
}
export interface Highlights {
  topStrength: string[];
  topImprovements: string[];
  recentFeedback: string;
}

export interface DashboardRes {
  kpis: KpiItem[];
  scoreHistogram: ScoreBin[];
  categoryStats: CategoryStat[];
  calendar: CalendarBlock;
  highlights: Highlights;
}
