import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import SubmitButton from "../ui/SubmitButton";
import { useCreateClient } from "../../hooks/clients/useCreateClient";
import { CLIENT_TYPES } from "../../constants/clientTypes";
import { egpToPiasters } from "../../utils/money";

export default function AddKeyClientModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreedHours, setAgreedHours] = useState("24");
  const [lateCommission, setLateCommission] = useState("5");
  const { mutate: createClient, isPending, error } = useCreateClient();

  const handleSubmit = (e) => {
    e.preventDefault();
    createClient(
      {
        name,
        type: CLIENT_TYPES.KEY_CLIENT,
        phoneNumbers: phone ? [phone] : [],
        keyClientSettings: {
          defaultAgreedHours: Number(agreedHours),
          defaultLateCommission: egpToPiasters(lateCommission),
        },
      },
      {
        onSuccess: () => {
          setName("");
          setPhone("");
          setAgreedHours("24");
          setLateCommission("5");
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

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="المدة الافتراضية قبل الاستحقاق"
            type="number"
            title="المدة الافتراضية قبل الاستحقاق (ساعة)"
            min="1"
            value={agreedHours}
            onChange={(e) => setAgreedHours(e.target.value)}
          />
          <Input
            label="عمولة التأخير الافتراضية (جنيه)"
            type="number"
            title="عمولة التأخير الافتراضية (جنيه)"
            min="0"
            step="0.01"
            value={lateCommission}
            onChange={(e) => setLateCommission(e.target.value)}
          />
        </div>

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
