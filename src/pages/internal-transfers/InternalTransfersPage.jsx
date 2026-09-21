import { useMemo, useState } from "react";
import { ArrowDownUp, CheckCircle2, Plus, RefreshCw, WalletCards, X } from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Spinner from "../../components/ui/Spinner";
import Modal from "../../components/ui/Modal";
import { formatEGP, egpToPiasters } from "../../utils/money";
import { CHANNEL_LABELS } from "../../constants/channels";
import { useCreateTransfer, useTransferAccounts, useTransfers } from "../../hooks/internal-transfers/useInternalTransfers";

const EMPTY_FORM = { source: "", sourceWallet: "", target: "", targetWallet: "", asset: "liquidity", amount: "", notes: "" };
const ASSET_LABELS = { liquidity: "سيولة نقدية", wallet: "رصيد محفظة" };
const ownerValue = (account) => `${account.type}:${account.id}`;
const walletBalance = (wallet, asset) => (asset === "wallet" ? wallet.walletBalance : wallet.liquidityBalance);

function accountLabel(account) {
  return `${account.name} — ${account.type === "User" ? "أدمن" : "شريك"}`;
}
function walletLabel(wallet, asset) {
  return `${wallet.phoneNumber} · ${CHANNEL_LABELS[wallet.channel] || wallet.channel} · متاح ${formatEGP(walletBalance(wallet, asset))}`;
}

export default function InternalTransfersPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const { data: accounts = [], isLoading: accountsLoading, refetch } = useTransferAccounts();
  const { data: transfers, isLoading: transfersLoading } = useTransfers({ page: 1, size: 30 });
  const createTransfer = useCreateTransfer();

  const sourceAccount = accounts.find((account) => ownerValue(account) === form.source);
  const targetAccount = accounts.find((account) => ownerValue(account) === form.target);
  const sourceWallet = sourceAccount?.wallets?.find((wallet) => wallet.id === form.sourceWallet);
  const targetWallet = targetAccount?.wallets?.find((wallet) => wallet.id === form.targetWallet);
  const amountPiasters = egpToPiasters(form.amount || 0);
  const sourceAvailable = sourceWallet ? walletBalance(sourceWallet, form.asset) : 0;
  const isValid = Boolean(sourceAccount && targetAccount && sourceWallet && targetWallet && form.source !== form.target && amountPiasters > 0 && sourceAvailable >= amountPiasters);

  const sourceOptions = useMemo(() => accounts.map((account) => ({ value: ownerValue(account), label: accountLabel(account) })), [accounts]);
  const targetOptions = useMemo(() => accounts.filter((account) => ownerValue(account) !== form.source).map((account) => ({ value: ownerValue(account), label: accountLabel(account) })), [accounts, form.source]);
  const reset = () => { setForm(EMPTY_FORM); setError(""); setIsOpen(false); };
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const handleSource = (value) => setForm((current) => ({ ...current, source: value, sourceWallet: "" }));
  const handleTarget = (value) => setForm((current) => ({ ...current, target: value, targetWallet: "" }));
  const handleAsset = (value) => setForm((current) => ({ ...current, asset: value, sourceWallet: "", targetWallet: "" }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!isValid) {
      setError(form.source === form.target ? "اختار حسابًا مختلفًا للوجهة." : "راجع الحسابات والمحافظ والمبلغ المتاح قبل التنفيذ.");
      return;
    }
    try {
      await createTransfer.mutateAsync({
        sourceOwnerType: sourceAccount.type,
        sourceOwnerId: sourceAccount.id,
        sourceWalletId: sourceWallet.id,
        targetOwnerType: targetAccount.type,
        targetOwnerId: targetAccount.id,
        targetWalletId: targetWallet.id,
        asset: form.asset,
        amount: amountPiasters,
        notes: form.notes,
      });
      reset();
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تنفيذ التحويل.");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">التحويلات الداخلية</h1>
          <p className="mt-1 text-sm text-white/60">نقل السيولة أو رصيد المحفظة بين حسابات الأدمن والشركاء بدون تغيير إجمالي رأس المال.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetch()} className="rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:bg-bg-raised" title="تحديث الأرصدة"><RefreshCw size={17} /></button>
          <button onClick={() => { setForm(EMPTY_FORM); setError(""); setIsOpen(true); }} className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"><Plus size={17} /> تحويل جديد</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><div className="flex items-center gap-3"><div className="rounded-xl bg-accent-soft p-3 text-accent"><ArrowDownUp size={21} /></div><div><p className="text-sm text-text-secondary">نقل داخلي آمن</p><p className="mt-1 font-semibold">بين حسابات المكتب</p></div></div></Card>
        <Card><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-500/10 p-3 text-blue-400"><WalletCards size={21} /></div><div><p className="text-sm text-text-secondary">لا يؤثر على</p><p className="mt-1 font-semibold">إجمالي رأس المال</p></div></div></Card>
        <Card><div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400"><CheckCircle2 size={21} /></div><div><p className="text-sm text-text-secondary">التسجيل</p><p className="mt-1 font-semibold">سجل قبل وبعد التحويل</p></div></div></Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">سجل التحويلات</h2><span className="text-xs text-text-muted">آخر 30 تحويل</span></div>
        {transfersLoading ? <div className="flex justify-center py-12"><Spinner /></div> : !transfers?.result?.length ? <p className="py-10 text-center text-sm text-text-secondary">لا توجد تحويلات داخلية مسجلة حتى الآن.</p> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-right text-sm"><thead><tr className="border-b border-border text-text-secondary"><th className="px-3 py-3">من</th><th className="px-3 py-3">إلى</th><th className="px-3 py-3">النوع</th><th className="px-3 py-3">المبلغ</th><th className="px-3 py-3">التاريخ</th></tr></thead><tbody>{transfers.result.map((item) => <tr key={item._id} className="border-b border-border/60 last:border-0"><td className="px-3 py-4"><p className="font-medium">{item.sourceOwner?.name || "—"}</p><p className="text-xs text-text-secondary">{item.sourcePhoneNumber}</p></td><td className="px-3 py-4"><p className="font-medium">{item.targetOwner?.name || "—"}</p><p className="text-xs text-text-secondary">{item.targetPhoneNumber}</p></td><td className="px-3 py-4">{ASSET_LABELS[item.asset]}</td><td className="px-3 py-4 font-bold text-accent">{formatEGP(item.amount)}</td><td className="px-3 py-4 text-text-secondary">{new Date(item.createdAt).toLocaleString("ar-EG")}</td></tr>)}</tbody></table></div>
        )}
      </Card>

      <Modal title="تحويل داخلي جديد" isOpen={isOpen} onClose={reset}>
        <form onSubmit={submit} className="space-y-4">
          {accountsLoading ? <div className="flex justify-center py-8"><Spinner /></div> : <>
            <div className="rounded-xl border border-accent/20 bg-accent-soft p-3 text-sm text-text-secondary">سيتم خصم المبلغ من محفظة المصدر وإضافته لمحفظة الوجهة. إجمالي رأس المال لا يتغير.</div>
            <Select label="من الحساب" placeholder="اختر الحساب المصدر" value={form.source} onChange={(e) => handleSource(e.target.value)} options={sourceOptions} required />
            <Select label="محفظة المصدر" placeholder={sourceAccount ? "اختر الرقم/الشريحة" : "اختر الحساب أولًا"} value={form.sourceWallet} onChange={(e) => update("sourceWallet", e.target.value)} options={(sourceAccount?.wallets || []).map((wallet) => ({ value: wallet.id, label: walletLabel(wallet, form.asset) }))} disabled={!sourceAccount} required />
            <Select label="إلى الحساب" placeholder="اختر الحساب المستلم" value={form.target} onChange={(e) => handleTarget(e.target.value)} options={targetOptions} disabled={!form.source} required />
            <Select label="محفظة الوجهة" placeholder={targetAccount ? "اختر الرقم/الشريحة" : "اختر الحساب أولًا"} value={form.targetWallet} onChange={(e) => update("targetWallet", e.target.value)} options={(targetAccount?.wallets || []).map((wallet) => ({ value: wallet.id, label: walletLabel(wallet, form.asset) }))} disabled={!targetAccount} required />
            <Select label="نوع الرصيد" value={form.asset} onChange={(e) => handleAsset(e.target.value)} options={Object.entries(ASSET_LABELS).map(([value, label]) => ({ value, label }))} />
            <Input label="المبلغ (جنيه)" type="number" min="1" step="0.01" value={form.amount} onChange={(e) => update("amount", e.target.value)} placeholder="مثال: 500" required />
            {sourceWallet && <p className="-mt-2 text-xs text-text-secondary">المتاح في المصدر: <strong className="text-text-primary">{formatEGP(sourceAvailable)}</strong></p>}
            <Input label="ملاحظات (اختياري)" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="سبب التحويل أو أي توضيح" />
            {sourceWallet && targetWallet && amountPiasters > 0 && <div className="rounded-xl border border-border bg-bg-raised p-4 text-sm"><p className="mb-2 font-semibold">مراجعة التحويل</p><p>تحويل <strong className="text-accent">{formatEGP(amountPiasters)}</strong> {ASSET_LABELS[form.asset]} من <strong>{sourceAccount.name}</strong> إلى <strong>{targetAccount.name}</strong>.</p><p className="mt-1 text-text-secondary">رصيد المصدر بعد التنفيذ: {formatEGP(Math.max(0, sourceAvailable - amountPiasters))}</p></div>}
            {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
            <div className="flex gap-3"><button type="button" onClick={reset} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-bg-raised">إلغاء</button><button type="submit" disabled={createTransfer.isPending} className="flex-1 rounded-lg bg-accent px-4 py-2.5 font-medium text-bg disabled:opacity-60">{createTransfer.isPending ? "جاري التنفيذ..." : "تأكيد التحويل"}</button></div>
          </>}
        </form>
      </Modal>
    </div>
  );
}
