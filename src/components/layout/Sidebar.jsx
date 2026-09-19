import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Building2,
  HandCoins,
  Landmark,
  Settings,
  UserCog,
  UserCircle,
  Clock,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";

const NAV_ITEMS = [
  { to: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { to: "/transactions", label: "العمليات", icon: ArrowLeftRight },
  { to: "/clients/individuals", label: "الأفراد", icon: Users },
  { to: "/clients/key-clients", label: "العملاء الرئيسيون", icon: Building2 },
  { to: "/debts", label: "الديون", icon: HandCoins },
  { to: "/partners", label: "الشركاء", icon: Building2 },
  { to: "/attendance", label: "الحضور والانصراف", icon: Clock },
];

const ADMIN_NAV_ITEMS = [
  { to: "/capital", label: "رأس المال", icon: Landmark },
  { to: "/my-capital", label: "ماليتي", icon: Landmark },
  { to: "/settings/commission-rules", label: "قواعد العمولة", icon: Settings },
  { to: "/users", label: "الموظفين", icon: UserCog },
];

const PERSONAL_NAV_ITEM = { to: "/settings/profile", label: "الإعدادات الشخصية", icon: UserCircle };

export default function Sidebar({ onNavigate }) {
  const role = useAuthStore((s) => s.user?.role);
  const items =
    role === ROLES.ADMIN
      ? [...NAV_ITEMS, ...ADMIN_NAV_ITEMS, PERSONAL_NAV_ITEM]
      : [...NAV_ITEMS, PERSONAL_NAV_ITEM];

  return (
    <nav className="flex h-full flex-col gap-1 p-4">
      <div className="mb-6 px-2">
        <span className="text-lg font-black">كاشو بلس</span>
      </div>

      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive
                ? "bg-accent-soft text-accent"
                : "text-text-secondary hover:bg-bg-raised hover:text-text-primary"
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}