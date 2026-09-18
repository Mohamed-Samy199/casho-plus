import { useState } from "react";
import { Plus } from "lucide-react";
import { useAttendanceList } from "../../hooks/attendance/useAttendance";
import { useUsers } from "../../hooks/users/useUsers";
import AttendanceRow from "../../components/attendance/AttendanceRow";
import ManualAttendanceModal from "../../components/attendance/ManualAttendanceModal";
import MonthlyReportTable from "../../components/attendance/MonthlyReportTable";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import { useAuthStore } from "../../store/auth.store";
import { ROLES } from "../../constants/roles";

export default function AttendancePage() {
  const isAdmin = useAuthStore((s) => s.user?.role === ROLES.ADMIN);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ page: 1, size: 20 });

  const { data: users } = useUsers();
  const { data, isLoading, isError } = useAttendanceList(filters);
  const records = data?.result || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">الحضور والانصراف</h1>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover"
          >
            <Plus size={16} />
            إضافة/تعديل سجل
          </button>
        )}
      </div>

      {isAdmin && <MonthlyReportTable />}

      {isAdmin && (
        <Select
          placeholder="كل الموظفين"
          value={filters.userId || ""}
          onChange={(e) => setFilters((f) => ({ ...f, userId: e.target.value, page: 1 }))}
          options={(users || []).map((u) => ({ value: u._id, label: u.name }))}
        />
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {isError && <p className="py-16 text-center text-danger">حدث خطأ أثناء تحميل سجل الحضور.</p>}

      {data && !records.length && (
        <Card>
          <EmptyState message="لا يوجد سجل حضور بعد" />
        </Card>
      )}

      {records.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-right text-text-secondary">
                {isAdmin && <th className="px-4 py-3 font-medium">الموظف</th>}
                <th className="px-4 py-3 font-medium">التاريخ</th>
                <th className="px-4 py-3 font-medium">الحضور</th>
                <th className="px-4 py-3 font-medium">الانصراف</th>
                <th className="px-4 py-3 font-medium">عدد الساعات</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <AttendanceRow key={record._id} record={record} showName={isAdmin} />
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {data && (
        <Pagination
          currentPage={data.currentPage || 1}
          pages={data.pages}
          onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        />
      )}

      {isAdmin && (
        <ManualAttendanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}