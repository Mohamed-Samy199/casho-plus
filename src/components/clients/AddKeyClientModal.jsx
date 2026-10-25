import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import SubmitButton from "../ui/SubmitButton";
import { useCreateClient } from "../../hooks/clients/useCreateClient";
import { CLIENT_TYPES } from "../../constants/clientTypes";

export default function AddKeyClientModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { mutate: createClient, isPending, error } = useCreateClient();

  const handleSubmit = (e) => {
    e.preventDefault();
    createClient(
      {
        name,
        type: CLIENT_TYPES.KEY_CLIENT,
        phoneNumbers: phone ? [phone] : [],
      },
      {
        onSuccess: () => {
          setName("");
          setPhone("");
          onClose();
        },
      }
    );
  };

  return (
    <Modal title="إضافة عميل رئيسي جديد" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="اسم العميل" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input
          label="رقم التلفون (اختياري)"
          type="tel"
          placeholder="01xxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <p className="rounded-lg bg-bg-raised p-3 text-sm text-text-secondary">يتم تحديد تاريخ الاستحقاق وعمولة السداد عند تسجيل كل عملية وسدادها.</p>

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء إضافة العميل."}
          </p>
        )}

        <SubmitButton isLoading={isPending}>إضافة</SubmitButton>
      </form>
    </Modal>
  );
}
