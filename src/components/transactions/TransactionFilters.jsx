import Select from "../ui/Select";
import Input from "../ui/Input";
import { usePartners } from "../../hooks/partners/usePartners";
import { STAGE_OPTIONS } from "../../constants/stages";

export default function TransactionFilters({ filters, onChange }) {
  const { data: partners } = usePartners();

  const update = (field) => (e) => onChange({ ...filters, [field]: e.target.value, page: 1 });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <Select
        placeholder="كل الشركاء"
        value={filters.partnerId || ""}
        onChange={update("partnerId")}
        options={(partners || []).map((p) => ({ value: p._id, label: p.name }))}
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