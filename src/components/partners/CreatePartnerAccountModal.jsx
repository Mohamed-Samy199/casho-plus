import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import SubmitButton from "../ui/SubmitButton";
import { useCreatePartnerAccount } from "../../hooks/partners/useCreatePartnerAccount";

export default function CreatePartnerAccountModal({ partnerId, isOpen, onClose }) {
  const [password, setPassword] = useState("");
  const { mutate, isPending, error } = useCreatePartnerAccount(partnerId);

  const close = () => {
    if (isPending) return;
    setPassword("");
    onClose();
  };

  const submit = (event) => {
    event.preventDefault();
    if (password.length < 8) return;
    mutate(password, { onSuccess: close });
  };

  return (
    <Modal title="إنشاء حساب دخول للشريك" isOpen={isOpen} onClose={close}>
      <form onSubmit={submit} className="space-y-4">
        <div className="rounded-xl bg-accent-soft p-3 text-sm text-text-secondary">
          سيتم إنشاء الحساب بصلاحية <strong className="text-text-primary">أدمن</strong>،
          وسيكون رقم الشريك الأساسي هو رقم تسجيل الدخول.
        </div>
        <Input
          label="كلمة المرور (8 أحرف على الأقل)"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
          autoFocus
        />
        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب."}
            {error.response?.data?.errors?.map((item, index) => (
              <span key={index} className="mt-1 block">
                {item.message || item}
              </span>
            ))}
          </p>
        )}
        <SubmitButton isLoading={isPending}>إنشاء الحساب</SubmitButton>
      </form>
    </Modal>
  );
}
