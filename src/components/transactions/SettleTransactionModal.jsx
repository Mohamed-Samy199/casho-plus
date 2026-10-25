import { useEffect, useMemo, useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SubmitButton from "../ui/SubmitButton";
import { useSettleTransaction } from "../../hooks/transactions/useSettleTransaction";
import { useUsers } from "../../hooks/users/useUsers";
import { usePartners } from "../../hooks/partners/usePartners";
import { formatEGP, egpToPiasters } from "../../utils/money";
import { CHANNEL_LABELS } from "../../constants/channels";
import { buildOwnerAccounts } from "../../utils/accountOptions";

const PAYMENT_METHODS = [
  { value: "liquidity", label: "سيولة نقدية" },
  { value: "vodafone_cash", label: "فودافون كاش" },
  { value: "instapay", label: "إنستا باي" },
];

export default function SettleTransactionModal({
  transaction,
  isOpen,
  onClose,
}) {
  const remaining = transaction.remainingAmount ?? transaction.amount;
  const { data: users = [] } = useUsers({ enabled: isOpen });
  const { data: partners = [] } = usePartners();
  const [amount, setAmount] = useState(String(remaining / 100));
  const [commission, setCommission] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("liquidity");
  const [account, setAccount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState(null);
  const { mutate, isPending, error } = useSettleTransaction(transaction._id);
  const accounts = useMemo(
    () => buildOwnerAccounts(users, partners),
    [users, partners],
  );
  const selected = accounts.find((item) => item.value === account);
  const phones = selected?.phoneNumbers || [];

  useEffect(() => {
    if (!isOpen) return;
    const ownerId =
      transaction.owner?._id ||
      transaction.owner ||
      transaction.partner?._id ||
      transaction.partner ||
      "";
    const value = `${transaction.ownerType || (transaction.partner ? "Partner" : "User")}:${ownerId}`;
    setAccount(value);
    setPhoneNumber(transaction.phoneNumber || "");
    setAmount(String(remaining / 100));
    setCommission("0");
    setPaymentMethod("liquidity");
    setIdempotencyKey(null);
  }, [isOpen, transaction?._id, remaining]);

  useEffect(() => {
    if (selected && !selected.phoneNumbers?.includes(phoneNumber))
      setPhoneNumber(selected.phoneNumbers?.[0] || "");
  }, [account, selected?._id]);

  const submit = (event) => {
    event.preventDefault();
    const value = egpToPiasters(amount);
    const fee = egpToPiasters(commission);
    if (!value || value > remaining) return;
    const [ownerType, ownerId] = account.split(":");
    const data = { amount: value, commission: fee, paymentMethod };
    if (paymentMethod !== "liquidity")
      Object.assign(data, { ownerType, ownerId, phoneNumber });
    const requestKey =
      idempotencyKey ||
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random()}`;
    if (!idempotencyKey) setIdempotencyKey(requestKey);
    mutate({ data, idempotencyKey: requestKey }, { onSuccess: onClose });
  };

  return (
    <Modal title="تسجيل سداد العميل الرئيسي" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4" dir="rtl">
        <div className="rounded-xl bg-bg-raised p-3 text-sm text-text-secondary">
          <p>
            المتبقي من أصل الدين:{" "}
            <strong className="text-text-primary">
              {formatEGP(remaining)}
            </strong>
          </p>
          {transaction.agreedDueAt && (
            <p className="mt-1">
              تاريخ الاستحقاق:{" "}
              {new Date(transaction.agreedDueAt).toLocaleDateString("ar-EG")}
            </p>
          )}
          <p className="mt-1">
            لا توجد عمولة تأخير تلقائية. العمولة هنا تُدخل يدويًا وتُضاف فوق أصل
            السداد.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="أصل المبلغ المسدد (جنيه)"
            type="number"
            min="0.01"
            max={remaining / 100}
            step="0.01"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setIdempotencyKey(null);
            }}
            required
          />
          <Input
            label="العمولة الإضافية (جنيه)"
            type="number"
            min="0"
            step="0.01"
            value={commission}
            onChange={(event) => {
              setCommission(event.target.value);
              setIdempotencyKey(null);
            }}
          />
          <Select
            label="طريقة السداد"
            value={paymentMethod}
            onChange={(event) => {
              setPaymentMethod(event.target.value);
              setIdempotencyKey(null);
            }}
            options={PAYMENT_METHODS}
          />
          {paymentMethod !== "liquidity" && (
            <Select
              label="الحساب المستفيد"
              value={account}
              onChange={(event) => {
                setAccount(event.target.value);
                setIdempotencyKey(null);
              }}
              options={accounts.map((item) => ({
                value: item.value,
                label: item.label,
              }))}
              placeholder="اختر الحساب"
            />
          )}
          {paymentMethod !== "liquidity" && (
            <Select
              label="الرقم"
              value={phoneNumber}
              onChange={(event) => {
                setPhoneNumber(event.target.value);
                setIdempotencyKey(null);
              }}
              options={phones.map((phone) => ({ value: phone, label: phone }))}
              placeholder="اختر الرقم"
            />
          )}
        </div>
        <p className="text-sm text-text-secondary">
          إجمالي ما سيدخل للمكتب:{" "}
          <strong className="text-accent">
            {formatEGP(egpToPiasters(amount) + egpToPiasters(commission))}
          </strong>{" "}
          عبر{" "}
          {paymentMethod === "liquidity"
            ? "السيولة"
            : CHANNEL_LABELS[paymentMethod]}
          .
        </p>
        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.errors
              ?.map((item) => (typeof item === "string" ? item : item.message))
              .join("، ") ||
              error.response?.data?.message ||
              "حدث خطأ أثناء تسجيل السداد."}
          </p>
        )}
        <SubmitButton isLoading={isPending}>تأكيد السداد</SubmitButton>
      </form>
    </Modal>
  );
}
