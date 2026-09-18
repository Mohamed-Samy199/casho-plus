import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SubmitButton from "../ui/SubmitButton";
import { useCreateUser } from "../../hooks/users/useUsers";
import { ROLES, ROLE_LABELS } from "../../constants/roles";

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

export default function AddUserModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.EMPLOYEE);
  const { mutate: createUser, isPending, error } = useCreateUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(
      { name, phoneNumbers: [phone], password, role },
      {
        onSuccess: () => {
          setName("");
          setPhone("");
          setPassword("");
          setRole(ROLES.EMPLOYEE);
          onClose();
        },
      }
    );
  };

  return (
    <Modal title="إضافة موظف/أدمن جديد" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="الاسم" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input
          label="رقم التلفون (لتسجيل الدخول)"
          type="tel"
          placeholder="01xxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          label="كلمة المرور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Select
          label="الصلاحية"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={ROLE_OPTIONS}
        />

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء إضافة الحساب."}
          </p>
        )}

        <SubmitButton isLoading={isPending}>إضافة</SubmitButton>
      </form>
    </Modal>
  );
}