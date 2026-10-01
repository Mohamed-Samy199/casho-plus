import { useRef, useState } from "react";
import Modal from "../ui/Modal";
import SubmitButton from "../ui/SubmitButton";
import { useCorrectTransaction } from "../../hooks/transactions/useCorrectTransaction";
import { createIdempotencyKey } from "../../hooks/transactions/useCreateTransaction";
import { STAGE_LABELS } from "../../constants/stages";

export default function CorrectTransactionModal({ transaction, isOpen, onClose }) {
  const [targetStage, setTargetStage] = useState("");
  const [reason, setReason] = useState("");
  const idempotencyKeyRef = useRef(null);
  const { mutate, isPending, error } = useCorrectTransaction(transaction?._id);
  const otherStages = Object.entries(STAGE_LABELS).filter(([stage]) => stage !== transaction?.stage);

  const submit = (event) => {
    event.preventDefault();
    const idempotencyKey =
      idempotencyKeyRef.current || (idempotencyKeyRef.current = createIdempotencyKey());
    mutate(
      { targetStage, reason, idempotencyKey },
      {
        onSuccess: () => {
          idempotencyKeyRef.current = null;
          setTargetStage("");
          setReason("");
          onClose();
        },
      }
    );
  };

  const close = () => {
    if (!isPending) {
      idempotencyKeyRef.current = null;
      setTargetStage("");
      setReason("");
      onClose();
    }
  };

  if (!transaction) return null;

  return (
    <Modal title="تصحيح العملية" isOpen={isOpen} onClose={close}>
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger">
          سيتم حفظ العملية الأصلية كما هي، ثم تسجيل قيد عكسي وعملية جديدة بالمرحلة التي تختارها. لا يمكن تصحيح العملية مرة أخرى.
        </div>
        <div className="rounded-lg bg-bg-raised p-3 text-sm">
          <p>المرحلة الحالية: <strong>{STAGE_LABELS[transaction.stage]}</strong></p>
          <p className="mt-1">المبلغ: <strong>{(transaction.amount / 100).toLocaleString("ar-EG")} جنيه</strong></p>
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">اختر المرحلة الصحيحة</legend>
          {otherStages.map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm hover:border-accent">
              <input
                type="radio"
                name="correction-stage"
                value={value}
                checked={targetStage === value}
                onChange={(event) => {
                  setTargetStage(event.target.value);
                  idempotencyKeyRef.current = null;
                }}
                required
                className="accent-accent"
              />
              {label}
            </label>
          ))}
        </fieldset>
        <label className="block text-sm font-medium">
          سبب التصحيح (اختياري)
          <textarea
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              idempotencyKeyRef.current = null;
            }}
            maxLength={500}
            rows={3}
            className="mt-2 w-full rounded-lg border border-border bg-bg-surface px-3 py-2 outline-none focus:border-accent"
            placeholder="مثال: تم اختيار مرحلة العملية بالخطأ"
          />
        </label>
        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء تصحيح العملية."}
          </p>
        )}
        <SubmitButton isLoading={isPending}>تأكيد تصحيح العملية</SubmitButton>
      </form>
    </Modal>
  );
}
