import { ArrowLeft, Clock3, ReceiptText, UserRound, WalletMinimal } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboard } from "../../hooks/dashboard/useDashboard";
import SummaryCards from "../../components/dashboard/SummaryCards";
import OperationsChart from "../../components/dashboard/OperationsChart";
import StageDistributionDonut from "../../components/dashboard/StageDistributionDonut";
import RecentTransactionsList from "../../components/dashboard/RecentTransactionsList";
import Spinner from "../../components/ui/Spinner";

const quickActions = [
  { label: "تسجيل عملية", hint: "أضف حركة مالية جديدة", href: "/transactions", icon: ReceiptText, tone: "bg-accent-soft text-accent" },
  { label: "إضافة شريك", hint: "إدارة أصحاب المكان", href: "/partners", icon: UserRound, tone: "bg-emerald-50 text-emerald-600" },
  { label: "عرض رأس المال", hint: "تابع السيولة والمحافظ", href: "/capital", icon: WalletMinimal, tone: "bg-amber-50 text-amber-600" },
];

export default function DashboardPage() {
  const { data: dashboard, isLoading, isError } = useDashboard();

  if (isLoading) {
    return <div className="flex justify-center py-24"><Spinner /></div>;
  }

  if (isError || !dashboard) {
    return <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل بيانات لوحة التحكم.</p>;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-sm font-medium text-white/60">نظرة سريعة على مكتبك</p>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">الرئيسية</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Clock3 size={15} />
          <span>تتحدث البيانات تلقائيًا كل دقيقة</span>
        </div>
      </div>

      <SummaryCards dashboard={dashboard} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {quickActions.map(({ label, hint, href, icon: Icon, tone }) => (
          <Link
            key={href}
            to={href}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-lg hover:shadow-slate-200/50"
          >
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon size={20} /></span>
            <span className="min-w-0">
              <span className="block font-bold text-text-primary">{label}</span>
              <span className="mt-1 block text-xs text-text-secondary">{hint}</span>
            </span>
            <ArrowLeft className="mr-auto text-text-muted transition-transform group-hover:-translate-x-1 group-hover:text-accent" size={18} />
          </Link>
        ))}
      </section>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">تحليل اليوم</p>
          <h2 className="mt-1 text-xl font-black text-text-primary">حركة العمليات</h2>
        </div>
        <Link to="/transactions" className="hidden items-center gap-1 text-sm font-bold text-accent hover:text-accent-hover sm:flex">
          كل العمليات <ArrowLeft size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <OperationsChart byStage={dashboard.todayOperations?.byStage} />
        <StageDistributionDonut byStage={dashboard.todayOperations?.byStage} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">آخر حركة مسجلة</p>
            <h2 className="mt-1 text-xl font-black text-text-primary">العمليات الأخيرة</h2>
          </div>
          <Link to="/transactions" className="flex items-center gap-1 text-sm font-bold text-accent hover:text-accent-hover">
            عرض الكل <ArrowLeft size={16} />
          </Link>
        </div>
        <RecentTransactionsList transactions={dashboard.recentTransactions} showDate />
      </section>
    </div>
  );
}
