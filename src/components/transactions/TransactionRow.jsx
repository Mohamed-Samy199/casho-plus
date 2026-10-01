import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { formatEGP } from "../../utils/money";
import { STAGE_LABELS } from "../../constants/stages";
import { CHANNEL_LABELS } from "../../constants/channels";
import SettleTransactionModal from "./SettleTransactionModal";
import CorrectTransactionModal from "./CorrectTransactionModal";
import { useAuthStore } from "../../store/auth.store";

export default function TransactionRow({ transaction, showDate = false }) {
  const t = transaction;
  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isAdmin = useAuthStore((state) => state.user?.role === "admin");
  const remaining = t.remainingAmount ?? t.amount;
  const canSettle = Boolean(t.agreedDueAt) && remaining > 0;
  const canCorrect = isAdmin && !t.reversalOf && !t.correctionOf && !t.reversedAt;
  const transactionDate = new Date(t.createdAt);
  const now = new Date();
  const isToday =
    transactionDate.getFullYear() === now.getFullYear() &&
    transactionDate.getMonth() === now.getMonth() &&
    transactionDate.getDate() === now.getDate();
  const formattedDate = transactionDate.toLocaleDateString("ar-EG");
  const formattedTime = transactionDate.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const copyReference = async () => {
    if (!t.referenceNumber || !navigator.clipboard) return;
    await navigator.clipboard.writeText(t.referenceNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <tr className="border-b border-border last:border-0">
        <td className="px-4 py-3">
          {t.referenceNumber ? (
            <button
              type="button"
              onClick={copyReference}
              className="inline-flex items-center gap-1 rounded-md bg-bg-raised px-2 py-1 font-mono text-xs text-accent hover:bg-accent-soft"
              title="نسخ رقم العملية"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {t.referenceNumber}
            </button>
          ) : (
            <span className="text-text-secondary">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          <span>{t.partner?.name || t.owner?.name || "—"}</span>
          {t.ownerType === "User" && <span className="mr-2 text-xs text-accent">(أدمن)</span>}
        </td>
        <td className="px-4 py-3 text-text-secondary">{CHANNEL_LABELS[t.channel]}</td>
        <td className="px-4 py-3 text-text-secondary">{STAGE_LABELS[t.stage]}</td>
        <td className="px-4 py-3 font-medium">{formatEGP(t.amount)}</td>
        <td className="px-4 py-3 text-text-secondary">
          {(showDate || !isToday) && `${formattedDate} — `}
          {formattedTime}
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {canSettle && (
              <button
                type="button"
                onClick={() => setIsSettleOpen(true)}
                className="whitespace-nowrap rounded-lg bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent"
              >
                سداد ({formatEGP(remaining)})
              </button>
            )}
            {canCorrect && (
              <button
                type="button"
                onClick={() => setIsCorrectionOpen(true)}
                className="whitespace-nowrap rounded-lg bg-danger-soft px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/20"
              >
                تصحيح العملية
              </button>
            )}
            {t.reversedAt && (
              <span className="whitespace-nowrap rounded-lg bg-bg-raised px-3 py-1.5 text-xs text-text-secondary">
                تم العكس
              </span>
            )}
          </div>
        </td>
      </tr>
      {canSettle && (
        <SettleTransactionModal
          transaction={t}
          isOpen={isSettleOpen}
          onClose={() => setIsSettleOpen(false)}
        />
      )}
      {canCorrect && (
        <CorrectTransactionModal
          transaction={t}
          isOpen={isCorrectionOpen}
          onClose={() => setIsCorrectionOpen(false)}
        />
      )}
    </>
  );
}
