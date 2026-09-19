import { useParams } from "react-router-dom";
import { useClient } from "../../hooks/clients/useClient";
import { useTransactions } from "../../hooks/transactions/useTransactions";
import { useDebts } from "../../hooks/debts/useDebts";
import { useUpdateClient } from "../../hooks/clients/useUpdateClient";
import RecentTransactionsList from "../../components/dashboard/RecentTransactionsList";
import DebtRow from "../../components/debts/DebtRow";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { CLIENT_TYPE_LABELS, CLIENT_TYPES } from "../../constants/clientTypes";
import { PARTY_TYPES } from "../../constants/partyTypes";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";

export default function ClientDetailPage() {
  const { id } = useParams();
  const isAdmin = useAuthStore((s) => s.user?.role === ROLES.ADMIN);

  const { data: client, isLoading, isError } = useClient(id);
  const { data: transactions } = useTransactions({
    partyType: PARTY_TYPES.CLIENT,
    partyId: id,
    size: 10,
  });
  const { data: debts } = useDebts({ partyType: PARTY_TYPES.CLIENT, partyId: id });
  const { mutate: updateClient } = useUpdateClient(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError || !client) {
    return <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل بيانات العميل.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{client.name}</h1>
        {isAdmin && (
          <button
            onClick={() => updateClient({ isActive: !client.isActive })}
            className={`rounded-full px-3 py-1.5 text-sm ${
              client.isActive ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"
            }`}
          >
            {client.isActive ? "نشط" : "غير نشط"}
          </button>
        )}
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-text-secondary">النوع</p>
            <p className="font-medium">{CLIENT_TYPE_LABELS[client.type]}</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">أرقام التلفون</p>
            <p className="font-medium">{client.phoneNumbers?.join("، ") || "—"}</p>
          </div>
          {client.notes && (
            <div>
              <p className="text-sm text-text-secondary">ملاحظات</p>
              <p className="font-medium">{client.notes}</p>
            </div>
          )}
        </div>

        {client.type === CLIENT_TYPES.KEY_CLIENT && (
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <p className="text-sm text-text-secondary">الميعاد المتفق عليه</p>
              <p className="font-medium">{client.keyClientSettings?.defaultAgreedHours ?? 24} ساعة</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">عمولة التأخير الافتراضية</p>
              <p className="font-medium">
                {((client.keyClientSettings?.defaultLateCommission ?? 500) / 100).toLocaleString(
                  "ar-EG"
                )}{" "}
                جنيه
              </p>
            </div>
          </div>
        )}
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">آخر العمليات</h2>
        <RecentTransactionsList transactions={transactions?.result} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">الديون</h2>
        {!debts?.result?.length ? (
          <Card>
            <EmptyState message="لا توجد ديون مرتبطة بهذا العميل" />
          </Card>
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-right text-text-secondary">
                  <th className="px-4 py-3 font-medium">النوع</th>
                  <th className="px-4 py-3 font-medium">الوصف</th>
                  <th className="px-4 py-3 font-medium">القيمة الأصلية</th>
                  <th className="px-4 py-3 font-medium">المتبقي</th>
                  <th className="px-4 py-3 font-medium">أثر على رأس المال</th>
                  <th className="px-4 py-3 font-medium">الحالة</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {debts.result.map((debt) => (
                  <DebtRow key={debt._id} debt={debt} onRepay={() => {}} />
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
