import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import SubmitButton from "../ui/SubmitButton";
import { useSettleTransaction } from "../../hooks/transactions/useSettleTransaction";
import { formatEGP, egpToPiasters } from "../../utils/money";

export default function SettleTransactionModal({ transaction, isOpen, onClose }) {
  const remaining = transaction.remainingAmount ?? transaction.amount;
  const [amount, setAmount] = useState(String(remaining / 100));
  const { mutate, isPending, error } = useSettleTransaction(transaction._id);

  const submit = (event) => {
    event.preventDefault();
    const value = egpToPiasters(amount);
    if (!value || value > remaining) return;
    mutate(value, { onSuccess: onClose });
  };

  return (
    <Modal title="تسجيل سداد العملية" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-xl bg-bg-raised p-3 text-sm text-text-secondary">
          <p>المتبقي: <strong className="text-text-primary">{formatEGP(remaining)}</strong></p>
          {transaction.agreedDueAt && (
            <p className="mt-1">موعد السداد: {new Date(transaction.agreedDueAt).toLocaleString("ar-EG")}</p>
          )}
          <p className="mt-1">يمكنك إدخال جزء من المبلغ أو المبلغ كاملًا.</p>
        </div>
        <Input
          label="قيمة السداد (جنيه)"
          type="number"
          min="0.01"
          max={remaining / 100}
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />
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
