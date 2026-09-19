import { useState } from "react";
import { Plus, ArrowLeftRight } from "lucide-react";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import { useMyCapital, useMyBalanceHistory } from "../../hooks/capital/useMyCapital";
import MyBalanceAdjustmentModal from "../../components/capital/MyBalanceAdjustmentModal";
import { formatEGP } from "../../utils/money";
import { CHANNEL_LABELS } from "../../constants/channels";

export default function MyCapitalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: capital, isLoading, isError, error } = useMyCapital();
  const { data: history, isLoading: isHistoryLoading } = useMyBalanceHistory();

  if (isLoading || isHistoryLoading) return <div className="flex justify-center py-16"><Spinner /></div>;
  if (isError || !capital) {
    return <Card><h1 className="font-bold text-danger">تعذر تحميل ماليتي</h1><p className="mt-2 text-sm text-text-secondary">{error?.response?.data?.message || error?.message || "تأكد من تشغيل الخادم."}</p></Card>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-white">ماليتي</h1>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg"><Plus size={16} /> إضافة رصيد</button>
          <a href="/transactions" className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-white"><ArrowLeftRight size={16} /> تنفيذ عملية</a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-text-secondary">السيولة الخاصة بي</p><p className="mt-2 text-2xl font-bold">{formatEGP(capital.liquidity)}</p></Card>
        <Card><p className="text-sm text-text-secondary">رصيد محافظي</p><p className="mt-2 text-2xl font-bold">{formatEGP(capital.walletBalance)}</p></Card>
        <Card><p className="text-sm text-text-secondary">إجمالي رصيدي</p><p className="mt-2 text-2xl font-bold">{formatEGP(capital.liquidity + capital.walletBalance)}</p></Card>
      </div>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">المحافظ الخاصة بي</h2>
        {!capital.lines?.length ? <p className="text-sm text-text-secondary">لا توجد محافظ مضافة بعد.</p> : <div className="grid gap-2 sm:grid-cols-2">{capital.lines.map((line) => <div key={`${line.channel}-${line.phoneNumber}`} className="rounded-lg bg-bg-raised p-3 text-sm"><p className="font-medium">{line.phoneNumber}</p><p className="text-text-secondary">{CHANNEL_LABELS[line.channel]}</p><p className="mt-1">سيولة: {formatEGP(line.liquidityBalance)} · محفظة: {formatEGP(line.walletBalance)}</p></div>)}</div>}
      </Card>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">سجل إضافات رصيدي</h2>
        {!history?.length ? <p className="text-sm text-text-secondary">لا توجد إضافات مسجلة بعد.</p> : <div className="space-y-2">{history.map((item) => <div key={item._id} className="rounded-lg bg-bg-raised p-3 text-sm"><div className="flex justify-between gap-2"><span>{item.mode === "opening" ? "إضافة أولية" : "إضافة رصيد"}</span><span className="text-text-secondary">{new Date(item.createdAt).toLocaleString("ar-EG")}</span></div><p>سيولة: {formatEGP(item.liquidityAmount)} · محفظة: {formatEGP(item.walletAmount)}</p>{item.note && <p className="text-text-secondary">{item.note}</p>}</div>)}</div>}
      </Card>

      <MyBalanceAdjustmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}