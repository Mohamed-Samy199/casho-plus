import Select from "../ui/Select";
import { DEBT_DIRECTION_OPTIONS, DEBT_STATUS_LABELS, DEBT_STATUSES } from "../../constants/debt";

const STATUS_OPTIONS = Object.entries(DEBT_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default function DebtFilters({ filters, onChange }) {
  const update = (field) => (e) => onChange({ ...filters, [field]: e.target.value, page: 1 });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Select
        placeholder="كل الأنواع"
        value={filters.direction || ""}
        onChange={update("direction")}
        options={DEBT_DIRECTION_OPTIONS}
      />
      <Select
        placeholder="كل الحالات"
        value={filters.status || ""}
        onChange={update("status")}
        options={STATUS_OPTIONS}
      />
    </div>
  );
}