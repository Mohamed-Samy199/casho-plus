import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SearchableSelect from "../ui/SearchableSelect";
import StageSelector from "./StageSelector";
import SubmitButton from "../ui/SubmitButton";
import { usePartners } from "../../hooks/partners/usePartners";
import { useClients } from "../../hooks/clients/useClients";
import { useCreateTransaction } from "../../hooks/transactions/useCreateTransaction";
import { CHANNEL_OPTIONS } from "../../constants/channels";
import { PARTY_TYPES, PARTY_TYPE_LABELS } from "../../constants/partyTypes";
import { egpToPiasters } from "../../utils/money";

const initialForm = {
  partnerId: "",
  phoneNumber: "",
  channel: CHANNEL_OPTIONS[0]?.value || "",
  stage: "",
  partyType: PARTY_TYPES.CLIENT,
  partyId: "",
  amount: "",
  commission: "",
  agreedDueAt: "",
  notes: "",
};

export default function NewTransactionModal({ isOpen, onClose }) {
  const [form, setForm] = useState(initialForm);

  const { data: partners } = usePartners({ isActive: true });
  const { data: clientsResult } = useClients({ isActive: true });
  const clients = clientsResult?.result || [];

  const { mutate: createTransaction, isPending, error } = useCreateTransaction();

  const selectedPartner = partners?.find((p) => p._id === form.partnerId);
  const partnerOptions = (partners || []).map((p) => ({ value: p._id, label: p.name }));
  const clientOptions = clients.map((c) => ({ value: c._id, label: c.name }));

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    createTransaction(
      {
        partnerId: form.partnerId,
        phoneNumber: form.phoneNumber,
        channel: form.channel,
        stage: form.stage,
        partyType: form.partyType,
        partyId: form.partyType === PARTY_TYPES.PARTNER ? form.partnerId : form.partyId,
        amount: egpToPiasters(form.amount),
        ...(form.commission !== "" && { commission: egpToPiasters(form.commission) }),
        ...(form.agreedDueAt && { agreedDueAt: new Date(form.agreedDueAt).toISOString() }),
        notes: form.notes,
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          onClose();
        },
      }
    );
  };

  return (
    <Modal title="تسجيل عملية جديدة" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SearchableSelect
          label="الشريك"
          placeholder="اختر الشريك"
          value={form.partnerId}
          onChange={(val) => setForm((f) => ({ ...f, partnerId: val, phoneNumber: "" }))}
          options={partnerOptions}
          required
        />

        <Select
          label="الرقم/الشريحة"
          placeholder="اختر الرقم"
          value={form.phoneNumber}
          onChange={update("phoneNumber")}
          options={(selectedPartner?.phoneNumbers || []).map((phone) => ({
            value: phone,
            label: phone,
          }))}
          disabled={!selectedPartner}
          required
        />

        <Select
          label="الوسيلة"
          value={form.channel}
          onChange={update("channel")}
          options={CHANNEL_OPTIONS}
        />

        <StageSelector
          value={form.stage}
          onChange={(stage) => setForm((f) => ({ ...f, stage }))}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="نوع الطرف الآخر"
            value={form.partyType}
            onChange={(e) => setForm((f) => ({ ...f, partyType: e.target.value, partyId: "" }))}
            options={Object.values(PARTY_TYPES).map((v) => ({ value: v, label: PARTY_TYPE_LABELS[v] }))}
          />

          {form.partyType === PARTY_TYPES.CLIENT ? (
            <SearchableSelect
              label="العميل"
              placeholder="دوّر على عميل"
              value={form.partyId}
              onChange={(val) => setForm((f) => ({ ...f, partyId: val }))}
              options={clientOptions}
              required
            />
          ) : (
            <SearchableSelect
              label="الشريك الآخر"
              placeholder="دوّر على شريك"
              value={form.partyId}
              onChange={(val) => setForm((f) => ({ ...f, partyId: val }))}
              options={partnerOptions.filter((o) => o.value !== form.partnerId)}
              required
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="المبلغ (جنيه)"
            type="number"
            min="1"
            step="0.01"
            value={form.amount}
            onChange={update("amount")}
            required
          />
          <Input
            label="العمولة (اختياري)"
            type="number"
            min="0"
            step="0.01"
            placeholder="محسوبة تلقائيًا"
            value={form.commission}
            onChange={update("commission")}
          />
        </div>

        <Input
          label="الميعاد المتفق عليه (للعملاء الرئيسيين فقط)"
          type="datetime-local"
          value={form.agreedDueAt}
          onChange={update("agreedDueAt")}
        />

        <Input label="ملاحظات" value={form.notes} onChange={update("notes")} />

        {error && (
          <div className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
            <p>{error.response?.data?.message || error.message || "حدث خطأ أثناء تسجيل العملية."}</p>
            {error.response?.data?.errors?.length > 0 && (
              <ul className="mt-1 list-inside list-disc">
                {error.response.data.errors.map((item, index) => (
                  <li key={`${item.field || "error"}-${index}`}>
                    {item.message || item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <SubmitButton isLoading={isPending}>تسجيل العملية</SubmitButton>
      </form>
    </Modal>
  );
}