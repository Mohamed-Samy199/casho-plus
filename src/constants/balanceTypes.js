export const BALANCE_TYPES = {
  LIQUIDITY: "liquidity",
  WALLET_BALANCE: "wallet_balance",
};

export const BALANCE_TYPE_LABELS = {
  [BALANCE_TYPES.LIQUIDITY]: "سيولة",
  [BALANCE_TYPES.WALLET_BALANCE]: "رصيد محفظة",
};

export const BALANCE_TYPE_OPTIONS = Object.entries(BALANCE_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));