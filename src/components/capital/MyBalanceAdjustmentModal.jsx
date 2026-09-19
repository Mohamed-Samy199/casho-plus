import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SubmitButton from "../ui/SubmitButton";
import { useAuthStore } from "../../store/auth.store";
import { useAdjustMyBalance } from "../../hooks/capital/useAdjustMyBalance";
import { CHANNEL_OPTIONS } from "../../constants/channels";
import { egpToPiasters } from "../../utils/money";

const initialForm = {
  phoneNumber: "",
  channel: CHANNEL_OPTIONS[0]?.value || "",
  liquidityAmount: "",
  walletAmount: "",
  note: "",
};

export default function MyBalanceAdjustmentModal({ isOpen, onClose }) {
  const [form, setForm] = useState(initialForm);
  const user = useAuthStore((state) => state.user);
  const { mutate, isPending, error } = useAdjustMyBalance();
  const userPhoneNumbers = user?.phoneNumbers || [];

  useEffect(() => {
    if (isOpen && !form.phoneNumber && userPhoneNumbers.length > 0) {
      setForm((current) => ({ ...current, phoneNumber: userPhoneNumbers[0] }));
    }
  }, [isOpen, userPhoneNumbers, form.phoneNumber]);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const close = () => {
    if (isPending) return;
    setForm(initialForm);
    onClose();
  };

  const submit = (event) => {
    event.preventDefault();
    mutate(
      {
        phoneNumber: form.phoneNumber || userPhoneNumbers[0] || "",
        channel: form.channel,
        liquidityAmount: egpToPiasters(form.liquidityAmount),
        walletAmount: egpToPiasters(form.walletAmount),
        note: form.note,
      },
      { onSuccess: close }
    );
  };

  return (
    <Modal title="إضافة رصيد مالي لي" isOpen={isOpen} onClose={close}>
      <form onSubmit={submit} className="space-y-4">
        <Select
          label="الرقم/الشريحة"
          value={form.phoneNumber}
          onChange={update("phoneNumber")}
          options={userPhoneNumbers.map((phone) => ({ value: phone, label: phone }))}
          required
        />
        <Select label="الوسيلة" value={form.channel} onChange={update("channel")} options={CHANNEL_OPTIONS} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="إضافة سيولة (جنيه)" type="number" min="0" step="0.01" placeholder="اختياري" value={form.liquidityAmount} onChange={update("liquidityAmount")} />
          <Input label="إضافة رصيد محفظة (جنيه)" type="number" min="0" step="0.01" placeholder="اختياري" value={form.walletAmount} onChange={update("walletAmount")} />
        </div>
        <Input label="سبب الإضافة / ملاحظات" value={form.note} onChange={update("note")} />
        {error && (
          <div className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            <p>{error.response?.data?.message || error.message || "حدث خطأ أثناء الإضافة."}</p>
            {error.response?.data?.errors?.length > 0 && (
              <ul className="mt-1 list-inside list-disc">
                {error.response.data.errors.map((item, index) => (
                  <li key={index}>{item.message || item}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <SubmitButton isLoading={isPending}>إضافة الرصيد</SubmitButton>
      </form>
    </Modal>
  );
}
