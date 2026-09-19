import { useState } from "react";
import { Building2, Plus } from "lucide-react";
import { useUsers } from "../../hooks/users/useUsers";
import { usePartners } from "../../hooks/partners/usePartners";
import UserRow from "../../components/users/UserRow";
import AddUserModal from "../../components/users/AddUserModal";
import AddPartnerModal from "../../components/partners/AddPartnerModal";
import PartnerCard from "../../components/partners/PartnerCard";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { ROLES } from "../../constants/roles";
import { useAuthStore } from "../../store/auth.store";

const FILTERS = [
  { value: "all", label: "الكل" },
  { value: ROLES.ADMIN, label: "الأدمن" },
  { value: ROLES.EMPLOYEE, label: "الموظفين" },
  { value: "partner", label: "الشركاء" },
];

export default function UsersPage() {
  const [filter, setFilter] = useState("all");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const isAdmin = useAuthStore((s) => s.user?.role === ROLES.ADMIN);
  const { data: users, isLoading: usersLoading, isError: usersError } = useUsers();
  const {
    data: partners,
    isLoading: partnersLoading,
    isError: partnersError,
  } = usePartners();

  const showUsers = filter !== "partner";
  const showPartners = filter === "all" || filter === "partner";
  const visibleUsers =
    filter === "all" ? users || [] : (users || []).filter((user) => user.role === filter);
  const isLoading = usersLoading || partnersLoading;
  const isError = usersError || partnersError;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-white">الموظفين والأدمن والشركاء</h1>
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            {filter !== "partner" && (
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
              >
                <Plus size={16} />
                إضافة حساب
              </button>
            )}
            {(filter === "all" || filter === "partner") && (
              <button
                onClick={() => setIsPartnerModalOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-soft hover:text-accent"
              >
                <Building2 size={16} />
                إضافة شريك
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="فلترة الحسابات">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={filter === item.value}
            onClick={() => setFilter(item.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === item.value
                ? "bg-accent text-bg"
                : "border border-border bg-bg-surface text-text-secondary hover:bg-bg-raised"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && (
        <p className="py-8 text-center text-danger">حدث خطأ أثناء تحميل الحسابات أو الشركاء.</p>
      )}

      {!isLoading && !isError && showUsers && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            {filter === "all" ? "الموظفين والأدمن" : FILTERS.find((item) => item.value === filter)?.label}
          </h2>
          {!visibleUsers.length ? (
            <EmptyState message="لا توجد حسابات في هذا التصنيف." />
          ) : (
            <Card className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-right text-text-secondary">
                    <th className="px-4 py-3 font-medium">الاسم</th>
                    <th className="px-4 py-3 font-medium">أرقام التلفون</th>
                    <th className="px-4 py-3 font-medium">الإيميل</th>
                    <th className="px-4 py-3 font-medium">الصلاحية</th>
                    <th className="px-4 py-3 font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user) => (
                    <UserRow key={user._id} user={user} />
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </section>
      )}

      {!isLoading && !isError && showPartners && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">الشركاء</h2>
          {!partners?.length ? (
            <EmptyState message="لا يوجد شركاء بعد." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner) => (
                <PartnerCard key={partner._id} partner={partner} />
              ))}
            </div>
          )}
        </section>
      )}

      <AddUserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
      <AddPartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />
    </div>
  );
}
