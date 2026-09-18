import { useState } from "react";
import { Paperclip } from "lucide-react";
import { formatEGP } from "../../utils/money";
import { DEBT_DIRECTION_LABELS, DEBT_STATUS_LABELS } from "../../constants/debt";
import UploadReceiptModal from "./UploadReceiptModal";

export default function DebtRow({ debt, onRepay }) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const isSettled = debt.status === "settled";

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 text-text-secondary">{DEBT_DIRECTION_LABELS[debt.direction]}</td>
      <td className="px-4 py-3">{debt.description || "—"}</td>
      <td className="px-4 py-3 font-medium">{formatEGP(debt.amount)}</td>
      <td className="px-4 py-3 text-text-secondary">{formatEGP(debt.remainingAmount)}</td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs ${
            isSettled ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"
          }`}
        >
          {DEBT_STATUS_LABELS[debt.status]}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="relative rounded-lg p-1.5 text-text-secondary hover:bg-bg-raised"
            aria-label="رفع/عرض إيصال"
          >
            <Paperclip size={16} />
            {debt.receiptUrls?.length > 0 && (
              <span className="absolute -left-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
            )}
          </button>
          {!isSettled && (
            <button
              onClick={() => onRepay(debt)}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-bg hover:bg-accent-hover"
            >
              سداد
            </button>
          )}
        </div>
      </td>

      <UploadReceiptModal debt={debt} isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </tr>
  );
}