import { LogIn, LogOut, CheckCircle2 } from "lucide-react";
import { useTodayStatus, useCheckIn, useCheckOut } from "../../hooks/attendance/useAttendance";

export default function CheckInOutButton() {
  const { data: status, isLoading } = useTodayStatus();
  const { mutate: checkIn, isPending: isCheckingIn } = useCheckIn();
  const { mutate: checkOut, isPending: isCheckingOut } = useCheckOut();

  if (isLoading) return null;

  // لسه مسجّلش حضور النهاردة
  if (!status?.checkInAt) {
    return (
      <button
        onClick={() => checkIn()}
        disabled={isCheckingIn}
        className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-bg hover:bg-accent-hover disabled:opacity-60"
      >
        <LogIn size={16} />
        <span className="hidden sm:inline">تسجيل حضور</span>
      </button>
    );
  }

  // سجّل حضور بس لسه مسجّلش انصراف
  if (!status?.checkOutAt) {
    return (
      <button
        onClick={() => checkOut()}
        disabled={isCheckingOut}
        className="flex items-center gap-2 rounded-lg border border-danger px-3 py-2 text-sm font-medium text-danger hover:bg-danger-soft disabled:opacity-60"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">تسجيل انصراف</span>
      </button>
    );
  }

  // خلّص يومه
  return (
    <span className="flex items-center gap-2 rounded-lg bg-accent-soft px-3 py-2 text-sm font-medium text-accent">
      <CheckCircle2 size={16} />
      <span className="hidden sm:inline">تم الانصراف</span>
    </span>
  );
}