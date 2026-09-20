import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import SubmitButton from "../ui/SubmitButton";
import { useCreatePartner } from "../../hooks/partners/useCreatePartner";

export default function AddPartnerModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const { mutate: createPartner, isPending, error } = useCreatePartner();

  const reset = () => {
    setName("");
    setPhone("");
    setCreateAccount(false);
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim() || (createAccount && password.length < 8)) return;

    createPartner(
      {
        name: name.trim(),
        phoneNumbers: [phone.trim()],
        createAccount,
        ...(createAccount ? { password } : {}),
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <Modal title="إضافة شريك جديد" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="اسم الشريك"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div>
          <Input
            label="رقم الهاتف الأساسي (مطلوب)"
            type="tel"
            placeholder="01xxxxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="01[0-9]{9}"
            required
          />
          <p className="mt-1.5 text-xs text-text-secondary">
            يستخدم الرقم لتحديد الشريك، ويمكن إضافة أرقام أخرى لاحقًا.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg-raised p-3">
          <input
            type="checkbox"
            checked={createAccount}
            onChange={(e) => setCreateAccount(e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <span>
            <span className="block font-medium">إنشاء حساب دخول للشريك الآن</span>
            <span className="mt-1 block text-xs text-text-secondary">
              سيبدأ الحساب بصلاحية أدمن ويمكن تغييرها لاحقًا من إدارة المستخدمين.
            </span>
          </span>
        </label>

        {createAccount && (
          <Input
            label="كلمة المرور (8 أحرف على الأقل)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        )}

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء إضافة الشريك."}
          </p>
        )}

        <SubmitButton isLoading={isPending}>إضافة الشريك</SubmitButton>
      </form>
    </Modal>
  );
}
