import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { usePartnerDetails } from "../../hooks/partners/usePartnerDetails";
import PartnerLinesBreakdown from "../../components/partners/PartnerLinesBreakdown";
import AddPhoneNumberModal from "../../components/partners/AddPhoneNumberModal";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import { formatEGP } from "../../utils/money";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";

export default function PartnerDetailPage() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = useAuthStore((s) => s.user?.role === ROLES.ADMIN);
  const { data: partner, isLoading, isError } = usePartnerDetails(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError || !partner) {
    return <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل بيانات الشريك.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{partner.name}</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-text-secondary">إجمالي السيولة</p>
          <p className="mt-1 text-xl font-bold">{formatEGP(partner.totalLiquidity)}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">إجمالي رصيد المحفظة</p>
          <p className="mt-1 text-xl font-bold">{formatEGP(partner.totalWalletBalance)}</p>
        </Card>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">الأرقام/الشرايح</h2>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-bg hover:bg-accent-hover"
            >
              <Plus size={14} />
              إضافة رقم
            </button>
          )}
        </div>
        <PartnerLinesBreakdown partnerId={id} lines={partner.lines} />
      </div>

      {isAdmin && (
        <AddPhoneNumberModal
          partnerId={id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}