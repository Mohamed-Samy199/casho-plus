import { useState } from "react";
import Card from "../ui/Card";
import Select from "../ui/Select";
import EmptyState from "../ui/EmptyState";
import { useMonthlyReport } from "../../hooks/attendance/useAttendance";

const MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

const now = new Date();
const YEAR_OPTIONS = [now.getFullYear(), now.getFullYear() - 1].map((y) => ({
  value: String(y),
  label: String(y),
}));
const MONTH_OPTIONS = MONTHS.map((label, i) => ({ value: String(i + 1), label }));

export default function MonthlyReportTable() {
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const { data: report, isLoading } = useMonthlyReport(year, month);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">التقرير الشهري</h2>
        <div className="flex gap-2">
          <Select value={month} onChange={(e) => setMonth(e.target.value)} options={MONTH_OPTIONS} />
          <Select value={year} onChange={(e) => setYear(e.target.value)} options={YEAR_OPTIONS} />
        </div>
      </div>

      {isLoading && <p className="py-8 text-center text-sm text-text-secondary">جاري التحميل...</p>}

      {report && !report.length && <EmptyState message="لا يوجد سجل حضور في الشهر ده" />}

      {report?.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-right text-text-secondary">
              <th className="py-2 font-medium">الموظف</th>
              <th className="py-2 font-medium">أيام الحضور</th>
              <th className="py-2 font-medium">إجمالي الساعات</th>
            </tr>
          </thead>
          <tbody>
            {report.map((row) => (
              <tr key={row.userId} className="border-b border-border last:border-0">
                <td className="py-2.5 font-medium">{row.name}</td>
                <td className="py-2.5 text-text-secondary">{row.daysPresent} يوم</td>
                <td className="py-2.5 text-text-secondary">{row.totalHours} ساعة</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}