import Select from "../ui/Select";
import Input from "../ui/Input";
import { usePartners } from "../../hooks/partners/usePartners";
import { useUsers } from "../../hooks/users/useUsers";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";
import { STAGE_OPTIONS } from "../../constants/stages";

export default function TransactionFilters({ filters, onChange }) {
  const { data: partners } = usePartners();
  const currentUser = useAuthStore((state) => state.user);
  const { data: users = [] } = useUsers({ enabled: currentUser?.role === ROLES.ADMIN });

  const update = (field) => (e) => {
    const value = e.target.value;
    const nextFilters = { ...filters, page: 1 };
    if (value) nextFilters[field] = value;
    else delete nextFilters[field];
    onChange(nextFilters);
  };
  const ownerOptions = [
    ...(partners || []).map((partner) => ({
      value: `Partner:${partner._id}`,
      label: `${partner.name} — شريك`,
    })),
    ...(currentUser?.role === ROLES.ADMIN
      ? users.map((user) => ({ value: `User:${user._id}`, label: `${user.name} — أدمن` }))
      : currentUser
        ? [{ value: `User:${currentUser._id}`, label: `${currentUser.name} — أدمن` }]
        : []),
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <Select
        placeholder="كل المسؤولين"
        value={filters.ownerId ? `${filters.ownerType || "Partner"}:${filters.ownerId}` : filters.partnerId ? `Partner:${filters.partnerId}` : ""}
        onChange={(event) => {
          const value = event.target.value;
          if (!value) {
            const nextFilters = { ...filters, page: 1 };
            delete nextFilters.ownerType;
            delete nextFilters.ownerId;
            delete nextFilters.partnerId;
            onChange(nextFilters);
            return;
          }
          const [ownerType, ownerId] = value.split(":");
          const nextFilters = { ...filters, page: 1 };
          if (ownerType === "Partner") {
            // نحافظ على المعامل القديم الذي تستخدمه سجلات الشركاء الحالية.
            nextFilters.partnerId = ownerId;
            delete nextFilters.ownerType;
            delete nextFilters.ownerId;
          } else {
            nextFilters.ownerType = ownerType;
            nextFilters.ownerId = ownerId;
            delete nextFilters.partnerId;
          }
          onChange(nextFilters);
        }}
        options={ownerOptions}
      />
      <Select
        placeholder="كل المراحل"
        value={filters.stage || ""}
        onChange={update("stage")}
        options={STAGE_OPTIONS}
      />
      <Input type="date" placeholder="من تاريخ" value={filters.from || ""} onChange={update("from")} />
      <Input type="date" placeholder="إلى تاريخ" value={filters.to || ""} onChange={update("to")} />
    </div>
  );
}
