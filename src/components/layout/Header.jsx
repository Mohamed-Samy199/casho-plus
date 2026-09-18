import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { ROLE_LABELS } from "../../constants/roles";
import NotificationBell from "../notifications/NotificationBell";
import CheckInOutButton from "../attendance/CheckInOutButton";

export default function Header({ onMenuClick }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-bg-surface px-4">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-text-secondary hover:bg-bg-raised md:hidden"
        aria-label="فتح القائمة"
      >
        <Menu size={20} />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <CheckInOutButton />
        <NotificationBell />

        <div className="mx-1 hidden text-left sm:block">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-text-secondary">{ROLE_LABELS[user?.role]}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-text-secondary hover:bg-danger-soft hover:text-danger"
          aria-label="تسجيل الخروج"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}