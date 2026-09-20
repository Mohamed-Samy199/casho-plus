import { useState } from "react";
import { useParams } from "react-router-dom";
import { KeyRound, Plus, ShieldCheck } from "lucide-react";
import { usePartnerDetails } from "../../hooks/partners/usePartnerDetails";
import PartnerLinesBreakdown from "../../components/partners/PartnerLinesBreakdown";
import AddPhoneNumberModal from "../../components/partners/AddPhoneNumberModal";
import CreatePartnerAccountModal from "../../components/partners/CreatePartnerAccountModal";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import { formatEGP } from "../../utils/money";
import { useAuthStore } from "../../store/auth.store";
import { ROLE_LABELS, ROLES } from "../../constants/roles";

export default function PartnerDetailPage() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
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
      <h1 className="text-xl font-bold text-white">{partner.name}</h1>

      {isAdmin && (
        <Card className="border-accent/30 bg-accent-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-accent-soft p-2 text-accent">
                {partner.account ? <ShieldCheck size={20} /> : <KeyRound size={20} />}
              </div>
              <div>
                <h2 className="font-semibold">حساب دخول الشريك</h2>
                {partner.account ? (
                  <p className="mt-1 text-sm text-text-secondary">
                    {partner.account.phoneNumbers?.[0]} · {ROLE_LABELS[partner.account.role] || partner.account.role}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-text-secondary">
                    لا يوجد حساب دخول حاليًا. يمكنك إنشاؤه لاحقًا عند الحاجة.
                  </p>
                )}
              </div>
            </div>
            {!partner.account && (
              <button
                onClick={() => setIsAccountModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
              >
                <KeyRound size={16} />
                إنشاء حساب دخول
              </button>
            )}
          </div>
        </Card>
      )}

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
          <h2 className="text-lg font-semibold text-white">الأرقام/الشرايح</h2>
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
      {isAdmin && (
        <CreatePartnerAccountModal
          partnerId={id}
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
        />
      )}
    </div>
  );
}
