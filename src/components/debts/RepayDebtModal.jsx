import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SubmitButton from "../ui/SubmitButton";
import { useRepayDebt } from "../../hooks/debts/useRepayDebt";
import { usePartners } from "../../hooks/partners/usePartners";
import { CHANNEL_OPTIONS } from "../../constants/channels";
import { BALANCE_TYPE_OPTIONS } from "../../constants/balanceTypes";
import { egpToPiasters } from "../../utils/money";

const initialForm = {
  amount: "",
  notes: "",
  affectsCapital: false,
  partnerId: "",
  channel: CHANNEL_OPTIONS[0]?.value || "",
  phoneNumber: "",
  balanceType: "",
};

export default function RepayDebtModal({ debt, isOpen, onClose }) {
  const [form, setForm] = useState(initialForm);
  const { data: partners } = usePartners({ isActive: true });
  const { mutate: repayDebt, isPending, error } = useRepayDebt(debt?._id);

  const selectedPartner = partners?.find((p) => p._id === form.partnerId);
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    repayDebt(
      {
        amount: egpToPiasters(form.amount),
        notes: form.notes,
        affectsCapital: form.affectsCapital,
        ...(form.affectsCapital && {
          partnerId: form.partnerId,
          channel: form.channel,
          phoneNumber: form.phoneNumber,
          balanceType: form.balanceType,
        }),
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          onClose();
        },
      }
    );
  };

  if (!debt) return null;

  return (
    <Modal title={`سداد دين — ${debt.description || "بدون وصف"}`} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="قيمة السداد (جنيه)"
          type="number"
          min="1"
          step="0.01"
          value={form.amount}
          onChange={update("amount")}
          required
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.affectsCapital}
            onChange={(e) => setForm((f) => ({ ...f, affectsCapital: e.target.checked }))}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          يأثر على رأس المال (يخصم/يضيف من رصيد شريك فعليًا)
        </label>

        {form.affectsCapital && (
          <div className="space-y-4 rounded-lg border border-border p-3">
            <Select
              label="الشريك"
              placeholder="اختر الشريك"
              value={form.partnerId}
              onChange={(e) =>
                setForm((f) => ({ ...f, partnerId: e.target.value, phoneNumber: "" }))
              }
              options={(partners || []).map((p) => ({ value: p._id, label: p.name }))}
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
            <Select
              label="نوع الرصيد"
              placeholder="اختر نوع الرصيد"
              value={form.balanceType}
              onChange={update("balanceType")}
              options={BALANCE_TYPE_OPTIONS}
              required
            />
          </div>
        )}

        <Input label="ملاحظات (اختياري)" value={form.notes} onChange={update("notes")} />

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء تسجيل السداد."}
          </p>
        )}

        <SubmitButton isLoading={isPending}>تسجيل السداد</SubmitButton>
      </form>
    </Modal>
  );
}