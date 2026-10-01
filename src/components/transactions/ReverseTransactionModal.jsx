import { useRef, useState } from "react";
import Modal from "../ui/Modal";
import SubmitButton from "../ui/SubmitButton";
import { useReverseTransaction } from "../../hooks/transactions/useReverseTransaction";
import { createIdempotencyKey } from "../../hooks/transactions/useCreateTransaction";

export default function ReverseTransactionModal({ transaction, isOpen, onClose }) {
  const [reason, setReason] = useState("");
  const idempotencyKeyRef = useRef(null);
  const { mutate, isPending, error } = useReverseTransaction(transaction?._id);

  const submit = (event) => {
    event.preventDefault();
    const idempotencyKey =
      idempotencyKeyRef.current || (idempotencyKeyRef.current = createIdempotencyKey());
    mutate(
      { reason, idempotencyKey },
      {
        onSuccess: () => {
          idempotencyKeyRef.current = null;
          setReason("");
          onClose();
        },
      }
    );
  };

  const close = () => {
    if (!isPending) {
      idempotencyKeyRef.current = null;
      setReason("");
      onClose();
    }
  };

  if (!transaction) return null;

  return (
    <Modal title="عكس العملية" isOpen={isOpen} onClose={close}>
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger">
          سيتم إنشاء عملية جديدة بتأثير مالي عكسي، ولن يتم حذف العملية الأصلية. لا يمكن عكس نفس العملية مرة أخرى.
        </div>
        <div className="rounded-lg bg-bg-raised p-3 text-sm">
          <p>المبلغ: <strong>{(transaction.amount / 100).toLocaleString("ar-EG")} جنيه</strong></p>
          <p className="mt-1 text-text-secondary">يمكن تنفيذ العكس للأدمن فقط.</p>
        </div>
        <label className="block text-sm font-medium">
          سبب العكس (اختياري)
          <textarea
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              idempotencyKeyRef.current = null;
            }}
            maxLength={500}
            rows={3}
            className="mt-2 w-full rounded-lg border border-border bg-bg-surface px-3 py-2 outline-none focus:border-accent"
            placeholder="مثال: تسجيل العملية بالخطأ"
          />
        </label>
        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء عكس العملية."}
          </p>
        )}
        <SubmitButton isLoading={isPending}>تأكيد عكس العملية</SubmitButton>
      </form>
    </Modal>
  );
}
