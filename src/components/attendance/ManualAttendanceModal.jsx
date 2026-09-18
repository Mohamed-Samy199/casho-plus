import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import SubmitButton from "../ui/SubmitButton";
import { useUsers } from "../../hooks/users/useUsers";
import { useAdminUpsertAttendance } from "../../hooks/attendance/useAttendance";

export default function ManualAttendanceModal({ isOpen, onClose }) {
  const { data: users } = useUsers();
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: upsertAttendance, isPending, error } = useAdminUpsertAttendance();

  const toISO = (dateStr, timeStr) => (timeStr ? new Date(`${dateStr}T${timeStr}`).toISOString() : null);

  const handleSubmit = (e) => {
    e.preventDefault();
    upsertAttendance(
      {
        userId,
        date,
        checkInAt: toISO(date, checkInTime),
        checkOutAt: toISO(date, checkOutTime),
        notes,
      },
      {
        onSuccess: () => {
          setUserId("");
          setDate("");
          setCheckInTime("");
          setCheckOutTime("");
          setNotes("");
          onClose();
        },
      }
    );
  };

  return (
    <Modal title="إضافة/تعديل سجل حضور" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="الموظف"
          placeholder="اختر الموظف"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          options={(users || []).map((u) => ({ value: u._id, label: u.name }))}
          required
        />
        <Input label="التاريخ" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="وقت الحضور"
            type="time"
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)}
          />
          <Input
            label="وقت الانصراف"
            type="time"
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)}
          />
        </div>
        <Input label="ملاحظات (اختياري)" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.response?.data?.message || "حدث خطأ أثناء حفظ السجل."}
          </p>
        )}

        <SubmitButton isLoading={isPending}>حفظ</SubmitButton>
      </form>
    </Modal>
  );
}