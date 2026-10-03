import { useState } from "react";
import { CalendarDays, ClipboardList, Download, Printer } from "lucide-react";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import Pagination from "../../components/ui/Pagination";
import DailyReconciliationCard from "../../components/reconciliation/DailyReconciliationCard";
import { useDailyReconciliationHistory } from "../../hooks/reconciliation/useDailyReconciliation";
import { formatEGP } from "../../utils/money";
import { downloadCsv, printReport } from "../../utils/reportExport";

const RECONCILIATION_COLUMNS = [
  { label: "اليوم", value: (item) => item.dateKey },
  { label: "العمليات", value: (item) => item.transactionCount || 0 },
  { label: "السيولة المتوقعة", value: (item) => formatEGP(item.expectedLiquidity) },
  { label: "السيولة الفعلية", value: (item) => formatEGP(item.actualLiquidity) },
  { label: "فرق السيولة", value: (item) => formatEGP(item.liquidityVariance) },
  { label: "المحافظ المتوقعة", value: (item) => formatEGP(item.expectedWalletBalance) },
  { label: "المحافظ الفعلية", value: (item) => formatEGP(item.actualWalletBalance) },
  { label: "فرق المحافظ", value: (item) => formatEGP(item.walletVariance) },
  { label: "اعتمد بواسطة", value: (item) => item.closedBy?.name || "-" },
];

export default function DailyReconciliationPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useDailyReconciliationHistory({ page, size: 10 });
  const exportRows = data?.result || [];
  const exportCsv = () => downloadCsv({ filename: `daily-reconciliation-page-${page}.csv`, columns: RECONCILIATION_COLUMNS, rows: exportRows });
  const printPdf = () => printReport({
    title: "تقرير التقفيلات اليومية",
    subtitle: `سجل التقفيلات المعتمدة — الصفحة ${page}`,
    columns: RECONCILIATION_COLUMNS,
    rows: exportRows,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">التقفيل اليومي</h1>
        <p className="mt-1 text-sm text-white/60">اعتماد تقفيل اليوم ومراجعة سجل الأيام السابقة.</p>
      </div>

      <DailyReconciliationCard />

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList size={20} className="text-accent" />
            <div>
              <h2 className="font-bold">سجل التقفيلات السابقة</h2>
              <p className="text-sm text-text-secondary">الأيام المعتمدة فقط، من الأحدث إلى الأقدم.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={exportCsv} disabled={!exportRows.length} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"><Download size={14} /> Excel (CSV)</button>
            <button type="button" onClick={printPdf} disabled={!exportRows.length} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"><Printer size={14} /> PDF / طباعة</button>
          </div>
        </div>

        {isLoading && <div className="flex justify-center py-10"><Spinner /></div>}
        {isError && <p className="py-8 text-center text-danger">تعذر تحميل السجل: {error?.response?.data?.message || error?.message}</p>}

        {data && !data.result?.length && (
          <div className="rounded-xl bg-bg-raised p-8 text-center text-sm text-text-secondary">
            <CalendarDays className="mx-auto mb-2 text-accent" size={24} />
            لا توجد أيام تم تقفيلها حتى الآن.
          </div>
        )}

        {data?.result?.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-sm">
                <thead>
                  <tr className="border-b border-border text-right text-text-secondary">
                    <th className="px-3 py-3 font-medium">اليوم</th>
                    <th className="px-3 py-3 font-medium">العمليات</th>
                    <th className="px-3 py-3 font-medium">السيولة المتوقعة</th>
                    <th className="px-3 py-3 font-medium">السيولة الفعلية</th>
                    <th className="px-3 py-3 font-medium">فرق السيولة</th>
                    <th className="px-3 py-3 font-medium">المحافظ المتوقعة</th>
                    <th className="px-3 py-3 font-medium">المحافظ الفعلية</th>
                    <th className="px-3 py-3 font-medium">فرق المحافظ</th>
                    <th className="px-3 py-3 font-medium">اعتمد بواسطة</th>
                  </tr>
                </thead>
                <tbody>
                  {data.result.map((item) => (
                    <tr key={item._id} className="border-b border-border last:border-0">
                      <td className="px-3 py-3 font-medium">{item.dateKey}</td>
                      <td className="px-3 py-3">{item.transactionCount || 0}</td>
                      <td className="px-3 py-3">{formatEGP(item.expectedLiquidity)}</td>
                      <td className="px-3 py-3">{formatEGP(item.actualLiquidity)}</td>
                      <td className={`px-3 py-3 font-medium ${item.liquidityVariance === 0 ? "text-accent" : "text-danger"}`}>
                        {formatEGP(item.liquidityVariance)}
                      </td>
                      <td className="px-3 py-3">{formatEGP(item.expectedWalletBalance)}</td>
                      <td className="px-3 py-3">{formatEGP(item.actualWalletBalance)}</td>
                      <td className={`px-3 py-3 font-medium ${item.walletVariance === 0 ? "text-accent" : "text-danger"}`}>
                        {formatEGP(item.walletVariance)}
                      </td>
                      <td className="px-3 py-3">{item.closedBy?.name || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5">
              <Pagination
                currentPage={data.currentPage || page}
                pages={data.pages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
