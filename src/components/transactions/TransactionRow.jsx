import { formatEGP } from "../../utils/money";
import { STAGE_LABELS } from "../../constants/stages";
import { CHANNEL_LABELS } from "../../constants/channels";

export default function TransactionRow({ transaction, showDate = false }) {
  const t = transaction;

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">{t.partner?.name || "—"}</td>
      <td className="px-4 py-3 text-text-secondary">{CHANNEL_LABELS[t.channel]}</td>
      <td className="px-4 py-3 text-text-secondary">{STAGE_LABELS[t.stage]}</td>
      <td className="px-4 py-3 font-medium">{formatEGP(t.amount)}</td>
      <td className="px-4 py-3 text-text-secondary">
        {showDate && `${new Date(t.createdAt).toLocaleDateString("ar-EG")} `}
        {new Date(t.createdAt).toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
    </tr>
  );
}