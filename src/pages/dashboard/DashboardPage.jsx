import { useDashboard } from "../../hooks/dashboard/useDashboard";
import SummaryCards from "../../components/dashboard/SummaryCards";
import OperationsChart from "../../components/dashboard/OperationsChart";
import StageDistributionDonut from "../../components/dashboard/StageDistributionDonut";
import RecentTransactionsList from "../../components/dashboard/RecentTransactionsList";
import Spinner from "../../components/ui/Spinner";

export default function DashboardPage() {
  const { data: dashboard, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <p className="py-16 text-center text-danger">
        حدث خطأ أثناء تحميل بيانات لوحة التحكم.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">الرئيسية</h1>

      <SummaryCards dashboard={dashboard} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OperationsChart byStage={dashboard.todayOperations?.byStage} />
        <StageDistributionDonut byStage={dashboard.todayOperations?.byStage} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">آخر العمليات</h2>
        <RecentTransactionsList transactions={dashboard.recentTransactions} />
      </div>
    </div>
  );
}