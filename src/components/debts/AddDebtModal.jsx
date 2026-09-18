import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SubmitButton from "../ui/SubmitButton";
import { useCreateDebt } from "../../hooks/debts/useCreateDebt";
import { usePartners } from "../../hooks/partners/usePartners";
import { useClients } from "../../hooks/clients/useClients";
import { DEBT_DIRECTION_OPTIONS, DEBT_DIRECTIONS } from "../../constants/debt";
import { PARTY_TYPES, PARTY_TYPE_LABELS } from "../../constants/partyTypes";
import { egpToPiasters } from "../../utils/money";

const initialForm = {
  direction: DEBT_DIRECTIONS.OWED_TO_ME,
  partyType: PARTY_TYPES.CLIENT,
  partyId: "",
  amount: "",
  description: "",
  dueDate: "",
};

export default function AddDebtModal({ isOpen, onClose }) {
  const [form, setForm] = useState(initialForm);
  const { data: partners } = usePartners({ isActive: true });
  const { data: clientsResult } = useClients({ isActive: true });
  const clients = clientsResult?.result || [];

  const { mutate: createDebt, isPending, error } = useCreateDebt();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    createDebt(
      {
        direction: form.direction,
        partyType: form.partyType,
        partyId: form.partyId,
        amount: egpToPiasters(form.amount),
        description: form.description,
        ...(form.dueDate && { dueDate: new Date(form.dueDate).toISOString() }),
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
    <Modal title="إضافة دين" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="نوع الدين"
          value={form.direction}
          onChange={update("direction")}
          options={DEBT_DIRECTION_OPTIONS}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="مرتبط بـ"
            value={form.partyType}
            onChange={(e) => setForm((f) => ({ ...f, partyType: e.target.value, partyId: "" }))}
            options={Object.values(PARTY_TYPES).map((v) => ({ value: v, label: PARTY_TYPE_LABELS[v] }))}
          />

          {form.partyType === PARTY_TYPES.CLIENT ? (
            <Select
              label="العميل"
              placeholder="اختر العميل"
              value={form.partyId}
              onChange={update("partyId")}
              options={clients.map((c) => ({ value: c._id, label: c.name }))}
              required
            />
          ) : (
            <Select
              label="الشريك"
              placeholder="اختر الشريك"
              value={form.partyId}
              onChange={update("partyId")}
              options={(partners || []).map((p) => ({ value: p._id, label: p.name }))}
              required
            />
          )}
        </div>

        <Input
          label="المبلغ (جنيه)"
          type="number"
          min="1"
          step="0.01"
          value={form.amount}
          onChange={update("amount")}
          required
        />

        <Input label="الوصف (اختياري)" value={form.description} onChange={update("description")} />

        <Input
          label="تاريخ الاستحقاق (اختياري)"
          type="date"
          value={form.dueDate}
          onChange={update("dueDate")}
        />

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء إضافة الدين."}
          </p>
        )}

        <SubmitButton isLoading={isPending}>إضافة</SubmitButton>
      </form>
    </Modal>
  );
}