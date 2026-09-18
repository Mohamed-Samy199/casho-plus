import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import SubmitButton from "../ui/SubmitButton";
import { useAddPhoneNumber } from "../../hooks/partners/useAddPhoneNumber";

export default function AddPhoneNumberModal({ partnerId, isOpen, onClose }) {
  const [phone, setPhone] = useState("");
  const { mutate: addPhone, isPending, error } = useAddPhoneNumber(partnerId);

  const handleSubmit = (e) => {
    e.preventDefault();
    addPhone(phone, {
      onSuccess: () => {
        setPhone("");
        onClose();
      },
    });
  };

  return (
    <Modal title="إضافة رقم جديد" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="رقم التلفون"
          type="tel"
          placeholder="01xxxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoFocus
        />

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء إضافة الرقم."}
          </p>
        )}

        <SubmitButton isLoading={isPending}>إضافة</SubmitButton>
      </form>
    </Modal>
  );
}