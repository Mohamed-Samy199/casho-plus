import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Plus,
  RefreshCw,
  RotateCcw,
  XCircle,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { formatEGP, egpToPiasters } from "../../utils/money";
import { CHANNEL_LABELS } from "../../constants/channels";
import { useExpenseAccounts } from "../../hooks/expenses/useExpenses";
import {
  useCreatePendingFund,
  usePendingFunds,
  useReturnPendingFund,
  useWriteOffPendingFund,
} from "../../hooks/pending-funds/usePendingFunds";

const REASONS = {
  customer_mistake: "خطأ من العميل",
  provider_issue: "مشكلة من الشركة",
  wrong_transfer: "تحويل تم إرساله بالخطأ",
  technical_issue: "خطأ أو انقطاع تقني",
  other: "سبب آخر",
};
const RECOVERY = {
  customer: "العميل",
  provider: "الشركة",
  none: "غير متوقع إرجاعه",
};
const STATUS = {
  pending: "معلق",
  partially_returned: "تم رد جزء",
  returned: "تم رده بالكامل",
  written_off: "غير قابل للاسترداد",
};
const EMPTY = {
  source: "",
  sourceWallet: "",
  amount: "",
  reason: "customer_mistake",
  recoveryOwner: "customer",
  expectedReturnAt: "",
  transactionReference: "",
  notes: "",
};
const ownerValue = (account) => `${account.type}:${account.id}`;
const accountLabel = (account) =>
  `${account.name} — ${account.type === "Partner" ? "شريك" : account.role === "partner" ? "شريك" : account.role === "admin" ? "أدمن" : "موظف"}`;

const walletLabel = (wallet) =>
  `${wallet.phoneNumber} · ${CHANNEL_LABELS[wallet.channel] || wallet.channel} · الرصيد ${formatEGP(wallet.walletBalance || 0)}`;

function ReturnModal({ item, onClose }) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const mutation = useReturnPendingFund();
  const validationMessage = () => {
    const errors = mutation.error?.response?.data?.errors;
    if (Array.isArray(errors))
      return errors
        .map((error) =>
          typeof error === "string"
            ? error
            : error?.message || JSON.stringify(error),
        )
        .join("، ");
    if (errors && typeof errors === "object")
      return Object.values(errors)
        .map((error) =>
          typeof error === "string"
            ? error
            : error?.message || JSON.stringify(error),
        )
        .join("، ");
    const message = mutation.error?.response?.data?.message;
    return typeof message === "string"
      ? message
      : message
        ? JSON.stringify(message)
        : "تعذر تسجيل الإرجاع.";
  };
  const submit = async (event) => {
    event.preventDefault();
    try {
      const data = { amount: egpToPiasters(amount) };
      if (notes.trim()) data.notes = notes.trim();
      await mutation.mutateAsync({ id: item._id, data });
      onClose();
    } catch (error) {
      /* يتم عرض الخطأ داخل النافذة */
    }
  };
  return (
    <Modal title="تسجيل إرجاع أموال معلقة" isOpen onClose={onClose}>
      <form onSubmit={submit} className="space-y-4" dir="rtl">
        <div className="rounded-xl border border-accent/20 bg-accent-soft p-3 text-sm">
          المتبقي: <strong>{formatEGP(item.remainingAmount)}</strong>
        </div>
        <Input
          label="المبلغ الذي تم إرجاعه (جنيه)"
          type="number"
          min="0.01"
          max={item.remainingAmount / 100}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Input
          label="ملاحظات (اختياري)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-2.5"
          >
            إلغاء
          </button>
          <button
            disabled={mutation.isPending}
            className="flex-1 rounded-lg bg-accent px-4 py-2.5 font-medium text-bg"
          >
            {mutation.isPending ? "جاري الحفظ..." : "تأكيد الإرجاع"}
          </button>
        </div>
        {mutation.isError && (
          <p className="text-sm text-danger">{validationMessage()}</p>
        )}
      </form>
    </Modal>
  );
}

export default function PendingFundsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [returnItem, setReturnItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const { data: accounts = [], isLoading: accountsLoading } =
    useExpenseAccounts();
  const { data, isLoading, isError, refetch } = usePendingFunds({
    page: 1,
    size: 100,
  });
  const createMutation = useCreatePendingFund();
  const writeOffMutation = useWriteOffPendingFund();
  const sourceAccount = accounts.find(
    (account) => ownerValue(account) === form.source,
  );
  const sourceWallet = sourceAccount?.wallets?.find(
    (wallet) => String(wallet.id) === String(form.sourceWallet),
  );
  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const reset = () => {
    setForm(EMPTY);
    setError("");
    setIsOpen(false);
  };
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!sourceAccount || !sourceWallet)
      return setError("اختر الحساب والرقم المرتبط بالعملية.");
    try {
      await createMutation.mutateAsync({
        sourceOwnerType: sourceAccount.type,
        sourceOwnerId: sourceAccount.id,
        sourceWalletId: sourceWallet.id,
        amount: egpToPiasters(form.amount),
        reason: form.reason,
        recoveryOwner: form.recoveryOwner,
        expectedReturnAt: form.expectedReturnAt
          ? new Date(`${form.expectedReturnAt}T00:00:00`).toISOString()
          : undefined,
        transactionReference: form.transactionReference,
        notes: form.notes,
      });
      reset();
    } catch (err) {
      setError(err.response?.data?.message || "تعذر تسجيل الأموال المعلقة.");
    }
  };
  const writeOff = async (item) => {
    if (!window.confirm("هل تريد اعتبار المبلغ غير قابل للاسترداد؟")) return;
    await writeOffMutation.mutateAsync({
      id: item._id,
      data: { notes: "تم اعتبار المبلغ غير قابل للاسترداد." },
    });
  };
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">الأموال المعلقة</h1>
          <p className="mt-1 text-sm text-white/60">
            تابع المبالغ التي خرجت من المكتب بسبب فشل أو خطأ في عملية تحويل، حتى
            يتم ردها أو إغلاقها.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="rounded-lg border border-border px-3 py-2 text-text-secondary"
            title="تحديث"
          >
            <RefreshCw size={17} />
          </button>
          <button
            onClick={() => {
              setForm(EMPTY);
              setError("");
              setIsOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg"
          >
            <Plus size={17} /> تسجيل مبلغ معلق
          </button>
        </div>
      </div>
      <div className="flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">
        <AlertTriangle className="mt-0.5 shrink-0" size={19} />
        <p>
          <strong>تنبيه محاسبي:</strong> عند تسجيل المبلغ كمعلق سيتم خصمه من
          رصيد المحفظة مباشرة. وعند تسجيل الإرجاع سيُضاف الجزء المرتجع فقط إلى
          المحفظة وتظهر الحركة في الخزينة.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-text-secondary">المبالغ المفتوحة</p>
          <p className="mt-1 text-2xl font-black">
            {formatEGP(
              (data?.result || [])
                .filter((x) =>
                  ["pending", "partially_returned"].includes(x.status),
                )
                .reduce((sum, x) => sum + x.remainingAmount, 0),
            )}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">تنتظر إرجاعًا من العميل</p>
          <p className="mt-1 text-2xl font-black">
            {formatEGP(
              (data?.result || [])
                .filter(
                  (x) =>
                    x.recoveryOwner === "customer" &&
                    ["pending", "partially_returned"].includes(x.status),
                )
                .reduce((sum, x) => sum + x.remainingAmount, 0),
            )}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary">تنتظر إرجاعًا من الشركة</p>
          <p className="mt-1 text-2xl font-black">
            {formatEGP(
              (data?.result || [])
                .filter(
                  (x) =>
                    x.recoveryOwner === "provider" &&
                    ["pending", "partially_returned"].includes(x.status),
                )
                .reduce((sum, x) => sum + x.remainingAmount, 0),
            )}
          </p>
        </Card>
      </div>
      <Card>
        <h2 className="font-semibold">سجل الأموال المعلقة</h2>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : isError ? (
          <p className="py-10 text-center text-danger">
            تعذر تحميل الأموال المعلقة.
          </p>
        ) : !data?.result?.length ? (
          <p className="py-10 text-center text-text-secondary">
            لا توجد أموال معلقة.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[1250px] text-right text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary">
                  <th className="px-3 py-3">التاريخ</th>
                  <th className="px-3 py-3">الحساب / القناة</th>
                  <th className="px-3 py-3">المبلغ</th>
                  <th className="px-3 py-3">السبب</th>
                  <th className="px-3 py-3">المسؤول عن الرد</th>
                  <th className="px-3 py-3">موعد الرد</th>
                  <th className="px-3 py-3">الحالة</th>
                  <th className="px-3 py-3">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {data.result.map((item) => (
                  <tr key={item._id} className="border-b border-border/60">
                    <td className="px-3 py-4 text-text-secondary">
                      {new Date(item.createdAt).toLocaleString("ar-EG")}
                    </td>
                    <td className="px-3 py-4">
                      <p className="font-medium">
                        {item.sourceOwner?.name || "—"}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {CHANNEL_LABELS[item.channel] || item.channel} ·{" "}
                        {item.phoneNumber}
                      </p>
                    </td>
                    <td className="px-3 py-4 font-bold">
                      {formatEGP(item.amount)}
                      <p className="text-xs font-normal text-amber-400">
                        متبقي: {formatEGP(item.remainingAmount)}
                      </p>
                    </td>
                    <td className="px-3 py-4">{REASONS[item.reason]}</td>
                    <td className="px-3 py-4">
                      {RECOVERY[item.recoveryOwner]}
                    </td>
                    <td className="px-3 py-4">
                      {item.expectedReturnAt
                        ? new Date(item.expectedReturnAt).toLocaleDateString(
                            "ar-EG",
                          )
                        : "غير محدد"}
                    </td>
                    <td className="px-3 py-4">
                      <span className="rounded-full bg-bg-raised px-2.5 py-1 text-xs">
                        {STATUS[item.status]}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex gap-2">
                        {["pending", "partially_returned"].includes(
                          item.status,
                        ) && (
                          <>
                            <button
                              onClick={() => setReturnItem(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-accent/40 px-2.5 py-1.5 text-xs text-accent"
                            >
                              <RotateCcw size={14} /> تسجيل رد
                            </button>
                            <button
                              onClick={() => writeOff(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-danger/40 px-2.5 py-1.5 text-xs text-danger"
                            >
                              <XCircle size={14} /> خسارة
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Modal title="تسجيل أموال معلقة" isOpen={isOpen} onClose={reset}>
        <form onSubmit={submit} className="space-y-4" dir="rtl">
          {accountsLoading ? (
            <Spinner />
          ) : (
            <>
              <Select
                label="صاحب الحساب"
                placeholder="اختر الأدمن أو الشريك"
                value={form.source}
                onChange={(e) =>
                  setForm((c) => ({
                    ...c,
                    source: e.target.value,
                    sourceWallet: "",
                  }))
                }
                options={accounts.map((account) => ({
                  value: ownerValue(account),
                  label: accountLabel(account),
                }))}
                required
              />
              <Select
                label="الرقم / القناة"
                placeholder={
                  sourceAccount ? "اختر الرقم والمحفظة" : "اختر الحساب أولًا"
                }
                value={form.sourceWallet}
                onChange={(e) => update("sourceWallet", e.target.value)}
                options={(sourceAccount?.wallets || []).map((wallet) => ({
                  value: wallet.id,
                  label: walletLabel(wallet),
                }))}
                disabled={!sourceAccount}
                required
              />
              <Input
                label="المبلغ الذي سيتم تعليقه وخصمه (جنيه)"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                required
              />
              <Select
                label="سبب التعليق"
                value={form.reason}
                onChange={(e) => update("reason", e.target.value)}
                options={Object.entries(REASONS).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
              <Select
                label="المسؤول المتوقع عن الإرجاع"
                value={form.recoveryOwner}
                onChange={(e) => update("recoveryOwner", e.target.value)}
                options={Object.entries(RECOVERY).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
              <Input
                label="موعد الإرجاع المتوقع (اختياري)"
                type="date"
                value={form.expectedReturnAt}
                onChange={(e) => update("expectedReturnAt", e.target.value)}
              />
              <Input
                label="رقم العملية أو الشكوى (اختياري)"
                value={form.transactionReference}
                onChange={(e) => update("transactionReference", e.target.value)}
              />
              <Input
                label="ملاحظات"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
              <p className="rounded-lg bg-bg-raised p-3 text-xs text-text-secondary">
                سيتم خصم هذا المبلغ من رصيد المحفظة عند الحفظ، ثم يُضاف فقط
                الجزء الذي يتم إرجاعه.
              </p>
              {error && (
                <p className="rounded-lg bg-danger/10 p-3 text-sm text-danger">
                  {error}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5"
                >
                  إلغاء
                </button>
                <button
                  disabled={createMutation.isPending}
                  className="flex-1 rounded-lg bg-accent px-4 py-2.5 font-medium text-bg"
                >
                  {createMutation.isPending ? "جاري الحفظ..." : "تسجيل المبلغ"}
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
      {returnItem && (
        <ReturnModal item={returnItem} onClose={() => setReturnItem(null)} />
      )}
    </div>
  );
}
