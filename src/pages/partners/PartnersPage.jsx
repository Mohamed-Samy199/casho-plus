import { useState } from "react";
import { Plus, UserCheck, UsersRound } from "lucide-react";
import { usePartners } from "../../hooks/partners/usePartners";
import PartnerCard from "../../components/partners/PartnerCard";
import AddPartnerModal from "../../components/partners/AddPartnerModal";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";

export default function PartnersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = useAuthStore((s) => s.user?.role === ROLES.ADMIN);
  const { data: partners, isLoading, isError } = usePartners();
  const activePartners = partners?.filter((partner) => partner.isActive).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <UsersRound size={22} className="text-accent" />
            <h1 className="text-2xl font-bold text-accent">الشركاء</h1>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            إدارة أصحاب المكان وأرقامهم وحسابات المحافظ المرتبطة بهم.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
          >
            <Plus size={18} />
            إضافة شريك
          </button>
        )}
      </div>

      {!isLoading && !isError && partners?.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs text-text-secondary">إجمالي الشركاء</p>
            <p className="mt-1 text-2xl font-bold">{partners.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-text-secondary">الشركاء النشطون</p>
            <div className="mt-1 flex items-center gap-2">
              <UserCheck size={18} className="text-accent" />
              <p className="text-2xl font-bold">{activePartners}</p>
            </div>
          </Card>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل الشركاء.</p>}

      {partners && !partners.length && <EmptyState message="لا يوجد شركاء بعد" />}

      {partners?.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <PartnerCard key={partner._id} partner={partner} />
          ))}
        </div>
      )}

      {isAdmin && (
        <AddPartnerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
