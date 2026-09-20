import { useState } from "react";
import { ListTree, Plus, UsersRound } from "lucide-react";
import { useCapitalSummary } from "../../hooks/capital/useCapitalSummary";
import { useCapitalByPartner } from "../../hooks/capital/useCapitalByPartner";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import OpeningBalanceModal from "../../components/capital/OpeningBalanceModal";
import { useBalanceHistory } from "../../hooks/capital/useBalanceHistory";
import { formatEGP } from "../../utils/money";
import { CHANNEL_LABELS } from "../../constants/channels";
import Modal from "../../components/ui/Modal";

const DETAIL_CONFIG = {
  totalCapital: {
    title: "تفاصيل رأس المال الكلي",
    sections: [
      { label: "السيولة الجاهزة للشغل", key: "liquidity", sign: 1 },
      { label: "الرصيد الإلكتروني", key: "walletBalance", sign: 1 },
      { label: "ديون ليا", key: "owedToMe", sign: 1 },
      { label: "ديون عليا (تُخصم)", key: "owedByMe", sign: -1 },
    ],
  },
  readyLiquidity: {
    title: "تفاصيل السيولة الجاهزة للشغل",
    sections: [{ label: "المساهمون في السيولة", key: "liquidity", sign: 1 }],
  },
  usableCapital: {
    title: "تفاصيل الرصيد المتاح للاعتماد في الشغل",
    sections: [
      { label: "السيولة الجاهزة للشغل", key: "liquidity", sign: 1 },
      { label: "الرصيد الإلكتروني", key: "walletBalance", sign: 1 },
    ],
  },
  walletBalance: {
    title: "تفاصيل الرصيد الإلكتروني",
    sections: [{ label: "المساهمون في المحافظ", key: "walletBalance", sign: 1 }],
  },
  owedToMe: {
    title: "تفاصيل ديون ليا",
    sections: [{ label: "الأطراف المدينة لنا", key: "owedToMe", sign: 1 }],
  },
  owedByMe: {
    title: "تفاصيل ديون عليا",
    sections: [{ label: "الأطراف الدائنة علينا", key: "owedByMe", sign: -1 }],
  },
};

function StatCard({ label, value, description, onDetails }) {
  return (
    <Card className="relative cursor-help" title={description}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <button
          onClick={onDetails}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-accent/40 bg-accent-soft px-2.5 py-2 text-xs font-medium text-accent transition hover:border-accent hover:bg-accent hover:text-bg"
          aria-label={`عرض تفاصيل المساهمين في ${label}`}
          title="عرض تفاصيل المساهمين"
        >
          <UsersRound size={16} />
          <span>تفاصيل المساهمين</span>
        </button>
      </div>
    </Card>
  );
}

function CapitalDetailsModal({ detailKey, contributors, onClose }) {
  const config = DETAIL_CONFIG[detailKey];
  if (!config) return null;

  return (
    <Modal title={config.title} isOpen={!!detailKey} onClose={onClose}>
      <div className="space-y-4">
        {config.sections.map((section) => {
          const rows = contributors?.[section.key] || [];
          const total = rows.reduce((sum, row) => sum + row.amount, 0);

          return (
            <section key={section.key} className="rounded-xl border border-border bg-bg-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <ListTree size={18} className="text-accent" />
                <h3 className="font-semibold">{section.label}</h3>
              </div>
              <div className={`mb-3 flex items-center justify-between rounded-lg px-3 py-2.5 ${section.sign < 0 ? "bg-danger-soft" : "bg-accent-soft"}`}>
                <span className="text-sm text-text-secondary">الإجمالي</span>
                <span className={section.sign < 0 ? "font-bold text-danger" : "font-bold text-accent"}>
                  {section.sign < 0 ? "−" : ""}{formatEGP(total)}
                </span>
              </div>
              {!rows.length ? (
                <p className="text-sm text-text-secondary">لا توجد بيانات</p>
              ) : (
                <div className="space-y-2.5">
                  {rows.map((row) => (
                    <div
                      key={`${section.key}-${row.name}`}
                      className="flex min-h-12 items-center justify-between gap-4 rounded-lg border border-border bg-bg-raised px-4 py-3"
                    >
                      <span className="font-medium">{row.name}</span>
                      <span className={section.sign < 0 ? "font-medium text-danger" : "font-medium"}>
                        {section.sign < 0 ? "−" : ""}{formatEGP(row.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </Modal>
  );
}

export default function CapitalPage() {
  const [isOpeningBalanceOpen, setIsOpeningBalanceOpen] = useState(false);
  const [detailsKey, setDetailsKey] = useState(null);

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

  const usableCapital = (summary.readyLiquidity || 0) + (summary.breakdown.totalWalletBalance || 0);

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
          description="رأس المال الكلي = السيولة الجاهزة + الرصيد الإلكتروني + ديون ليا − ديون عليا."
          onDetails={() => setDetailsKey("totalCapital")}
        />

        <StatCard
          label="السيولة والرصيد المتاحين للشغل"
          value={formatEGP(usableCapital)}
          description="هذا الكارت = السيولة الجاهزة للشغل + الرصيد الإلكتروني في المحافظ فقط، بدون احتساب أي ديون."
          onDetails={() => setDetailsKey("usableCapital")}
        />

        <StatCard
          label="ديون ليا"
          value={formatEGP(summary.breakdown.owedToMe)}
          description="ديون ليا = مجموع المبالغ المتبقية في الديون المفتوحة التي لنا عند الآخرين."
          onDetails={() => setDetailsKey("owedToMe")}
        />

        <StatCard
          label="السيولة الجاهزة للشغل (النقدية)"
          value={formatEGP(summary.readyLiquidity)}
          description="السيولة الجاهزة = مجموع أرصدة السيولة النقدية في كل حسابات الشركاء والمستخدمين."
          onDetails={() => setDetailsKey("readyLiquidity")}
        />

        <StatCard
          label="رصيد إلكتروني (محافظ)"
          value={formatEGP(summary.breakdown.totalWalletBalance)}
          description="الرصيد الإلكتروني = مجموع أرصدة المحافظ في كل حسابات الشركاء والمستخدمين."
          onDetails={() => setDetailsKey("walletBalance")}
        />

        <StatCard
          label="ديون عليا"
          value={formatEGP(summary.breakdown.owedByMe)}
          description="ديون عليا = مجموع المبالغ المتبقية في الديون المفتوحة المستحقة علينا."
          onDetails={() => setDetailsKey("owedByMe")}
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">تفاصيل الحسابات</h2>

        <div className="space-y-4">
          {byPartner?.map((entry, index) => {
            const account = entry.account || entry.partner;
            const accountName = account?.name || "حساب غير محدد";
            const accountType = entry.accountType === "User" ? "أدمن / مستخدم" : "شريك";

            return (
            <Card key={account?._id || `${accountName}-${index}`}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{accountName}</p>
                  <p className="text-xs text-text-secondary">{accountType}</p>
                </div>

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
            );
          })}
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
      <CapitalDetailsModal
        detailKey={detailsKey}
        contributors={summary.contributors}
        onClose={() => setDetailsKey(null)}
      />
    </div>
  );
}
