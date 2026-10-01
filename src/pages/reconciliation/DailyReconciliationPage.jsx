import { useState } from "react";
import { CalendarDays, ClipboardList } from "lucide-react";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import Pagination from "../../components/ui/Pagination";
import DailyReconciliationCard from "../../components/reconciliation/DailyReconciliationCard";
import { useDailyReconciliationHistory } from "../../hooks/reconciliation/useDailyReconciliation";
import { formatEGP } from "../../utils/money";

export default function DailyReconciliationPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useDailyReconciliationHistory({ page, size: 10 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">التقفيل اليومي</h1>
        <p className="mt-1 text-sm text-white/60">اعتماد تقفيل اليوم ومراجعة سجل الأيام السابقة.</p>
      </div>

      <DailyReconciliationCard />

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList size={20} className="text-accent" />
          <div>
            <h2 className="font-bold">سجل التقفيلات السابقة</h2>
            <p className="text-sm text-text-secondary">الأيام المعتمدة فقط، من الأحدث إلى الأقدم.</p>
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
              <table className="w-full min-w-[850px] text-sm">
                <thead>
                  <tr className="border-b border-border text-right text-text-secondary">
                    <th className="px-3 py-3 font-medium">اليوم</th>
                    <th className="px-3 py-3 font-medium">العمليات</th>
                    <th className="px-3 py-3 font-medium">السيولة المتوقعة</th>
                    <th className="px-3 py-3 font-medium">السيولة الفعلية</th>
                    <th className="px-3 py-3 font-medium">فرق السيولة</th>
                    <th className="px-3 py-3 font-medium">المحافظ المتوقعة</th>
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
