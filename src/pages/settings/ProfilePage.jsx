import { useState } from "react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import SubmitButton from "../../components/ui/SubmitButton";
import { useAuthStore } from "../../store/auth.store";
import { useChangePassword } from "../../hooks/auth/useChangePassword";
import { ROLE_LABELS } from "../../constants/roles";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const { mutate: changePassword, isPending, error, isSuccess } = useChangePassword();

  const handleSubmit = (e) => {
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

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-bold">الإعدادات الشخصية</h1>

      <Card>
        <p className="text-sm text-text-secondary">الاسم</p>
        <p className="mb-3 font-medium">{user?.name}</p>
        <p className="text-sm text-text-secondary">رقم التلفون الأساسي</p>
        <p className="mb-3 font-medium">{user?.primaryPhone}</p>
        <p className="text-sm text-text-secondary">الصلاحية</p>
        <p className="font-medium">{ROLE_LABELS[user?.role]}</p>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">تغيير كلمة المرور</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              {error.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور."}
            </p>
          )}
          {isSuccess && (
            <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
              تم تغيير كلمة المرور بنجاح.
            </p>
          )}

          <SubmitButton isLoading={isPending}>حفظ</SubmitButton>
        </form>
      </Card>
    </div>
  );
}