import { useState } from "react";
import { Plus } from "lucide-react";
import { usePartners } from "../../hooks/partners/usePartners";
import PartnerCard from "../../components/partners/PartnerCard";
import AddPartnerModal from "../../components/partners/AddPartnerModal";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";

export default function PartnersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = useAuthStore((s) => s.user?.role === ROLES.ADMIN);
  const { data: partners, isLoading, isError } = usePartners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">الشركاء</h1>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
          >
            <Plus size={16} />
            إضافة شريك
          </button>
        )}
      </div>

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