import { useCapitalSummary } from "../../hooks/capital/useCapitalSummary";
import { useCapitalByPartner } from "../../hooks/capital/useCapitalByPartner";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
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
  const { data: summary, isLoading: isSummaryLoading } = useCapitalSummary();
  const { data: byPartner, isLoading: isPartnersLoading } = useCapitalByPartner();

  if (isSummaryLoading || isPartnersLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">رأس المال</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard label="رأس المال الكلي" value={formatEGP(summary.totalCapital)} />
        <StatCard label="السيولة الجاهزة للشغل" value={formatEGP(summary.readyLiquidity)} />
        <StatCard label="خارج السيولة الفعلية" value={formatEGP(summary.outsideCapital)} />
        <StatCard label="رصيد إلكتروني (محافظ)" value={formatEGP(summary.breakdown.totalWalletBalance)} />
        <StatCard label="ديون ليا" value={formatEGP(summary.breakdown.owedToMe)} />
        <StatCard label="ديون عليا" value={formatEGP(summary.breakdown.owedByMe)} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">تفاصيل الشركاء</h2>
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
                    <p className="text-text-secondary">{CHANNEL_LABELS[line.channel]}</p>
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
    </div>
  );
}