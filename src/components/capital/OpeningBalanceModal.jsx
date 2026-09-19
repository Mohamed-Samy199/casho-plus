import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SearchableSelect from "../ui/SearchableSelect";
import SubmitButton from "../ui/SubmitButton";
import { usePartners } from "../../hooks/partners/usePartners";
import { useAdjustBalance } from "../../hooks/capital/useAdjustBalance";
import { CHANNEL_OPTIONS } from "../../constants/channels";
import { egpToPiasters } from "../../utils/money";

const initialForm = {
  partnerId: "",
  phoneNumber: "",
  channel: CHANNEL_OPTIONS[0]?.value || "",
  liquidityAmount: "",
  walletAmount: "",
  note: "",
};

export default function OpeningBalanceModal({ isOpen, onClose }) {
  const [form, setForm] = useState(initialForm);
  const { data: partners } = usePartners({ isActive: true });
  const { mutate: adjustBalance, isPending, error } = useAdjustBalance();
  const selectedPartner = partners?.find((partner) => partner._id === form.partnerId);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleClose = () => {
    if (isPending) return;
    setForm(initialForm);
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    adjustBalance(
      {
        partnerId: form.partnerId,
        phoneNumber: form.phoneNumber,
        channel: form.channel,
        liquidityAmount: egpToPiasters(form.liquidityAmount),
        walletAmount: egpToPiasters(form.walletAmount),
        note: form.note,
      },
      { onSuccess: handleClose }
    );
  };

  return (
    <Modal title="إضافة رصيد" isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-text-secondary">
          اترك أي خانة لا تريد زيادتها فارغة. أول إضافة لهذا الرقم تُسجل تلقائيًا كإضافة أولية، وكل إضافة بعدها تُجمع فوق الرصيد الحالي.
        </p>

        <SearchableSelect
          label="الشريك"
          placeholder="اختر الشريك"
          value={form.partnerId}
          onChange={(value) =>
            setForm((current) => ({ ...current, partnerId: value, phoneNumber: "" }))
          }
          options={(partners || []).map((partner) => ({
            value: partner._id,
            label: partner.name,
          }))}
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

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="إضافة سيولة (جنيه)"
            type="number"
            min="0"
            step="0.01"
            placeholder="اختياري"
            value={form.liquidityAmount}
            onChange={update("liquidityAmount")}
          />
          <Input
            label="إضافة رصيد محفظة (جنيه)"
            type="number"
            min="0"
            step="0.01"
            placeholder="اختياري"
            value={form.walletAmount}
            onChange={update("walletAmount")}
          />
        </div>

        <Input label="سبب الإضافة / ملاحظات" value={form.note} onChange={update("note")} />

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
            {error.response?.data?.message || error.message || "حدث خطأ أثناء إضافة الرصيد."}
          </p>
        )}

        <SubmitButton isLoading={isPending}>إضافة الرصيد</SubmitButton>
      </form>
    </Modal>
  );
}