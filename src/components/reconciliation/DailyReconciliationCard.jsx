import { useState } from "react";
import { CheckCircle2, ClipboardCheck, LockKeyhole } from "lucide-react";
import Card from "../ui/Card";
import SubmitButton from "../ui/SubmitButton";
import { useCloseDailyReconciliation, useDailyReconciliation } from "../../hooks/reconciliation/useDailyReconciliation";
import { egpToPiasters, formatEGP, piastersToEGP } from "../../utils/money";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function varianceClass(value) {
  return value === 0 ? "text-accent" : "text-danger";
}

export default function DailyReconciliationCard() {
  const [date] = useState(todayKey);
  const [actualLiquidity, setActualLiquidity] = useState("");
  const [actualWalletBalance, setActualWalletBalance] = useState("");
  const [notes, setNotes] = useState("");
  const { data: report, isLoading, isError, error } = useDailyReconciliation(date);
  const closeMutation = useCloseDailyReconciliation();

  const closeDay = (event) => {
    event.preventDefault();
    closeMutation.mutate({
      date,
      actualLiquidity: egpToPiasters(actualLiquidity),
      actualWalletBalance: egpToPiasters(actualWalletBalance),
      notes,
    });
  };

  if (isLoading) return <Card><p className="text-sm text-text-secondary">جاري تحميل تقفيل اليوم...</p></Card>;
  if (isError) return <Card><p className="text-sm text-danger">تعذر تحميل التقفيل: {error?.response?.data?.message || error?.message}</p></Card>;

  const closed = report?.status === "closed";
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="text-accent" size={20} />
            <h2 className="font-bold">التقفيل اليومي</h2>
          </div>
          <p className="mt-1 text-sm text-text-secondary">اليوم {date} — راجع الرصيد الفعلي قبل اعتماد الإقفال.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${closed ? "bg-accent-soft text-accent" : "bg-amber-100 text-amber-700"}`}>
          {closed ? "تم التقفيل" : "مفتوح"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-bg-raised p-3">
          <p className="text-sm text-text-secondary">عدد العمليات</p>
          <p className="mt-1 text-xl font-bold">{report?.transactionCount || 0}</p>
        </div>
        <div className="rounded-xl bg-bg-raised p-3">
          <p className="text-sm text-text-secondary">التحويلات الداخلية</p>
          <p className="mt-1 text-xl font-bold">{report?.transferCount || 0}</p>
        </div>
        <div className="rounded-xl border border-border p-3">
          <p className="text-sm text-text-secondary">السيولة المتوقعة في النظام</p>
          <p className="mt-1 font-bold">{formatEGP(report?.expectedLiquidity)}</p>
        </div>
        <div className="rounded-xl border border-border p-3">
          <p className="text-sm text-text-secondary">المحافظ المتوقعة في النظام</p>
          <p className="mt-1 font-bold">{formatEGP(report?.expectedWalletBalance)}</p>
        </div>
      </div>

      {closed ? (
        <div className="mt-4 rounded-xl border border-accent/30 bg-accent-soft p-4 text-sm">
          <div className="flex items-center gap-2 font-semibold text-accent"><CheckCircle2 size={18} /> تم اعتماد التقفيل بواسطة {report.closedBy?.name || "الأدمن"}</div>
          <p className="mt-2">فرق السيولة: <span className={varianceClass(report.liquidityVariance)}>{formatEGP(report.liquidityVariance)}</span></p>
          <p>فرق المحافظ: <span className={varianceClass(report.walletVariance)}>{formatEGP(report.walletVariance)}</span></p>
          {report.notes && <p className="mt-2 text-text-secondary">ملاحظة: {report.notes}</p>}
        </div>
      ) : (
        <form onSubmit={closeDay} className="mt-4 space-y-3 border-t border-border pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole size={17} className="text-accent" /> أدخل الرصيد الذي تم عده فعليًا قبل الإقفال</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">السيولة الفعلية (جنيه)<input required min="0" step="0.01" type="number" value={actualLiquidity} onChange={(e) => setActualLiquidity(e.target.value)} placeholder={String(piastersToEGP(report?.expectedLiquidity || 0))} className="mt-1 w-full rounded-lg border border-border bg-bg-raised px-3 py-2" /></label>
            <label className="text-sm">رصيد المحافظ الفعلي (جنيه)<input required min="0" step="0.01" type="number" value={actualWalletBalance} onChange={(e) => setActualWalletBalance(e.target.value)} placeholder={String(piastersToEGP(report?.expectedWalletBalance || 0))} className="mt-1 w-full rounded-lg border border-border bg-bg-raised px-3 py-2" /></label>
          </div>
          <label className="block text-sm">ملاحظات (اختياري)<textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} className="mt-1 min-h-20 w-full rounded-lg border border-border bg-bg-raised px-3 py-2" /></label>
          {closeMutation.isError && <p className="text-sm text-danger">{closeMutation.error?.response?.data?.message || closeMutation.error?.message}</p>}
          <SubmitButton isLoading={closeMutation.isPending}>اعتماد تقفيل اليوم</SubmitButton>
        </form>
      )}
    </Card>
  );
}
