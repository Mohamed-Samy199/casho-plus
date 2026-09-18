import { useState } from "react";
import { Plus } from "lucide-react";
import { useClients } from "../../hooks/clients/useClients";
import ClientRow from "../../components/clients/ClientRow";
import AddIndividualModal from "../../components/clients/AddIndividualModal";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";
import { CLIENT_TYPES } from "../../constants/clientTypes";

export default function IndividualsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = useAuthStore((s) => s.user?.role === ROLES.ADMIN);
  const { data, isLoading, isError } = useClients({ type: CLIENT_TYPES.INDIVIDUAL });
  const individuals = data?.result || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">الأفراد</h1>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
          >
            <Plus size={16} />
            إضافة فرد
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل الأفراد.</p>}

      {data && !individuals.length && (
        <Card>
          <EmptyState message="لا يوجد أفراد بعد" />
        </Card>
      )}

      {individuals.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-right text-text-secondary">
                <th className="px-4 py-3 font-medium">الاسم</th>
                <th className="px-4 py-3 font-medium">أرقام التلفون</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {individuals.map((client) => (
                <ClientRow key={client._id} client={client} />
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {isAdmin && (
        <AddIndividualModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}