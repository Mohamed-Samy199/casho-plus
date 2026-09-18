export const DEBT_DIRECTIONS = {
  OWED_BY_ME: "owed_by_me", // ديون عليا
  OWED_TO_ME: "owed_to_me", // ديون ليا
};

export const DEBT_DIRECTION_LABELS = {
  [DEBT_DIRECTIONS.OWED_BY_ME]: "ديون عليا",
  [DEBT_DIRECTIONS.OWED_TO_ME]: "ديون ليا",
};

export const DEBT_DIRECTION_OPTIONS = Object.entries(DEBT_DIRECTION_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const DEBT_STATUSES = {
  OPEN: "open",
  SETTLED: "settled",
};

export const DEBT_STATUS_LABELS = {
  [DEBT_STATUSES.OPEN]: "قائم",
  [DEBT_STATUSES.SETTLED]: "مسدد",
};