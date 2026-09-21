import { useEffect, useMemo, useState } from "react";
import Card from "../ui/Card";
import Select from "../ui/Select";
import { usePartners } from "../../hooks/partners/usePartners";
import { useUsers } from "../../hooks/users/useUsers";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";
import { getVoiceSettings, saveVoiceSettings } from "../../utils/voiceCommand";

export default function VoiceCommandSettings() {
  const currentUser = useAuthStore((state) => state.user);
  const { data: partners = [] } = usePartners({ isActive: true });
  const { data: users = [] } = useUsers({ enabled: currentUser?.role === ROLES.ADMIN });
  const [settings, setSettings] = useState({ ownerType: "User", ownerId: currentUser?._id || "", phoneNumber: "" });
  const [saved, setSaved] = useState(false);

  const accounts = useMemo(() => [
    ...(currentUser?.role === ROLES.ADMIN ? users : [currentUser].filter(Boolean)).map((user) => ({ ...user, ownerType: "User", label: `${user.name} — أدمن` })),
    ...partners.map((partner) => ({ ...partner, ownerType: "Partner", label: `${partner.name} — شريك` })),
  ], [currentUser, partners, users]);
  const selected = accounts.find((account) => account.ownerType === settings.ownerType && account._id === settings.ownerId);

  useEffect(() => {
    if (!currentUser?._id) return;
    const fallback = { ownerType: "User", ownerId: currentUser._id, phoneNumber: currentUser.phoneNumbers?.length === 1 ? currentUser.phoneNumbers[0] : "" };
    setSettings(getVoiceSettings(currentUser._id, fallback));
  }, [currentUser?._id]);

  useEffect(() => {
    if (selected && selected.phoneNumbers?.length === 1 && settings.phoneNumber !== selected.phoneNumbers[0]) {
      setSettings((old) => ({ ...old, phoneNumber: selected.phoneNumbers[0] }));
    }
  }, [selected?._id, settings.phoneNumber]);

  const save = () => {
    saveVoiceSettings(currentUser?._id, settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Card>
      <h2 className="mb-2 font-semibold">إعدادات التسجيل الصوتي</h2>
      <p className="mb-4 text-sm leading-6 text-text-secondary">هذه الإعدادات تحدد الحساب والرقم الافتراضيين عند استخدام الميكروفون. ويمكنك تعديلهما يدويًا في نموذج المراجعة قبل التسجيل.</p>
      <div className="space-y-4">
        <Select
          label="صاحب الحساب الافتراضي للصوت"
          value={`${settings.ownerType}:${settings.ownerId}`}
          onChange={(event) => {
            const [ownerType, ownerId] = event.target.value.split(":");
            setSettings((old) => ({ ...old, ownerType, ownerId, phoneNumber: "" }));
          }}
          options={accounts.map((account) => ({ value: `${account.ownerType}:${account._id}`, label: account.label }))}
          placeholder="اختر الحساب"
        />
        <Select
          label="الرقم الافتراضي"
          value={settings.phoneNumber}
          onChange={(event) => setSettings((old) => ({ ...old, phoneNumber: event.target.value }))}
          options={(selected?.phoneNumbers || []).map((phone) => ({ value: phone, label: phone }))}
          placeholder={selected ? "اختر الرقم" : "اختر الحساب أولًا"}
          disabled={!selected}
        />
        <div className="flex items-center gap-3">
          <button type="button" onClick={save} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-bg hover:bg-accent-hover">حفظ إعدادات الصوت</button>
          {saved && <span className="text-sm text-accent">تم حفظ الإعدادات.</span>}
        </div>
      </div>
    </Card>
  );
}
