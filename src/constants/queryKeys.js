export const QUERY_KEYS = {
  DASHBOARD: ["dashboard"],
  PARTNERS: ["partners"],
  PARTNER: (id) => ["partners", id],
  CLIENTS: (filters) => ["clients", filters],
  CLIENT: (id) => ["clients", id],
  TRANSACTIONS: (filters) => ["transactions", filters],
  DEBTS: (filters) => ["debts", filters],
  DEBT_PAYMENTS: (id) => ["debts", id, "payments"],
  CAPITAL_SUMMARY: ["capital", "summary"],
  CAPITAL_BY_PARTNER: ["capital", "by-partner"],
  COMMISSION_RULES: ["commission-rules"],
};