function formatTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

function formatHours(checkInAt, checkOutAt) {
  if (!checkInAt || !checkOutAt) return "—";
  const checkIn = new Date(checkInAt);
  const checkOut = new Date(checkOutAt);
  let durationMs = checkOut - checkIn;

  // السجل القديم قد يكون مخزنًا بنفس التاريخ رغم أن الانصراف بعد منتصف الليل.
  if (durationMs < 0) durationMs += 24 * 60 * 60 * 1000;

  const hours = durationMs / (1000 * 60 * 60);
  return `${hours.toFixed(1)} ساعة`;
}

export default function AttendanceRow({ record, showName = false }) {
  return (
    <tr className="border-b border-border last:border-0">
      {showName && <td className="px-4 py-3 font-medium">{record.user?.name || "—"}</td>}
      <td className="px-4 py-3 text-text-secondary">
        {new Date(record.date).toLocaleDateString("ar-EG")}
      </td>
      <td className="px-4 py-3">{formatTime(record.checkInAt)}</td>
      <td className="px-4 py-3">{formatTime(record.checkOutAt)}</td>
      <td className="px-4 py-3 text-text-secondary">
        {formatHours(record.checkInAt, record.checkOutAt)}
      </td>
    </tr>
  );
}
