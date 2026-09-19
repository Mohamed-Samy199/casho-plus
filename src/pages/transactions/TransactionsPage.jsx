import { useState } from "react";
import { Plus } from "lucide-react";
import { useTransactions } from "../../hooks/transactions/useTransactions";
import NewTransactionModal from "../../components/transactions/NewTransactionModal";
import TransactionFilters from "../../components/transactions/TransactionFilters";
import RecentTransactionsList from "../../components/dashboard/RecentTransactionsList";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ page: 1, size: 15 });
  const { data, isLoading, isError } = useTransactions(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">العمليات</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
        >
          <Plus size={16} />
          عملية جديدة
        </button>
      </div>

      <TransactionFilters filters={filters} onChange={setFilters} />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && (
        <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل العمليات.</p>
      )}

      {data && (
        <>
          <RecentTransactionsList transactions={data.result} />
          <Pagination
            currentPage={data.currentPage || 1}
            pages={data.pages}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </>
      )}

      <NewTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}