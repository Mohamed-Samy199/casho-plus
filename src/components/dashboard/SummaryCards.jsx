import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  ChartNoAxesCombined,
  Landmark,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatEGP } from "../../utils/money";
import vodafoneCashLogo from "../../assets/vodafone-cash-logo.webp";
import instapayLogo from "../../assets/instapay-logo.webp";

function Metric({ icon: Icon, label, value, tone = "blue", helper }) {
  const tones = {
    blue: "bg-accent-soft text-accent",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="group rounded-2xl border border-border bg-bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}
        >
          <Icon size={19} strokeWidth={2.2} />
        </div>
        <span className="text-[11px] font-medium text-text-muted">اليوم</span>
      </div>
      <p className="mt-4 text-sm font-medium text-text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-text-primary">
        {value}
      </p>
      {helper && <p className="mt-1 text-xs text-text-muted">{helper}</p>}
    </div>
  );
}

function ChannelMetric({ label, value, helper, logo, tone }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-lg hover:shadow-slate-200/50">
      <div className={`pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full ${tone} opacity-10 blur-2xl`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-text-primary">{value}</p>
          <p className="mt-1 text-xs text-text-muted">{helper}</p>
        </div>
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-sm">
          <img src={logo} alt={`${label} logo`} className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  );
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "صباح الخير، جاهزين للشغل؟";
  if (hour >= 12 && hour < 18) return "نهارك سعيد، ننجز معاملات اليوم؟";
  if (hour >= 18 && hour < 24) return "مساء الخير، نتابع حركة المكتب؟";
  return "لسه صاحيين؟ نراجع أرقام اليوم بهدوء.";
}

export default function SummaryCards({ dashboard }) {
  const {
    todayOperations = {},
    todayFinancials,
    capitalSummary,
    todayReconciliation,
    pendingFundsOverview = [],
    debtsOverview = [],
  } = dashboard;
  const owedToMe =
    debtsOverview.find((d) => d._id === "owed_to_me")?.total || 0;
  const owedByMe =
    debtsOverview.find((d) => d._id === "owed_by_me")?.total || 0;
  const totalCapital = capitalSummary?.totalCapital || 0;
  const readyLiquidity = capitalSummary?.readyLiquidity || 0;
  const electronicBalance = capitalSummary?.breakdown?.totalWalletBalance || 0;
  const vodafoneBalance = capitalSummary?.breakdown?.walletBalanceByChannel?.vodafone_cash || 0;
  const instapayBalance = capitalSummary?.breakdown?.walletBalanceByChannel?.instapay || 0;
  const usableCapital =
    (capitalSummary?.readyLiquidity || 0) +
    (capitalSummary?.breakdown?.totalWalletBalance || 0);
  const expenseBreakdown = todayReconciliation?.expenseBreakdown || {};
  const expenseCards = [
    { key: "outflow", label: "خوارج اليوم", helper: "احتياجات المكتب", tone: "red" },
    { key: "asset", label: "شراء أصول اليوم", helper: "مبالغ تحولت إلى أصول", tone: "amber" },
    { key: "advance", label: "سُلف اليوم", helper: "مبالغ مستحقة على المستفيدين", tone: "blue" },
  ];
  const pendingTotal = pendingFundsOverview.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <>
      <section className="relative overflow-hidden rounded-[1.75rem] bg-[#056ccf] p-5 text-white shadow-xl shadow-blue-950/15 sm:p-7">
        <div className="pointer-events-none absolute bottom-[-100px] right-1/3 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              لوحة التشغيل المباشرة
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              {getTimeGreeting()}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              تابع حركة المكتب، السيولة المتاحة، وأداء العمليات من مكان واحد.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
            <div
              className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
              title="رأس المال الكلي = السيولة الجاهزة + الرصيد الإلكتروني + ديون ليا − ديون عليا."
            >
              <p className="text-[0.9rem] text-white/60">إجمالي رأس المال</p>
              <p className="mt-2 text-xl font-black">
                {formatEGP(totalCapital)}
              </p>
            </div>
            <div
              className="rounded-2xl border border-casho-yellow/25 bg-casho-yellow/15 p-4"
              title="هذا الكارت = السيولة الجاهزة للشغل + الرصيد الإلكتروني في المحافظ فقط، بدون احتساب أي ديون."
            >
              <p className="text-[0.9rem] text-casho-yellow/80">
                السيولة والرصيد المتاحين للشغل
              </p>
              <p className="mt-2 text-xl font-black text-casho-yellow">
                {formatEGP(usableCapital)}
              </p>
            </div>
          </div>
        </div>
        <div className="relative mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-4 text-xs text-white/60">
          <span>{todayOperations.totalCount || 0} عملية اليوم</span>
          <span className="text-white/25">•</span>
          <span>
            {todayFinancials ? formatEGP(todayFinancials.totalCommission) : "—"}{" "}
            عمولات
          </span>
          <Link
            to="/transactions"
            className="mr-auto font-bold text-casho-yellow hover:text-white"
          >
            عرض كل العمليات ←
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <Metric
          icon={ChartNoAxesCombined}
          label="عمليات اليوم"
          value={todayOperations.totalCount || 0}
          helper="حركة المكتب اليوم"
          tone="blue"
        />
        <Metric
          icon={Banknote}
          label="عمولات اليوم"
          value={
            todayFinancials ? formatEGP(todayFinancials.totalCommission) : "—"
          }
          helper="إجمالي المكسب"
          tone="green"
        />
        <Metric
          icon={Landmark}
          label="السيولة الجاهزة"
          value={formatEGP(readyLiquidity)}
          helper="نقدية قابلة للتشغيل"
          tone="amber"
        />
        <Metric
          icon={WalletCards}
          label="رصيد إلكتروني"
          value={formatEGP(electronicBalance)}
          helper="إجمالي أرصدة المحافظ"
          tone="blue"
        />
        <Metric
          icon={ArrowDownLeft}
          label="ديون لنا"
          value={formatEGP(owedToMe)}
          helper="مبالغ مستحقة للمكتب"
          tone="green"
        />
        <Metric
          icon={ArrowUpRight}
          label="ديون علينا"
          value={formatEGP(owedByMe)}
          helper="مبالغ مستحقة للغير"
          tone="red"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ChannelMetric label="رصيد فودافون كاش" value={formatEGP(vodafoneBalance)} helper="الرصيد الإلكتروني لقناة فودافون كاش" logo={vodafoneCashLogo} tone="bg-rose-500" />
        <ChannelMetric label="رصيد إنستا باي" value={formatEGP(instapayBalance)} helper="الرصيد الإلكتروني لقناة إنستا باي" logo={instapayLogo} tone="bg-violet-500" />
      </div>
      {todayReconciliation && (
        <section className="rounded-2xl border border-border bg-bg-surface p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-text-primary">مصروفات وحركات اليوم</h3>
              <p className="mt-1 text-xs text-text-secondary">تدخل هذه القيم في حساب الرصيد المتوقع في التقفيل اليومي.</p>
            </div>
            <Link to="/daily-reconciliation" className="text-xs font-bold text-accent hover:text-accent-hover">فتح التقفيل اليومي ←</Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {expenseCards.map(({ key, label, helper, tone }) => (
              <Metric key={key} icon={Banknote} label={label} value={formatEGP(expenseBreakdown[key]?.total || 0)} helper={helper} tone={tone} />
            ))}
          </div>
        </section>
      )}
      {capitalSummary && <section className="rounded-2xl border border-border bg-bg-surface p-4 text-text-primary shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="font-bold text-text-primary">أموال معلقة تحتاج متابعة</h3><p className="mt-1 text-xs text-text-secondary">مبالغ خرجت من المكتب ولم تتم تسويتها بعد.</p></div>
          <Link to="/pending-funds" className="rounded-lg border border-border px-3 py-2 text-xs font-bold text-accent">إدارة الأموال المعلقة ←</Link>
        </div>
        <p className="mt-3 text-2xl font-black text-text-primary">{formatEGP(pendingTotal)}</p>
      </section>}
    </>
  );
}
