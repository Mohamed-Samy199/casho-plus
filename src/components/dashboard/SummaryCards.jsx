import Card from "../ui/Card";
import { formatEGP } from "../../utils/money";

function StatCard({ label, value, accent = false }) {
  return (
    <Card>
      <p className="text-sm text-text-secondary">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent ? "text-accent" : ""}`}>{value}</p>
    </Card>
  );
}

export default function SummaryCards({ dashboard }) {
  const { todayOperations, todayFinancials, capitalSummary, debtsOverview } = dashboard;

  const owedToMe = debtsOverview.find((d) => d._id === "owed_to_me")?.total || 0;
  const owedByMe = debtsOverview.find((d) => d._id === "owed_by_me")?.total || 0;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard label="عدد عمليات اليوم" value={todayOperations.totalCount} />

      {/* الحقول دي بترجع من الباك إند للأدمن بس */}
      {todayFinancials && (
        <StatCard label="عمولات اليوم" value={formatEGP(todayFinancials.totalCommission)} accent />
      )}
      {capitalSummary && (
        <StatCard label="السيولة الجاهزة للشغل" value={formatEGP(capitalSummary.readyLiquidity)} />
      )}
      {capitalSummary && (
        <StatCard label="رأس المال الكلي" value={formatEGP(capitalSummary.totalCapital)} />
      )}

      <StatCard label="ديون ليا" value={formatEGP(owedToMe)} />
      <StatCard label="ديون عليا" value={formatEGP(owedByMe)} />
    </div>
  );
}