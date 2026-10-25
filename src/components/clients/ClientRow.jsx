import { useState } from "react";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useUpdateClient } from "../../hooks/clients/useUpdateClient";
import { useTransactions } from "../../hooks/transactions/useTransactions";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";
import { STAGE_LABELS } from "../../constants/stages";
import { CHANNEL_LABELS } from "../../constants/channels";
import { formatEGP } from "../../utils/money";

function formatDate(date) {
  return date
    ? new Date(date).toLocaleDateString("ar-EG", { day: "numeric", month: "short", year: "numeric" })
    : "لا يوجد";
}

function OperationDetails({ clientId, isOpen }) {
  const { data, isLoading, isError } = useTransactions({
    partyType: "Client",
    partyId: clientId,
    page: 1,
    size: 100,
    enabled: isOpen,
  });
  const operations = data?.result || [];

  if (isLoading) return <div className="flex items-center gap-2 py-3 text-sm text-text-secondary"><LoaderCircle size={16} className="animate-spin" /> جاري تحميل العمليات...</div>;
  if (isError) return <p className="py-3 text-sm text-danger">تعذر تحميل عمليات العميل.</p>;
  if (!operations.length) return <p className="py-3 text-sm text-text-secondary">لا توجد عمليات مسجلة لهذا العميل.</p>;

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[760px] text-xs">
        <thead className="bg-bg-raised text-text-secondary">
          <tr>
            <th className="px-3 py-2 text-right font-medium">العملية</th>
            <th className="px-3 py-2 text-right font-medium">الأصلي</th>
            <th className="px-3 py-2 text-right font-medium">المدفوع</th>
            <th className="px-3 py-2 text-right font-medium">المتبقي</th>
            <th className="px-3 py-2 text-right font-medium">تاريخ العملية</th>
            <th className="px-3 py-2 text-right font-medium">الاستحقاق</th>
            <th className="px-3 py-2 text-right font-medium">القناة</th>
          </tr>
        </thead>
        <tbody>
          {operations.map((operation) => (
            <tr key={operation._id} className="border-t border-border">
              <td className="px-3 py-2 font-medium">{STAGE_LABELS[operation.stage] || operation.stage}</td>
              <td className="px-3 py-2">{formatEGP(operation.amount)}</td>
              <td className="px-3 py-2 text-accent">{formatEGP(operation.paidAmount || 0)}</td>
              <td className="px-3 py-2 font-semibold text-danger">{formatEGP(operation.remainingAmount ?? operation.amount)}</td>
              <td className="px-3 py-2 text-text-secondary">{formatDate(operation.createdAt)}</td>
              <td className="px-3 py-2 text-text-secondary">{formatDate(operation.agreedDueAt)}</td>
              <td className="px-3 py-2 text-text-secondary">{CHANNEL_LABELS[operation.channel] || operation.channel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ClientRow({ client, variant = "key" }) {
  const isAdmin = useAuthStore((state) => state.user?.role === ROLES.ADMIN);
  const { mutate: updateClient } = useUpdateClient(client._id);
  const [isOpen, setIsOpen] = useState(false);
  const summary = client.financialSummary || {};
  const owedByClient = summary.owedByClient || 0;
  const owedToClient = summary.owedToClient || 0;

  const status = isAdmin ? (
    <button onClick={() => updateClient({ isActive: !client.isActive })} className={`rounded-full px-2.5 py-1 text-xs ${client.isActive ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"}`}>
      {client.isActive ? "نشط" : "غير نشط"}
    </button>
  ) : (
    <span className={`rounded-full px-2.5 py-1 text-xs ${client.isActive ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger"}`}>
      {client.isActive ? "نشط" : "غير نشط"}
    </span>
  );

  if (variant === "individual") {
    return (
      <tr className="border-b border-border last:border-0">
        <td className="px-4 py-4 font-medium"><Link to={`/clients/${client._id}`} className="hover:text-accent">{client.name}</Link></td>
        <td className="px-4 py-4 text-text-secondary">{client.phoneNumbers?.join("، ") || "—"}</td>
        <td className="px-4 py-4">{status}</td>
      </tr>
    );
  }

  return (
    <>
      <tr className="border-b border-border align-top last:border-0">
        <td className="px-4 py-4 font-medium">
          <Link to={`/clients/${client._id}`} className="hover:text-accent">{client.name}</Link>
          <p className="mt-1 text-xs text-text-secondary">{summary.openTransactions || 0} عملية مفتوحة</p>
        </td>
        <td className="px-4 py-4 text-text-secondary">{client.phoneNumbers?.join("، ") || "—"}</td>
        <td className="px-4 py-4"><span className={owedByClient ? "font-semibold text-danger" : "text-text-secondary"}>{formatEGP(owedByClient)}</span><p className="mt-1 text-xs text-text-secondary">عليه للمكتب</p></td>
        <td className="px-4 py-4"><span className={owedToClient ? "font-semibold text-accent" : "text-text-secondary"}>{formatEGP(owedToClient)}</span><p className="mt-1 text-xs text-text-secondary">له عند المكتب</p></td>
        <td className="px-4 py-4 text-text-secondary">{formatDate(summary.nextDueAt)}</td>
        <td className="px-4 py-4">{status}</td>
        <td className="px-4 py-4">
          <button onClick={() => setIsOpen((value) => !value)} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:bg-bg-raised" aria-expanded={isOpen}>
            تفاصيل العمليات <ChevronDown size={14} className={isOpen ? "rotate-180" : ""} />
          </button>
        </td>
      </tr>
      {isOpen && <tr className="border-b border-border bg-bg-raised"><td colSpan={7} className="px-4 py-3"><OperationDetails clientId={client._id} isOpen={isOpen} /></td></tr>}
    </>
  );
}
