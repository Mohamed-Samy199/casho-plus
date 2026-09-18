import { useState } from "react";
import { Plus } from "lucide-react";
import { useDebts } from "../../hooks/debts/useDebts";
import DebtRow from "../../components/debts/DebtRow";
import DebtFilters from "../../components/debts/DebtFilters";
import AddDebtModal from "../../components/debts/AddDebtModal";
import RepayDebtModal from "../../components/debts/RepayDebtModal";
import Card from "../../components/ui/Card";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";

export default function DebtsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [repayingDebt, setRepayingDebt] = useState(null);
  const [filters, setFilters] = useState({ page: 1, size: 20 });
  const { data, isLoading, isError } = useDebts(filters);
  const debts = data?.result || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">الديون</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
        >
          <Plus size={16} />
          إضافة دين
        </button>
      </div>

      <DebtFilters filters={filters} onChange={setFilters} />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل الديون.</p>}

      {data && !debts.length && (
        <Card>
          <EmptyState message="لا توجد ديون مطابقة" />
        </Card>
      )}

      {debts.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-right text-text-secondary">
                <th className="px-4 py-3 font-medium">النوع</th>
                <th className="px-4 py-3 font-medium">الوصف</th>
                <th className="px-4 py-3 font-medium">القيمة الأصلية</th>
                <th className="px-4 py-3 font-medium">المتبقي</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {debts.map((debt) => (
                <DebtRow key={debt._id} debt={debt} onRepay={setRepayingDebt} />
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {data && (
        <Pagination
          currentPage={data.currentPage || 1}
          pages={data.pages}
          onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        />
      )}

      <AddDebtModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <RepayDebtModal
        debt={repayingDebt}
        isOpen={!!repayingDebt}
        onClose={() => setRepayingDebt(null)}
      />
    </div>
  );
}