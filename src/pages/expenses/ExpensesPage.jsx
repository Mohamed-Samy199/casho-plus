import { useMemo, useState } from "react";
import {
  Archive,
  Banknote,
  Box,
  CheckCircle2,
  ChevronDown,
  HandCoins,
  Plus,
  RefreshCw,
  RotateCcw,
  ShoppingCart,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import { formatEGP, egpToPiasters } from "../../utils/money";
import { CHANNEL_LABELS } from "../../constants/channels";
import {
  useCreateExpense,
  useExpenseAccounts,
  useExpenses,
  useRepayAdvance,
  useSellAsset,
} from "../../hooks/expenses/useExpenses";

const EMPTY_FORM = {
  category: "outflow",
  description: "",
  source: "",
  sourceWallet: "",
  balanceType: "liquidity",
  amount: "",
  borrower: "",
  notes: "",
};
const CATEGORY_LABELS = {
  asset: "أصل",
  outflow: "خارج / مستهلك",
  advance: "سُلفة",
};
const STATUS_LABELS = {
  active: "قائم",
  sold: "تم البيع",
  partially_repaid: "تم رد جزء",
  repaid: "تم الرد بالكامل",
};
const ASSET_LABELS = { liquidity: "السيولة النقدية", wallet: "رصيد المحفظة" };
const ownerValue = (account) => `${account.type}:${account.id}`;
const getBalance = (wallet, type) =>
  type === "wallet" ? wallet.walletBalance : wallet.liquidityBalance;
const accountLabel = (account) =>
  `${account.name} — ${account.type === "User" ? "أدمن" : "شريك"}`;

function walletLabel(wallet, balanceType) {
  return `${wallet.phoneNumber} · ${CHANNEL_LABELS[wallet.channel] || wallet.channel} · متاح ${formatEGP(getBalance(wallet, balanceType))}`;
}

function SettlementModal({ item, mode, onClose }) {
  const [amount, setAmount] = useState(
    mode === "repay" ? ((item.remainingAmount || 0) / 100).toString() : "",
  );
  const [notes, setNotes] = useState("");
  const repayMutation = useRepayAdvance();
  const sellMutation = useSellAsset();
  const mutation = mode === "repay" ? repayMutation : sellMutation;
  const max = mode === "repay" ? item.remainingAmount : undefined;
  const submit = async (event) => {
    event.preventDefault();
    await mutation.mutateAsync({
      id: item._id,
      data: { amount: egpToPiasters(amount), notes },
    });
    onClose();
  };
  return (
    <Modal
      title={mode === "repay" ? "رد السُلفة" : "تسجيل بيع الأصل"}
      isOpen
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-4" dir="rtl">
        <div className="rounded-xl border border-accent/20 bg-accent-soft p-3 text-sm text-text-secondary">
          {mode === "repay"
            ? `المتبقي من السُلفة: ${formatEGP(item.remainingAmount)}`
            : `قيمة الأصل المسجلة: ${formatEGP(item.amount)}`}
        </div>
        <Input
          label="المبلغ (جنيه)"
          type="number"
          min="0.01"
          step="0.01"
          {...(max ? { max: max / 100 } : {})}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Input
          label="ملاحظات (اختياري)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="أي توضيح إضافي"
        />
        {mutation.isError && (
          <p className="rounded-lg bg-danger/10 p-3 text-sm text-danger">
            {mutation.error?.response?.data?.message || "تعذر تنفيذ العملية."}
          </p>
        )}
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
            className="flex-1 rounded-lg bg-accent px-4 py-2.5 font-medium text-bg disabled:opacity-60"
          >
            {mutation.isPending ? "جاري الحفظ..." : "تأكيد"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function ExpensesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [settlement, setSettlement] = useState(null);
  const [saleDetailsId, setSaleDetailsId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const { data: accounts = [], isLoading: accountsLoading } =
    useExpenseAccounts();
  const {
    data,
    isLoading,
    isError,
    error: listError,
    refetch,
  } = useExpenses({
    page: 1,
    size: 50,
    ...(categoryFilter ? { category: categoryFilter } : {}),
  });
  const createExpense = useCreateExpense();
  const sourceAccount = accounts.find(
    (account) => ownerValue(account) === form.source,
  );
  const borrowerAccount = accounts.find(
    (account) => ownerValue(account) === form.borrower,
  );
  const amountPiasters = egpToPiasters(form.amount);
  const autoLiquidityWallet =
    sourceAccount?.wallets?.find(
      (wallet) => getBalance(wallet, "liquidity") >= amountPiasters,
    ) || sourceAccount?.wallets?.[0];
  const sourceWallet =
    form.balanceType === "liquidity"
      ? autoLiquidityWallet
      : sourceAccount?.wallets?.find(
          (wallet) => String(wallet.id) === String(form.sourceWallet),
        );
  const available = sourceWallet
    ? getBalance(sourceWallet, form.balanceType)
    : 0;
  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
  const reset = () => {
    setForm(EMPTY_FORM);
    setError("");
    setIsOpen(false);
  };
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setError("");
    setIsOpen(true);
  };
  const sourceOptions = useMemo(
    () =>
      accounts.map((account) => ({
        value: ownerValue(account),
        label: accountLabel(account),
      })),
    [accounts],
  );
  const borrowerOptions = useMemo(
    () =>
      accounts
        .filter((account) => ownerValue(account) !== form.source)
        .map((account) => ({
          value: ownerValue(account),
          label: accountLabel(account),
        })),
    [accounts, form.source],
  );
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (
      !sourceAccount ||
      !sourceWallet ||
      amountPiasters < 1 ||
      available < amountPiasters
    ) {
      setError("راجع الحساب والمحفظة والمبلغ المتاح.");
      return;
    }
    if (form.category === "advance" && !borrowerAccount) {
      setError("اختر الشخص الذي أخذ السُلفة.");
      return;
    }
    try {
      await createExpense.mutateAsync({
        category: form.category,
        description: form.description,
        sourceOwnerType: sourceAccount.type,
        sourceOwnerId: sourceAccount.id,
        sourceWalletId: sourceWallet.id,
        balanceType: form.balanceType,
        amount: amountPiasters,
        ...(form.category === "advance"
          ? {
              borrowerType: borrowerAccount.type,
              borrowerId: borrowerAccount.id,
            }
          : {}),
        notes: form.notes,
      });
      reset();
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل المصروف.");
    }
  };
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">المصروفات</h1>
          <p className="mt-1 text-sm text-white/60">
            سجل أصول المكان، الاحتياجات المستهلكة، والسُلف مع أثرها على الأرصدة.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="rounded-lg border border-border px-3 py-2 text-sm text-white hover:bg-accent"
            title="تحديث"
          >
            <RefreshCw size={17} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
          >
            <Plus size={17} /> مصروف جديد
          </button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <Box size={21} />
            </div>
            <div>
              <p className="text-sm text-text-secondary">الأصول</p>
              <p className="mt-1 font-semibold">تجهيزات قابلة للبيع</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
              <Archive size={21} />
            </div>
            <div>
              <p className="text-sm text-text-secondary">الخوارج</p>
              <p className="mt-1 font-semibold">احتياجات مستهلكة</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
              <HandCoins size={21} />
            </div>
            <div>
              <p className="text-sm text-text-secondary">السُلف</p>
              <p className="mt-1 font-semibold">مبالغ قابلة للرد</p>
            </div>
          </div>
        </Card>
      </div>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">سجل المصروفات</h2>
            <p className="text-xs text-text-secondary">
              المبلغ يخصم من المحفظة المحددة، ورد السُلفة أو بيع الأصل يعيده
              إليها.
            </p>
          </div>
          <Select
            className="min-w-44"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: "", label: "كل الفئات" },
              ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : isError ? (
          <p className="py-10 text-center text-danger">
            {listError?.response?.data?.message || "تعذر تحميل المصروفات."}
          </p>
        ) : !data?.result?.length ? (
          <p className="py-10 text-center text-text-secondary">
            لا توجد مصروفات مسجلة.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[1050px] text-right text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary">
                  <th className="px-3 py-3">التاريخ</th>
                  <th className="px-3 py-3">الفئة / البيان</th>
                  <th className="px-3 py-3">المبلغ</th>
                  <th className="px-3 py-3">من الحساب</th>
                  <th className="px-3 py-3">التأثير</th>
                  <th className="px-3 py-3">الحالة</th>
                  <th className="px-3 py-3">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {data.result.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-3 py-4 text-text-secondary">
                      {new Date(item.createdAt).toLocaleString("ar-EG")}
                    </td>
                    <td className="px-3 py-4">
                      <p className="font-medium">
                        {CATEGORY_LABELS[item.category]}
                        {item.assetName ? ` — ${item.assetName}` : ""}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {item.description}
                      </p>
                      {item.borrower?.name && (
                        <p className="mt-1 text-xs text-accent">
                          المستفيد: {item.borrower.name}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-4 font-bold">
                      {formatEGP(item.amount)}
                      {item.category === "advance" &&
                        item.remainingAmount > 0 && (
                          <p className="text-xs font-normal text-accent">
                            متبقي: {formatEGP(item.remainingAmount)}
                          </p>
                        )}
                    </td>
                    <td className="px-3 py-4">
                      <p>{item.sourceOwner?.name || "—"}</p>
                      <p className="text-xs text-text-secondary">
                        {item.sourcePhoneNumber}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-text-secondary">
                      {ASSET_LABELS[item.balanceType]}
                    </td>
                    <td className="px-3 py-4">
                      {item.status === "sold" ? (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setSaleDetailsId((current) =>
                                current === item._id ? null : item._id,
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400"
                          >
                            <CheckCircle2 size={14} /> تم البيع{" "}
                            <ChevronDown size={13} />
                          </button>
                          {saleDetailsId === item._id && (
                            <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-border bg-bg-surface p-3 text-xs shadow-xl">
                              <p className="mb-2 font-semibold text-text-primary">
                                تفاصيل البيع
                              </p>
                              <div className="space-y-1 text-text-secondary">
                                <p>
                                  تم البيع بكام:{" "}
                                  <strong className="text-text-primary">
                                    {formatEGP(
                                      item.soldAmount ||
                                        item.returnedAmount ||
                                        0,
                                    )}
                                  </strong>
                                </p>
                                <p>
                                  تاريخ البيع:{" "}
                                  <strong className="text-text-primary">
                                    {item.soldAt
                                      ? new Date(item.soldAt).toLocaleString(
                                          "ar-EG",
                                        )
                                      : "—"}
                                  </strong>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="rounded-full bg-bg-raised px-2.5 py-1 text-xs">
                          {STATUS_LABELS[item.status]}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      {item.category === "advance" &&
                        item.status !== "repaid" && (
                          <button
                            onClick={() =>
                              setSettlement({ item, mode: "repay" })
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-accent/40 px-2.5 py-1.5 text-xs text-accent hover:bg-accent-soft"
                          >
                            <RotateCcw size={14} /> رد سُلفة
                          </button>
                        )}
                      {item.category === "asset" &&
                        item.status === "active" && (
                          <button
                            onClick={() =>
                              setSettlement({ item, mode: "sell" })
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-400/40 px-2.5 py-1.5 text-xs text-blue-400 hover:bg-blue-500/10"
                          >
                            <ShoppingCart size={14} /> بيع الأصل
                          </button>
                        )}
                      {item.status === "repaid" || item.status === "sold" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle2 size={14} /> مغلق
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Modal title="تسجيل مصروف جديد" isOpen={isOpen} onClose={reset}>
        <form onSubmit={submit} className="space-y-4" dir="rtl">
          {accountsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <>
              <Select
                label="نوع المصروف"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                options={Object.entries(CATEGORY_LABELS).map(
                  ([value, label]) => ({ value, label }),
                )}
              />
              <Input
                label="البيان"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder={
                  form.category === "asset"
                    ? "مثال: شراء تكييف للمكتب"
                    : "مثال: شراء منظفات للمكتب"
                }
                required
              />
              <Select
                label="مصدر المبلغ"
                value={form.balanceType}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    balanceType: e.target.value,
                    sourceWallet: "",
                  }))
                }
                options={Object.entries(ASSET_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
              <Select
                label="الحساب الذي سيدفع"
                placeholder="اختر الأدمن أو الشريك"
                value={form.source}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    source: e.target.value,
                    sourceWallet: "",
                    borrower:
                      current.borrower === e.target.value
                        ? ""
                        : current.borrower,
                  }))
                }
                options={sourceOptions}
                required
              />
              {form.balanceType === "wallet" && (
                <Select
                  label="الرقم / المحفظة"
                  placeholder={
                    sourceAccount ? "اختر الرقم" : "اختر الحساب أولًا"
                  }
                  value={form.sourceWallet}
                  onChange={(e) => update("sourceWallet", e.target.value)}
                  options={(sourceAccount?.wallets || []).map((wallet) => ({
                    value: wallet.id,
                    label: walletLabel(wallet, form.balanceType),
                  }))}
                  disabled={!sourceAccount}
                  required
                />
              )}
              {form.balanceType === "liquidity" && sourceAccount && (
                <p className="rounded-lg bg-bg-raised px-3 py-2 text-xs text-text-secondary">
                  سيتم الخصم من سيولة الحساب تلقائيًا، ولن تحتاج لاختيار رقم
                  المحفظة.
                </p>
              )}
              {form.category === "advance" && (
                <Select
                  label="المستفيد من السُلفة"
                  placeholder="اختر الأدمن أو الشريك"
                  value={form.borrower}
                  onChange={(e) => update("borrower", e.target.value)}
                  options={borrowerOptions}
                  disabled={!form.source}
                  required
                />
              )}
              <Input
                label="المبلغ (جنيه)"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                required
              />
              {sourceWallet && (
                <p className="-mt-2 text-xs text-text-secondary">
                  المتاح: <strong>{formatEGP(available)}</strong>
                </p>
              )}
              <Input
                label="ملاحظات (اختياري)"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
              <div className="rounded-xl border border-accent/20 bg-accent-soft p-3 text-sm text-text-secondary">
                سيتم خصم {form.amount ? formatEGP(amountPiasters) : "المبلغ"} من{" "}
                {ASSET_LABELS[form.balanceType]} للحساب المحدد.
              </div>
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
                  disabled={createExpense.isPending}
                  className="flex-1 rounded-lg bg-accent px-4 py-2.5 font-medium text-bg disabled:opacity-60"
                >
                  {createExpense.isPending ? "جاري الحفظ..." : "تسجيل المصروف"}
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
      {settlement && (
        <SettlementModal
          item={settlement.item}
          mode={settlement.mode}
          onClose={() => setSettlement(null)}
        />
      )}
    </div>
  );
}
