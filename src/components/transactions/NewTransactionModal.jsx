import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SearchableSelect from "../ui/SearchableSelect";
import StageSelector from "./StageSelector";
import SubmitButton from "../ui/SubmitButton";
import { usePartners } from "../../hooks/partners/usePartners";
import { useUsers } from "../../hooks/users/useUsers";
import { useClients } from "../../hooks/clients/useClients";
import { useCreateTransaction } from "../../hooks/transactions/useCreateTransaction";
import { CHANNEL_OPTIONS } from "../../constants/channels";
import { PARTY_TYPES, PARTY_TYPE_LABELS } from "../../constants/partyTypes";
import { egpToPiasters } from "../../utils/money";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";

const initialForm = {
  partnerId: "",
  ownerType: "Partner",
  phoneNumber: "",
  channel: CHANNEL_OPTIONS[0]?.value || "",
  stage: "",
  partyType: PARTY_TYPES.CLIENT,
  partyId: "",
  amount: "",
  commission: "",
  agreedDueAt: "",
  lateCommissionPerThousand: "",
  notes: "",
};

function toLocalDateTimeValue(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function NewTransactionModal({ isOpen, onClose }) {
  const [form, setForm] = useState(initialForm);

  const { data: partners } = usePartners({ isActive: true });
  const currentUser = useAuthStore((s) => s.user);
  const { data: users = [] } = useUsers({ enabled: currentUser?.role === ROLES.ADMIN });
  const { data: clientsResult } = useClients({ isActive: true });
  const clients = clientsResult?.result || [];

  const { mutate: createTransaction, isPending, error } = useCreateTransaction();

  const selectedPartner = partners?.find((p) => p._id === form.partnerId);
  const selectedUser = users?.find((u) => u._id === form.partnerId);
  const selectedOwner = form.ownerType === "User" ? selectedUser : selectedPartner;
  const selectedClient = clients.find((c) => c._id === form.partyId);
  const isKeyClient = form.partyType === PARTY_TYPES.CLIENT && selectedClient?.type === "key_client";
  const partnerOptions = (partners || []).map((p) => ({ value: p._id, label: p.name }));
  const accountOptions = [
    ...(partners || []).map((p) => ({ value: `Partner:${p._id}`, label: `${p.name} — شريك` })),
    ...(currentUser?.role === ROLES.ADMIN
      ? (users || []).map((u) => ({ value: `User:${u._id}`, label: `${u.name} — أدمن` }))
      : currentUser
        ? [{ value: `User:${currentUser._id}`, label: `${currentUser.name} — حسابي` }]
        : []),
  ];
  const clientOptions = clients.map((c) => ({ value: c._id, label: c.name }));

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    createTransaction(
      {
        ownerType: form.ownerType,
        ownerId: form.partnerId,
        phoneNumber: form.phoneNumber,
        channel: form.channel,
        stage: form.stage,
        partyType: form.partyType,
        ...(form.partyType !== PARTY_TYPES.WALK_IN && {
        partyId: form.partyType === PARTY_TYPES.PARTNER ? form.partyId : form.partyId,
        }),
        amount: egpToPiasters(form.amount),
        ...(form.commission !== "" && { commission: egpToPiasters(form.commission) }),
        ...(form.agreedDueAt && { agreedDueAt: new Date(form.agreedDueAt).toISOString() }),
        ...(isKeyClient && form.lateCommissionPerThousand !== "" && {
          lateCommissionPerThousand: egpToPiasters(form.lateCommissionPerThousand),
        }),
        notes: form.notes,
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          onClose();
        },
      }
    );
  };

  return (
    <Modal title="تسجيل عملية جديدة" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="صاحب الحساب المالي"
          placeholder="اختر الشريك أو الأدمن"
          value={`${form.ownerType}:${form.partnerId}`}
          onChange={(event) => {
            const [ownerType, ownerId] = event.target.value.split(":");
            setForm((f) => ({ ...f, ownerType, partnerId: ownerId, phoneNumber: "" }));
          }}
          options={accountOptions}
          required
        />

        <Select
          label="الرقم/الشريحة"
          placeholder="اختر الرقم"
          value={form.phoneNumber}
          onChange={update("phoneNumber")}
          options={(selectedOwner?.phoneNumbers || []).map((phone) => ({
            value: phone,
            label: phone,
          }))}
          disabled={!selectedOwner}
          required
        />

        <Select
          label="الوسيلة"
          value={form.channel}
          onChange={update("channel")}
          options={CHANNEL_OPTIONS}
        />

        <StageSelector
          value={form.stage}
          onChange={(stage) => setForm((f) => ({ ...f, stage }))}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="نوع الطرف الآخر"
            value={form.partyType}
            onChange={(e) => setForm((f) => ({ ...f, partyType: e.target.value, partyId: "" }))}
            options={Object.values(PARTY_TYPES).map((v) => ({ value: v, label: PARTY_TYPE_LABELS[v] }))}
          />

          {form.partyType === PARTY_TYPES.CLIENT ? (
            <SearchableSelect
              label="العميل"
              placeholder="دوّر على عميل"
              value={form.partyId}
              onChange={(val) => {
                const client = clients.find((item) => item._id === val);
                const hours = client?.keyClientSettings?.defaultAgreedHours;
                const defaultFee = client?.keyClientSettings?.defaultLateCommission;
                setForm((f) => ({
                  ...f,
                  partyId: val,
                  agreedDueAt: hours
                    ? toLocalDateTimeValue(new Date(Date.now() + hours * 3600000))
                    : "",
                  lateCommissionPerThousand:
                    defaultFee !== undefined ? String(defaultFee / 100) : "5",
                }));
              }}
              options={clientOptions}
              required
            />
          ) : form.partyType === PARTY_TYPES.PARTNER ? (
            <SearchableSelect
              label="الشريك الآخر"
              placeholder="دوّر على شريك"
              value={form.partyId}
              onChange={(val) => setForm((f) => ({ ...f, partyId: val }))}
              options={partnerOptions.filter((o) => o.value !== form.partnerId)}
              required
            />
          ) : (
            <div className="flex min-h-10 items-center rounded-lg border border-accent/30 bg-accent-soft px-3 text-sm text-accent">
              سيتم تسجيل العملية ماليًا فقط بدون إنشاء ملف أو حفظ بيانات للعميل.
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="المبلغ (جنيه)"
            type="number"
            min="1"
            step="0.01"
            value={form.amount}
            onChange={update("amount")}
            required
          />
          <Input
            label="العمولة (اختياري)"
            type="number"
            min="0"
            step="0.01"
            placeholder="محسوبة تلقائيًا"
            value={form.commission}
            onChange={update("commission")}
          />
        </div>

        {isKeyClient && (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="تاريخ ووقت السداد المتفق عليه"
              type="datetime-local"
              value={form.agreedDueAt}
              onChange={update("agreedDueAt")}
              required
            />
            <Input
              label="العمولة لكل 1000 جنيه / يوم"
              type="number"
              min="0"
              step="0.01"
              value={form.lateCommissionPerThousand}
              onChange={update("lateCommissionPerThousand")}
              required
            />
          </div>
        )}

        <Input label="ملاحظات" value={form.notes} onChange={update("notes")} />

        {error && (
          <div className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
            <p>{error.response?.data?.message || error.message || "حدث خطأ أثناء تسجيل العملية."}</p>
            {error.response?.data?.errors?.length > 0 && (
              <ul className="mt-1 list-inside list-disc">
                {error.response.data.errors.map((item, index) => (
                  <li key={`${item.field || "error"}-${index}`}>
                    {item.message || item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <SubmitButton isLoading={isPending}>تسجيل العملية</SubmitButton>
      </form>
    </Modal>
  );
}
