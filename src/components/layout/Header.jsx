import { Calculator, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { ROLE_LABELS } from "../../constants/roles";
import NotificationBell from "../notifications/NotificationBell";
import CheckInOutButton from "../attendance/CheckInOutButton";
import CalculatorModal from "../tools/CalculatorModal";

export default function Header({ onMenuClick }) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
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
        <button
          type="button"
          onClick={() => setIsCalculatorOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-soft px-3 py-2 text-sm font-medium text-accent hover:bg-accent/15"
          aria-label="فتح الآلة الحاسبة"
          title="الآلة الحاسبة"
        >
          <Calculator size={17} />
          <span className="hidden sm:inline">آلة حاسبة</span>
        </button>
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
      <CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </header>
  );
}
