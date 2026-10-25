import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SubmitButton from "../ui/SubmitButton";
import { useCorrectTransaction } from "../../hooks/transactions/useCorrectTransaction";
import { createIdempotencyKey } from "../../hooks/transactions/useCreateTransaction";
import { useUsers } from "../../hooks/users/useUsers";
import { usePartners } from "../../hooks/partners/usePartners";
import { useClients } from "../../hooks/clients/useClients";
import { CHANNEL_OPTIONS } from "../../constants/channels";
import { STAGE_OPTIONS } from "../../constants/stages";
import { PARTY_TYPES, PARTY_TYPE_LABELS } from "../../constants/partyTypes";
import { egpToPiasters, piastersToEGP } from "../../utils/money";

export default function CorrectTransactionModal({ transaction, isOpen, onClose }) {
  const { data: users = [] } = useUsers({ enabled: isOpen });
  const { data: partners = [] } = usePartners(undefined, { enabled: isOpen });
  const { data: clientsData } = useClients({ isActive: true });
  const clients = clientsData?.result || clientsData || [];
  const [form, setForm] = useState(null);
  const idempotencyKeyRef = useRef(null);
  const { mutate, isPending, error } = useCorrectTransaction(transaction?._id);

  const accounts = useMemo(() => [
    ...users.map((item) => ({ ...item, type: "User", value: `User:${item._id}`, label: `${item.name} — أدمن` })),
    ...partners.map((item) => ({ ...item, type: "Partner", value: `Partner:${item._id}`, label: `${item.name} — شريك` })),
  ], [users, partners]);
  const selectedAccount = accounts.find((item) => item.value === form?.account) || accounts.find((item) => item.type === transaction?.ownerType && item._id === (transaction?.owner?._id || transaction?.owner || transaction?.partner?._id || transaction?.partner));
  const phones = selectedAccount?.phoneNumbers || [];

  useEffect(() => {
    if (!transaction || !isOpen) return;
    const ownerId = transaction.owner?._id || transaction.owner || transaction.partner?._id || transaction.partner || "";
    setForm({
      account: `${transaction.ownerType || (transaction.partner ? "Partner" : "User")}:${ownerId}`,
      phoneNumber: transaction.phoneNumber || "",
      channel: transaction.channel || "",
      stage: transaction.stage || "",
      partyType: transaction.partyType || PARTY_TYPES.WALK_IN,
      partyId: transaction.partyId?._id || transaction.partyId || "",
      amount: String(piastersToEGP(transaction.amount)),
      commission: String(piastersToEGP(transaction.commission || 0)),
      notes: transaction.notes || "",
      reason: "",
    });
    idempotencyKeyRef.current = null;
  }, [transaction, isOpen]);

  useEffect(() => {
    if (!form || !selectedAccount) return;
    if (!phones.includes(form.phoneNumber)) setForm((current) => ({ ...current, phoneNumber: phones[0] || "" }));
  }, [form?.account, selectedAccount?._id]);

  if (!transaction || !form) return null;
  const set = (key) => (event) => { setForm((current) => ({ ...current, [key]: event.target.value })); idempotencyKeyRef.current = null; };
  const submit = (event) => {
    event.preventDefault();
    const [ownerType, ownerId] = form.account.split(":");
    const rawStage = form.stage;
    const stageCandidate = typeof rawStage === "string" ? rawStage : rawStage?.value;
    const originalStage = typeof transaction.stage === "string" ? transaction.stage : transaction.stage?.value;
    const stageValue = STAGE_OPTIONS.some((option) => option.value === stageCandidate)
      ? stageCandidate
      : STAGE_OPTIONS.find((option) => option.label === rawStage)?.value || originalStage;
    const data = {
      ownerType, ownerId, phoneNumber: form.phoneNumber, channel: form.channel,
      partyType: form.partyType,
      amount: egpToPiasters(form.amount), commission: egpToPiasters(form.commission), notes: form.notes,
      reason: form.reason,
    };
    if (form.partyType !== PARTY_TYPES.WALK_IN) data.partyId = form.partyId;
    // نرسل الاسم القديم المتوافق مع نسخ الباك إند الحالية، والقيمة تكون نصًا دائمًا.
    data.targetStage = String(stageValue || "");
    const idempotencyKey = idempotencyKeyRef.current || (idempotencyKeyRef.current = createIdempotencyKey());
    mutate({ data, idempotencyKey }, { onSuccess: () => { idempotencyKeyRef.current = null; onClose(); } });
  };
  const close = () => { if (!isPending) { idempotencyKeyRef.current = null; onClose(); } };

  return <Modal title="تعديل العملية" isOpen={isOpen} onClose={close}>
    <form onSubmit={submit} className="space-y-3" dir="rtl">
      <div className="rounded-lg border border-accent/30 bg-accent-soft p-3 text-sm text-accent">سيتم تعديل نفس العملية وتحديث أثرها على الأرصدة مباشرة، بدون إنشاء عملية عكس أو سجل عملية جديد. لا يمكن تعديل عملية لها سداد سابق.</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="صاحب الحساب" value={form.account} onChange={set("account")} options={accounts.map((item) => ({ value: item.value, label: item.label }))} />
        <Select label="الرقم/الشريحة" value={form.phoneNumber} onChange={set("phoneNumber")} options={phones.map((phone) => ({ value: phone, label: phone }))} />
        <Select label="القناة" value={form.channel} onChange={set("channel")} options={CHANNEL_OPTIONS} />
        <Select label="المرحلة" value={form.stage} onChange={set("stage")} options={STAGE_OPTIONS} />
        <Input label="المبلغ (جنيه)" type="number" min="0.01" step="0.01" value={form.amount} onChange={set("amount")} required />
        <Input label="العمولة (جنيه)" type="number" min="0" step="0.01" value={form.commission} onChange={set("commission")} />
        <Select label="نوع الطرف" value={form.partyType} onChange={set("partyType")} options={Object.entries(PARTY_TYPE_LABELS).map(([value, label]) => ({ value, label }))} />
        {form.partyType !== PARTY_TYPES.WALK_IN && <Select label="العميل" value={form.partyId} onChange={set("partyId")} options={clients.map((client) => ({ value: client._id, label: client.name }))} placeholder="اختر العميل" />}
      </div>
      <label className="block text-sm text-text-secondary">الملاحظات<textarea value={form.notes} onChange={set("notes")} maxLength={500} rows={2} className="mt-1 w-full rounded-lg border border-border bg-bg-raised px-3 py-2 text-text-primary" /></label>
      <label className="block text-sm text-text-secondary">سبب التعديل<textarea value={form.reason} onChange={set("reason")} maxLength={500} rows={2} className="mt-1 w-full rounded-lg border border-border bg-bg-raised px-3 py-2 text-text-primary" /></label>
      {error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error.response?.data?.errors?.join("، ") || error.response?.data?.message || "حدث خطأ أثناء تعديل العملية."}</p>}
      <SubmitButton isLoading={isPending}>حفظ التعديل</SubmitButton>
    </form>
  </Modal>;
}
