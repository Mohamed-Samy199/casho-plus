import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import SubmitButton from "../ui/SubmitButton";
import { useCreatePartner } from "../../hooks/partners/useCreatePartner";

export default function AddPartnerModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { mutate: createPartner, isPending, error } = useCreatePartner();

  const handleSubmit = (e) => {
    e.preventDefault();
    createPartner(
      { name, phoneNumbers: phone ? [phone] : [] },
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
    <Modal title="إضافة شريك جديد" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="اسم الشريك" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input
          label="رقم التلفون (اختياري — تقدر تضيف أكتر بعدين)"
          type="tel"
          placeholder="01xxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء إضافة الشريك."}
          </p>
        )}

        <SubmitButton isLoading={isPending}>إضافة</SubmitButton>
      </form>
    </Modal>
  );
}