import { useState } from "react";
import { Plus } from "lucide-react";
import { useCapitalSummary } from "../../hooks/capital/useCapitalSummary";
import { useCapitalByPartner } from "../../hooks/capital/useCapitalByPartner";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import OpeningBalanceModal from "../../components/capital/OpeningBalanceModal";
import { useBalanceHistory } from "../../hooks/capital/useBalanceHistory";
import { formatEGP } from "../../utils/money";
import { CHANNEL_LABELS } from "../../constants/channels";

function StatCard({ label, value }) {
  return (
    <Card>
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </Card>
  );
}

export default function CapitalPage() {
  const [isOpeningBalanceOpen, setIsOpeningBalanceOpen] = useState(false);

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
  } = useCapitalSummary();

  const {
    data: byPartner,
    isLoading: isPartnersLoading,
    isError: isPartnersError,
    error: partnersError,
  } = useCapitalByPartner();

  const {
    data: history,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    error: historyError,
  } = useBalanceHistory();

  if (isSummaryLoading || isPartnersLoading || isHistoryLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (
    isSummaryError ||
    isPartnersError ||
    isHistoryError ||
    !summary?.breakdown
  ) {
    const error = summaryError || partnersError || historyError;

    return (
      <Card>
        <h1 className="text-lg font-bold text-danger">
          تعذر تحميل بيانات رأس المال
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          {error?.response?.data?.message ||
            error?.message ||
            "لم تصل استجابة صحيحة من الخادم. تأكد من تشغيل الباك إند وتسجيل الدخول كأدمن."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-white">رأس المال</h1>

        <button
          onClick={() => setIsOpeningBalanceOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
        >
          <Plus size={16} />
          إضافة رصيد
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard
          label="رأس المال الكلي"
          value={formatEGP(summary.totalCapital)}
        />

        <StatCard
          label="السيولة الجاهزة للشغل (النقدية)"
          value={formatEGP(summary.readyLiquidity)}
        />

        <StatCard
          label="خارج السيولة الفعلية"
          value={formatEGP(summary.outsideCapital)}
        />

        <StatCard
          label="رصيد إلكتروني (محافظ)"
          value={formatEGP(summary.breakdown.totalWalletBalance)}
        />

        <StatCard
          label="ديون ليا"
          value={formatEGP(summary.breakdown.owedToMe)}
        />

        <StatCard
          label="ديون عليا"
          value={formatEGP(summary.breakdown.owedByMe)}
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">تفاصيل الشركاء</h2>

        <div className="space-y-4">
          {byPartner?.map((entry) => (
            <Card key={entry.partner._id}>
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">{entry.partner.name}</p>

                <p className="text-sm text-text-secondary">
                  سيولة: {formatEGP(entry.totalLiquidity)} · محفظة:{" "}
                  {formatEGP(entry.totalWalletBalance)}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {entry.lines.map((line) => (
                  <div
                    key={`${line.channel}-${line.phoneNumber}`}
                    className="rounded-lg bg-bg-raised px-3 py-2 text-sm"
                  >
                    <p className="font-medium">{line.phoneNumber}</p>

                    <p className="text-text-secondary">
                      {CHANNEL_LABELS[line.channel]}
                    </p>

                    <p className="mt-1">
                      سيولة: {formatEGP(line.liquidityBalance)} · محفظة:{" "}
                      {formatEGP(line.walletBalance)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">
          سجل تعديلات الأرصدة
        </h2>

        {!history?.length ? (
          <Card>
            <p className="text-sm text-text-secondary">
              لا توجد تعديلات مسجلة بعد.
            </p>
          </Card>
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-right text-text-secondary">
                  <th className="px-4 py-3 font-medium">
                    التاريخ والوقت
                  </th>

                  <th className="px-4 py-3 font-medium">
                    الشريك / الرقم
                  </th>

                  <th className="px-4 py-3 font-medium">
                    النوع
                  </th>

                  <th className="px-4 py-3 font-medium">
                    التغيير
                  </th>

                  <th className="px-4 py-3 font-medium">
                    الرصيد بعد العملية
                  </th>

                  <th className="px-4 py-3 font-medium">
                    بواسطة
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      {new Date(item.createdAt).toLocaleString("ar-EG")}
                    </td>

                    <td className="px-4 py-3">
                      <p>{item.partner?.name || "-"}</p>
                      <p className="text-text-secondary">
                        {item.phoneNumber}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      {item.mode === "opening"
                        ? "إضافة أولية"
                        : "إضافة رصيد"}

                      {item.note && (
                        <p className="text-text-secondary">
                          {item.note}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      سيولة: {formatEGP(item.liquidityAmount)}
                        

                      محفظة: {formatEGP(item.walletAmount)}
                    </td>

                    <td className="px-4 py-3">
                      سيولة: {formatEGP(item.liquidityAfter)}
                        

                      محفظة: {formatEGP(item.walletAfter)}
                    </td>

                    <td className="px-4 py-3">
                      {item.createdBy?.name ||
                        item.createdBy?.email ||
                        "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      <OpeningBalanceModal
        isOpen={isOpeningBalanceOpen}
        onClose={() => setIsOpeningBalanceOpen(false)}
      />
    </div>
  );
}
