export const CLIENT_TYPES = {
  INDIVIDUAL: "individual",
  KEY_CLIENT: "key_client",
};

export const CLIENT_TYPE_LABELS = {
  [CLIENT_TYPES.INDIVIDUAL]: "فرد",
  [CLIENT_TYPES.KEY_CLIENT]: "عميل رئيسي",
};

export const CLIENT_TYPE_OPTIONS = Object.entries(CLIENT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));