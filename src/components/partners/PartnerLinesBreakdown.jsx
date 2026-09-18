import { Trash2 } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { formatEGP } from "../../utils/money";
import { CHANNEL_LABELS } from "../../constants/channels";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";
import { useRemovePhoneNumber } from "../../hooks/partners/useAddPhoneNumber";

export default function PartnerLinesBreakdown({ partnerId, lines }) {
  const isAdmin = useAuthStore((s) => s.user?.role === ROLES.ADMIN);
  const { mutate: removePhone } = useRemovePhoneNumber(partnerId);

  if (!lines?.length) {
    return (
      <Card>
        <EmptyState message="لا توجد أرقام مسجّلة لهذا الشريك بعد" />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {lines.map((line) => (
        <Card key={`${line.channel}-${line.phoneNumber}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{line.phoneNumber}</p>
              <p className="text-sm text-text-secondary">{CHANNEL_LABELS[line.channel]}</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => removePhone(line.phoneNumber)}
                className="rounded-lg p-2 text-text-secondary hover:bg-danger-soft hover:text-danger"
                aria-label="حذف الرقم"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-bg-raised px-3 py-2">
              <p className="text-xs text-text-secondary">السيولة</p>
              <p className="font-medium">{formatEGP(line.liquidityBalance)}</p>
            </div>
            <div className="rounded-lg bg-bg-raised px-3 py-2">
              <p className="text-xs text-text-secondary">رصيد المحفظة</p>
              <p className="font-medium">{formatEGP(line.walletBalance)}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}