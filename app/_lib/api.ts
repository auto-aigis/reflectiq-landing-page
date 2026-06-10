import type {
  User,
  Subscription,
  JournalEntry,
  OnboardingAnswers,
  Debrief,
  DebriefPending,
  MonthlyReport,
  MonthlyReportPending,
  Settings,
  RegenerationCount,
  CheckoutResponse,
  VerifyTransactionResponse,
} from "./types";

const API_URL = "";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((e: any) => e.msg).join(", ");
      else if (err.error) msg = err.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, aiConsent: boolean) =>
    apiFetch<{ status: string; email: string; redirect: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, ai_consent: aiConsent }),
    }),

  login: (email: string, password: string) =>
    apiFetch<{ id: string; email: string; display_name?: string; onboarding_completed: boolean; tier: string } | { redirect: string }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),

  logout: () => apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),

  me: () => apiFetch<User>("/api/auth/me"),

  subscription: () => apiFetch<Subscription>("/api/auth/subscription"),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

export const onboardingApi = {
  get: () => apiFetch<OnboardingAnswers>("/api/onboarding"),

  save: (mainGoal: string, domain: string, typicalBlocker: string) =>
    apiFetch<{ status: string }>("/api/onboarding", {
      method: "POST",
      body: JSON.stringify({ main_goal: mainGoal, domain, typical_blocker: typicalBlocker }),
    }),
};

export const journalApi = {
  list: () => apiFetch<JournalEntry[]>("/api/journal"),

  get: (id: string) => apiFetch<JournalEntry>(`/api/journal/${id}`),

  create: (goalToday: string, blocker: string, win: string, contextNote?: string) =>
    apiFetch<JournalEntry>("/api/journal", {
      method: "POST",
      body: JSON.stringify({ goal_today: goalToday, blocker, win, context_note: contextNote }),
    }),

  delete: (id: string) =>
    apiFetch<{ status: string }>(`/api/journal/${id}`, { method: "DELETE" }),
};

export const debriefApi = {
  latest: () => apiFetch<Debrief | DebriefPending>("/api/debrief/latest"),

  generate: (force: boolean = false) =>
    apiFetch<Debrief | DebriefPending>("/api/debrief/generate", {
      method: "POST",
      body: JSON.stringify({ force }),
    }),

  regenerationCount: () => apiFetch<RegenerationCount>("/api/debrief/regeneration-count"),
};

export const monthlyReportApi = {
  latest: () => apiFetch<MonthlyReport | MonthlyReportPending>("/api/monthly-report/latest"),

  generate: () => apiFetch<MonthlyReport | MonthlyReportPending>("/api/monthly-report/generate", {
    method: "POST",
  }),
};

export const settingsApi = {
  get: () => apiFetch<Settings>("/api/settings"),

  update: (email?: string, displayName?: string) =>
    apiFetch<Settings>("/api/settings", {
      method: "PATCH",
      body: JSON.stringify({ email, display_name: displayName }),
    }),

  billingPortal: () =>
    apiFetch<{ url: string }>("/api/settings/billing-portal"),
};

export const paymentsApi = {
  checkout: (tier: string, billingInterval: string) =>
    apiFetch<CheckoutResponse>("/api/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ tier, billing_interval: billingInterval }),
    }),

  verifyTransaction: (transactionId: string) =>
    apiFetch<VerifyTransactionResponse>("/api/payments/verify-transaction", {
      method: "POST",
      body: JSON.stringify({ transaction_id: transactionId }),
    }),
};

export const exportApi = {
  csv: async (): Promise<Blob> => {
    const res = await fetch(`${API_URL}/api/export/csv`, { credentials: "include" });
    if (!res.ok) throw new Error("Export failed");
    return res.blob();
  },

  pdf: async (): Promise<Blob> => {
    const res = await fetch(`${API_URL}/api/export/pdf`, { credentials: "include" });
    if (!res.ok) throw new Error("Export failed");
    return res.blob();
  },
};