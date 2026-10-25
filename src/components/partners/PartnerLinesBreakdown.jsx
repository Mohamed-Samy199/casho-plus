import { Plus, Trash2 } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import Select from "../ui/Select";
import { formatEGP } from "../../utils/money";
import { CHANNELS, CHANNEL_LABELS } from "../../constants/channels";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";
import { useRemovePhoneNumber } from "../../hooks/partners/useAddPhoneNumber";
import { useAddWalletChannel } from "../../hooks/capital/useAddWalletChannel";
import { useState } from "react";

const allChannels = Object.values(CHANNELS);

export default function PartnerLinesBreakdown({ partnerId, phoneNumbers = [], lines = [] }) {
  const isAdmin = useAuthStore((s) => s.user?.role === ROLES.ADMIN);
  const { mutate: removePhone } = useRemovePhoneNumber(partnerId);
  const { mutate: addChannel, isPending, error } = useAddWalletChannel();
  const [channelForPhone, setChannelForPhone] = useState({});
  const grouped = phoneNumbers.map((phoneNumber) => ({
    phoneNumber,
    lines: lines.filter((line) => line.phoneNumber === phoneNumber),
  }));

  if (!phoneNumbers.length && !lines.length) {
    return <Card><EmptyState message="لا توجد أرقام مسجّلة لهذا الشريك بعد" /></Card>;
  }

  const add = (phoneNumber) => {
    const channel = channelForPhone[phoneNumber];
    if (!channel) return;
    addChannel(
      { ownerType: "Partner", ownerId: partnerId, phoneNumber, channel },
      { onSuccess: () => setChannelForPhone((old) => ({ ...old, [phoneNumber]: "" })) },
    );
  };

  return (
    <div className="space-y-3">
      {grouped.map(({ phoneNumber, lines: phoneLines }) => {
        const existingChannels = new Set(phoneLines.map((line) => line.channel));
        const availableChannels = allChannels.filter((channel) => !existingChannels.has(channel));
        return (
          <Card key={phoneNumber}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{phoneNumber}</p>
                <p className="text-xs text-text-secondary">القنوات المضافة لهذا الرقم</p>
              </div>
              {isAdmin && (
                <button onClick={() => removePhone(phoneNumber)} className="rounded-lg p-2 text-text-secondary hover:bg-danger-soft hover:text-danger" aria-label="حذف الرقم">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {!phoneLines.length && <p className="mt-4 text-sm text-text-secondary">لم تتم إضافة قناة لهذا الرقم بعد.</p>}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {phoneLines.map((line) => (
                <div key={`${line.channel}-${line.phoneNumber}`} className="rounded-lg bg-bg-raised px-3 py-2 text-sm">
                  <p className="font-medium">{CHANNEL_LABELS[line.channel]}</p>
                  <p className="mt-1">سيولة: {formatEGP(line.liquidityBalance)}</p>
                  <p>رصيد المحفظة: {formatEGP(line.walletBalance)}</p>
                </div>
              ))}
            </div>

            {isAdmin && availableChannels.length > 0 && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <Select
                    label="إضافة قناة لهذا الرقم"
                    value={channelForPhone[phoneNumber] || ""}
                    onChange={(event) => setChannelForPhone((old) => ({ ...old, [phoneNumber]: event.target.value }))}
                    options={availableChannels.map((channel) => ({ value: channel, label: CHANNEL_LABELS[channel] }))}
                    placeholder="اختر القناة"
                  />
                </div>
                <button type="button" disabled={!channelForPhone[phoneNumber] || isPending} onClick={() => add(phoneNumber)} className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50">
                  <Plus size={16} /> إضافة القناة
                </button>
              </div>
            )}
            {error && <p className="mt-2 text-sm text-danger">{error.response?.data?.message || "تعذر إضافة القناة."}</p>}
          </Card>
        );
      })}
    </div>
  );
}
