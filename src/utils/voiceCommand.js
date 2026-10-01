import { STAGES } from "../constants/stages";

const SETTINGS_PREFIX = "casho-plus-voice-settings";
const DIGITS = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9", "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };
const NUMBER_WORDS = { صفر: 0, واحد: 1, واحدة: 1, اتنين: 2, اثنين: 2, تلاتة: 3, ثلاثة: 3, اربعة: 4, أربعة: 4, خمسة: 5, ستة: 6, سبعة: 7, تمانية: 8, ثمانية: 8, تسعة: 9, عشرة: 10, عشر: 10, عشرين: 20, تلاتين: 30, ثلاثين: 30, اربعين: 40, أربعين: 40, خمسين: 50, ستين: 60, سبعين: 70, تمانين: 80, ثمانين: 80, تسعين: 90, مية: 100, مئة: 100, مائتين: 200, تلتمية: 300, تلاتمية: 300, اربعمية: 400, خمسمية: 500, ستمية: 600, سبعمية: 700, تمنمية: 800, تسعمية: 900, الف: 1000, ألف: 1000, الاف: 1000, آلاف: 1000, الفين: 2000, ألفين: 2000, الفان: 2000, ألفان: 2000, مليون: 1000000 };
const STAGE_ALIASES = [
  { stage: STAGES.WITHDRAW_LIQUIDITY, aliases: ["سحب خارج سيولة", "سحب سيولة", "سحب السيولة", "اسحب سيولة", "السيولة الاولى", "المرحلة الاولى", "المرحله الاولى", "الأولى", "الاولى", "رقم 1", "رقم واحد", "واحد"] },
  { stage: STAGES.DEPOSIT_LIQUIDITY, aliases: ["إيداع داخل سيولة", "ايداع داخل سيولة", "إيداع سيولة", "ايداع سيولة", "إضافة سيولة", "المرحلة التانية", "المرحله التانية", "التانية", "الثانية", "رقم 2", "رقم اتنين", "اتنين"] },
  { stage: STAGES.WITHDRAW_WALLET_BALANCE, aliases: ["سحب خارج رصيد محفظة", "سحب محفظة", "سحب من المحفظة", "اسحب محفظة", "المرحلة التالتة", "المرحله التالتة", "التالتة", "الثالثة", "رقم 3", "رقم تلاتة", "تلاتة"] },
  { stage: STAGES.DEPOSIT_WALLET_BALANCE, aliases: ["إيداع داخل رصيد محفظة", "ايداع داخل رصيد محفظة", "إيداع محفظة", "ايداع محفظة", "إضافة محفظة", "المرحلة الرابعة", "المرحله الرابعة", "الرابعة", "رقم 4", "رقم اربعة", "اربعة"] },
];

function lookupNumberWord(token) {
  return (
    NUMBER_WORDS[token] ??
    NUMBER_WORDS[token.replace(/ى/g, "ي")] ??
    NUMBER_WORDS[token.replace(/ه$/g, "ة")]
  );
}

export function normalizeArabic(text = "") {
  return text.replace(/[٠-٩۰-۹]/g, (char) => DIGITS[char]).replace(/[إأآ]/g, "ا").replace(/ة/g, "ه").replace(/ي/g, "ى").replace(/\s+/g, " ").trim().toLowerCase();
}

function parseArabicNumber(text) {
  // Speech recognition may return mixed forms such as "3الف" or "2000ونص".
  // Separate digits from Arabic letters before parsing the phrase.
  const normalized = normalizeArabic(text)
    .replace(/[،,]/g, " ")
    .replace(/(\d)(?=\D)|(?<=\D)(\d)/g, "$1$2 ")
    .replace(/\s+/g, " ")
    .trim();
  const numericOnly = normalized.match(/^\d+(?:\.\d+)?$/);
  if (numericOnly) return Number(numericOnly[0]);

  const hasHalf = /(?:^|\s)(?:و\s*)?(?:نص|نصف)(?=\s|$)/.test(normalized);
  const numberText = normalized
    .replace(/(?:^|\s)و(?=\s|$)/g, " ")
    .replace(/(?:^|\s)(?:نص|نصف)(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const tokens = numberText.split(" ");
  let total = 0;
  let current = 0;
  let found = false;
  for (const token of tokens) {
    const numericToken = token.match(/^\d+(?:\.\d+)?$/);
    const value = numericToken
      ? Number(numericToken[0])
      : lookupNumberWord(token);
    if (value === undefined) continue;
    found = true;
    if (value === 1000000 || value === 1000) {
      total += (current || 1) * value;
      current = 0;
    } else if (value >= 100) {
      current = (current || 1) * value;
    } else {
      current += value;
    }
  }
  if (!found) return null;

  const baseAmount = total + current;
  // In Egyptian money speech, "2000 ونص" / "ألفين ونص" means 2500,
  // while a small number such as "اتنين ونص" means 2.5.
  const halfAmount = hasHalf ? (baseAmount >= 1000 ? 500 : 0.5) : 0;
  return baseAmount + halfAmount;
}

export function parseVoiceTransaction(transcript) {
  const normalized = normalizeArabic(transcript);
  const stageMatch = STAGE_ALIASES.find(({ aliases }) => aliases.some((alias) => normalized.includes(normalizeArabic(alias))));
  const stageText = stageMatch?.aliases?.map(normalizeArabic).sort((a, b) => b.length - a.length).find((alias) => normalized.includes(alias));
  const amountText = stageText ? normalized.replace(stageText, " ") : normalized;
  const amount = parseArabicNumber(amountText);
  return {
    transcript,
    normalized,
    stage: stageMatch?.stage || "",
    amount: amount || "",
    missing: [!stageMatch && "نوع العملية", !amount && "المبلغ"].filter(Boolean),
  };
}

export function getVoiceSettings(userId, fallback = {}) {
  if (!userId || typeof window === "undefined") return fallback;
  try {
    return { ...fallback, ...JSON.parse(window.localStorage.getItem(`${SETTINGS_PREFIX}:${userId}`) || "{}") };
  } catch {
    return fallback;
  }
}

export function saveVoiceSettings(userId, settings) {
  if (!userId || typeof window === "undefined") return;
  window.localStorage.setItem(`${SETTINGS_PREFIX}:${userId}`, JSON.stringify(settings));
}

export { STAGE_ALIASES };
