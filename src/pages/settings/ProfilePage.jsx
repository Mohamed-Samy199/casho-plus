import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import SubmitButton from "../../components/ui/SubmitButton";
import { useAuthStore } from "../../store/auth.store";
import { useChangePassword } from "../../hooks/auth/useChangePassword";
import {
  useAddMyPhoneNumber,
  useRemoveMyPhoneNumber,
} from "../../hooks/auth/useMyPhoneNumbers";
import { ROLE_LABELS } from "../../constants/roles";
import VoiceCommandSettings from "../../components/settings/VoiceCommandSettings";

function errorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const {
    mutate: changePassword,
    isPending: isChangingPassword,
    error: passwordError,
    isSuccess,
  } = useChangePassword();
  const {
    mutate: addPhone,
    isPending: isAddingPhone,
    error: addPhoneError,
  } = useAddMyPhoneNumber();
  const {
    mutate: removePhone,
    isPending: isRemovingPhone,
    error: removePhoneError,
  } = useRemoveMyPhoneNumber();

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    changePassword(
      { currentPassword, newPassword, newPasswordConfirm },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setNewPasswordConfirm("");
        },
      }
    );
  };

  const handleAddPhone = (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    addPhone(phone.trim(), { onSuccess: () => setPhone("") });
  };

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-xl font-bold text-white">الإعدادات الشخصية</h1>

      {/* البيانات الشخصية + أرقام وشرائح المحفظة */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <p className="text-sm text-text-secondary">الاسم</p>
          <p className="mb-3 font-medium">{user?.name}</p>
          <p className="text-sm text-text-secondary">رقم التلفون الأساسي</p>
          <p className="mb-3 font-medium">{user?.primaryPhone}</p>
          <p className="text-sm text-text-secondary">الصلاحية</p>
          <p className="font-medium">{ROLE_LABELS[user?.role]}</p>
        </Card>

        <Card>
          <h2 className="mb-1 font-semibold">أرقام وشرائح المحفظة</h2>
          <p className="mb-4 text-sm text-text-secondary">
            أضف أي رقم جديد لاستخدامه كمحفظة مستقلة في ماليتي.
          </p>
          <div className="space-y-2">
            {(user?.phoneNumbers || []).map((item, index) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-lg bg-bg-raised px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-medium">{item}</span>
                  {index === 0 && (
                    <span className="mr-2 text-xs text-text-secondary">الرقم الأساسي</span>
                  )}
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePhone(item)}
                    disabled={isRemovingPhone}
                    className="rounded-md p-1.5 text-danger hover:bg-danger-soft disabled:opacity-50"
                    aria-label={`حذف الرقم ${item}`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleAddPhone} className="mt-4 flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="رقم/شريحة جديدة"
                type="tel"
                placeholder="01xxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="01[0-9]{9}"
              />
            </div>
            <button
              type="submit"
              disabled={isAddingPhone || !phone.trim()}
              className="flex h-11 items-center gap-1 rounded-lg bg-accent px-3 text-sm font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} /> إضافة
            </button>
          </form>
          {(addPhoneError || removePhoneError) && (
            <p className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              {errorMessage(addPhoneError || removePhoneError, "حدث خطأ أثناء تعديل الأرقام.")}
            </p>
          )}
        </Card>
      </div>

      {/* الإضافة الجديدة فقط: إعدادات الصوت */}
      <VoiceCommandSettings />

      {/* تغيير كلمة المرور */}
      <Card>
        <h2 className="mb-4 font-semibold">تغيير كلمة المرور</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="كلمة المرور الحالية"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="كلمة المرور الجديدة"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="تأكيد كلمة المرور الجديدة"
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            required
          />
          {passwordError && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              {errorMessage(passwordError, "حدث خطأ أثناء تغيير كلمة المرور.")}
            </p>
          )}
          {isSuccess && (
            <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
              تم تغيير كلمة المرور بنجاح.
            </p>
          )}
          <SubmitButton isLoading={isChangingPassword}>حفظ</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
