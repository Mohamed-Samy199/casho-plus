import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { STAGE_LABELS } from "../../constants/stages";

// ألوان محايدة متناسقة مع هوية السيستم (مش أصفر — محجوز للاندنج)
const COLORS = ["#0459AA", "#38BDF8", "#22C55E", "#F59E0B"];

export default function StageDistributionDonut({ byStage }) {
  if (!byStage?.length) {
    return (
      <Card>
        <p className="mb-3 font-semibold">توزيع العمليات</p>
        <EmptyState message="لا توجد عمليات اليوم بعد" />
      </Card>
    );
  }

  const data = byStage.map((s) => ({
    name: STAGE_LABELS[s._id] || s._id,
    value: s.count,
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold">توزيع العمليات</p>
        <p className="text-sm text-text-secondary">{total} عملية</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} عملية`, ""]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}