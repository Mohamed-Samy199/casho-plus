import { useState } from "react";
import { ChevronDown, Paperclip } from "lucide-react";
import { formatEGP } from "../../utils/money";
import { DEBT_DIRECTION_LABELS, DEBT_STATUS_LABELS } from "../../constants/debt";
import { CHANNEL_LABELS } from "../../constants/channels";
import UploadReceiptModal from "./UploadReceiptModal";

export default function DebtRow({ debt, onRepay }) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isSettled = debt.status === "settled";
  const paidAmount = debt.paidAmount ?? Math.max(0, debt.amount - debt.remainingAmount);
  const formatPaymentDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("ar-EG", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "لا توجد دفعات بعد";

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 text-text-secondary">{DEBT_DIRECTION_LABELS[debt.direction]}</td>
      <td className="px-4 py-3">{debt.description || "—"}</td>
      <td className="px-4 py-3 font-medium">{formatEGP(debt.amount)}</td>
      <td className="px-4 py-3 text-text-secondary">{formatEGP(debt.remainingAmount)}</td>
      <td className="px-4 py-3">
        <span className={debt.capitalAffected ? "font-medium text-accent" : "font-medium text-text-secondary"}>
          {debt.capitalAffected ? "نعم" : "لا"}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2.5 py-1 text-sm ${
            isSettled ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"
          }`}
        >
          {DEBT_STATUS_LABELS[debt.status]}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setIsDetailsOpen((open) => !open)}
            className={`flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:bg-bg-raised ${
              isDetailsOpen ? "bg-bg-raised" : ""
            }`}
            aria-expanded={isDetailsOpen}
            aria-label="عرض تفاصيل السداد"
          >
            التفاصيل
            <ChevronDown size={14} className={isDetailsOpen ? "rotate-180" : ""} />
          </button>
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
              className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
            >
              سداد
            </button>
          )}

          {isDetailsOpen && (
            <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-border bg-bg-raised p-3 text-right shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                  <span className="text-text-secondary">المدفوع</span>
                  <span className="font-medium text-accent">{formatEGP(paidAmount)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                  <span className="text-text-secondary">المتبقي</span>
                  <span className="font-medium">{formatEGP(debt.remainingAmount)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                  <span className="text-text-secondary">تاريخ آخر دفعة</span>
                  <span className="text-left text-sm font-medium">{formatPaymentDate(debt.lastPaymentAt)}</span>
                </div>
                <div>
                  <p className="mb-1 text-text-secondary">الحساب المتأثر</p>
                  {debt.affectedAccounts?.length ? (
                    <div className="space-y-1 text-xs">
                      {debt.affectedAccounts.map((account, index) => (
                        <p className="text-sm" key={`${account.phoneNumber}-${index}`}>
                          {account.partnerName || "حساب شريك"} — {account.phoneNumber} — {CHANNEL_LABELS[account.channel] || account.channel}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text-secondary">لا يوجد حساب متأثر</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </td>

      <UploadReceiptModal debt={debt} isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </tr>
  );
}
