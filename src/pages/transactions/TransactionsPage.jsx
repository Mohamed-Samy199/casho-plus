import { useState } from "react";
import { Download, Mic, Plus, Printer } from "lucide-react";
import { useTransactions } from "../../hooks/transactions/useTransactions";
import NewTransactionModal from "../../components/transactions/NewTransactionModal";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import RecentTransactionsList from "../../components/dashboard/RecentTransactionsList";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";
import VoiceWalkInTransactionModal from "../../components/transactions/VoiceWalkInTransactionModal";
import { formatEGP } from "../../utils/money";
import { CHANNEL_LABELS } from "../../constants/channels";
import { STAGE_LABELS } from "../../constants/stages";
import { downloadCsv, printReport } from "../../utils/reportExport";

const TRANSACTION_COLUMNS = [
  { label: "رقم العملية", value: (item) => item.referenceNumber || "—" },
  { label: "التاريخ والوقت", value: (item) => new Date(item.createdAt).toLocaleString("ar-EG") },
  { label: "المسؤول", value: (item) => item.partner?.name || item.owner?.name || "—" },
  { label: "القناة", value: (item) => CHANNEL_LABELS[item.channel] || item.channel },
  { label: "نوع العملية", value: (item) => STAGE_LABELS[item.stage] || item.stage },
  { label: "المبلغ", value: (item) => formatEGP(item.amount) },
  { label: "العمولة", value: (item) => formatEGP(item.commission || 0) },
];

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [filters, setFilters] = useState({ page: 1, size: 20 });
  const { data, isLoading, isError } = useTransactions(filters);
  const exportRows = data?.result || [];
  const exportCsv = () => downloadCsv({ filename: `transactions-page-${filters.page}.csv`, columns: TRANSACTION_COLUMNS, rows: exportRows });
  const printPdf = () => printReport({
    title: "تقرير العمليات",
    subtitle: `الفلاتر الحالية — الصفحة ${filters.page}`,
    columns: TRANSACTION_COLUMNS,
    rows: exportRows,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">العمليات</h1>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button type="button" onClick={exportCsv} disabled={!exportRows.length} className="inline-flex items-center gap-1 rounded-lg border border-accent px-3 py-2 text-sm font-medium text-accent bg-white hover:bg-accent-soft hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"><Download size={15} /> Excel (CSV)</button>
          <button type="button" onClick={printPdf} disabled={!exportRows.length} className="inline-flex items-center gap-1 rounded-lg border border-accent px-3 py-2 text-sm font-medium text-accent bg-white hover:bg-accent-soft hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"><Printer size={15} /> PDF / طباعة</button>
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-accent bg-white px-4 py-2 text-sm font-medium text-accent hover:bg-accent-soft"
            title="تسجيل عملية لعميل عابر بالصوت"
          >
            <Mic size={16} />
            تسجيل بالصوت
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
          >
            <Plus size={16} />
            عملية جديدة
          </button>
        </div>
      </div>

      <TransactionFilters filters={filters} onChange={setFilters} />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && (
        <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل العمليات.</p>
      )}

      {data && (
        <>
          <RecentTransactionsList transactions={data.result} />
          <Pagination
            currentPage={data.currentPage || 1}
            pages={data.pages}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </>
      )}

      <NewTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <VoiceWalkInTransactionModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
    </div>
  );
}
