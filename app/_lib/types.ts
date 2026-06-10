export interface User {
  id: string;
  email: string;
  display_name?: string;
  onboarding_completed: boolean;
  tier: string;
}

export interface Subscription {
  tier: string;
  status: string;
  current_period_end?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  goal_today: string;
  blocker: string;
  win: string;
  context_note?: string;
  created_at: string;
}

export interface OnboardingAnswers {
  main_goal: string;
  domain: string;
  typical_blocker: string;
  created_at?: string;
}

export interface Debrief {
  id: string;
  generated_at: string;
  goal_summary?: string;
  top_blockers?: string[];
  behavioral_pattern_alert?: string;
  nudges?: string[];
  tier_level_at_generation: string;
  on_demand: boolean;
}

export interface DebriefPending {
  status: "pending";
  entries_needed: number;
}

export interface MonthlyReport {
  id: string;
  report_month: string;
  goal_drift_analysis?: string;
  cross_domain_connections?: string;
  behavioral_score?: number;
  created_at: string;
}

export interface MonthlyReportPending {
  status: "pending";
  message: string;
}

export interface Settings {
  email: string;
  display_name?: string;
  tier: string;
  subscription_status: string;
}

export interface RegenerationCount {
  remaining: number;
  limit: number;
}

export interface CheckoutResponse {
  price_id: string;
  client_token: string;
}

export interface VerifyTransactionResponse {
  status: string;
  tier: string;
}

export type Domain = "work" | "health" | "relationships" | "finances" | "learning";
export type TypicalBlocker = "procrastination" | "perfectionism" | "distraction" | "avoidance" | "other";

export type Tier = "free" | "pro" | "plus";