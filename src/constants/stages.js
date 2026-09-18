export const STAGES = {
  WITHDRAW_LIQUIDITY: "withdraw_liquidity",
  DEPOSIT_LIQUIDITY: "deposit_liquidity",
  WITHDRAW_WALLET_BALANCE: "withdraw_wallet_balance",
  DEPOSIT_WALLET_BALANCE: "deposit_wallet_balance",
};

export const STAGE_LABELS = {
  [STAGES.WITHDRAW_LIQUIDITY]: "سحب خارج سيولة",
  [STAGES.DEPOSIT_LIQUIDITY]: "إيداع داخل سيولة",
  [STAGES.WITHDRAW_WALLET_BALANCE]: "سحب خارج رصيد محفظة",
  [STAGES.DEPOSIT_WALLET_BALANCE]: "إيداع داخل رصيد محفظة",
};

export const STAGE_OPTIONS = Object.entries(STAGE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

// المراحل اللي بيزيد فيها رصيد المحفظة وبيقل فيها السيولة (لعرض توضيحي في الواجهة بس，
// المنطق الفعلي محسوب في الباك إند)
export const WALLET_UP_STAGES = [STAGES.WITHDRAW_LIQUIDITY, STAGES.DEPOSIT_WALLET_BALANCE];