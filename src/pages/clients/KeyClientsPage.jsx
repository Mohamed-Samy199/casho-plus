import { useState } from "react";
import { Plus } from "lucide-react";
import { useClients } from "../../hooks/clients/useClients";
import ClientRow from "../../components/clients/ClientRow";
import AddKeyClientModal from "../../components/clients/AddKeyClientModal";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";
import { CLIENT_TYPES } from "../../constants/clientTypes";

export default function KeyClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = useAuthStore((s) => s.user?.role === ROLES.ADMIN);
  const { data, isLoading, isError } = useClients({ type: CLIENT_TYPES.KEY_CLIENT });
  const keyClients = data?.result || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">العملاء الرئيسيون</h1>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
          >
            <Plus size={16} />
            إضافة عميل رئيسي
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && (
        <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل العملاء الرئيسيين.</p>
      )}

      {data && !keyClients.length && (
        <Card>
          <EmptyState message="لا يوجد عملاء رئيسيون بعد" />
        </Card>
      )}

      {keyClients.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-right text-text-secondary">
                <th className="px-4 py-3 font-medium">الاسم</th>
                <th className="px-4 py-3 font-medium">أرقام التلفون</th>
                <th className="px-4 py-3 font-medium">الميعاد المتفق عليه</th>
                <th className="px-4 py-3 font-medium">عمولة التأخير</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {keyClients.map((client) => (
                <ClientRow key={client._id} client={client} showKeyClientSettings />
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {isAdmin && (
        <AddKeyClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}