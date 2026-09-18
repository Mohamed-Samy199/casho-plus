// فودافون كاش بس دلوقتي — باقي الوسائل هتتضاف هنا لما تفاصيلها توصل
export const CHANNELS = {
  VODAFONE_CASH: "vodafone_cash",
  // INSTAPAY: "instapay",
  // WALLET: "wallet",
};

export const CHANNEL_LABELS = {
  [CHANNELS.VODAFONE_CASH]: "فودافون كاش",
};

export const CHANNEL_OPTIONS = Object.entries(CHANNEL_LABELS).map(([value, label]) => ({
  value,
  label,
}));