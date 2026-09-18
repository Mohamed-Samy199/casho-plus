import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { STAGE_LABELS } from "../../constants/stages";

export default function OperationsChart({ byStage }) {
  if (!byStage?.length) {
    return (
      <Card>
        <p className="mb-3 font-semibold">إجمالي العمليات اليوم</p>
        <EmptyState message="لا توجد عمليات اليوم بعد" />
      </Card>
    );
  }

  const data = byStage.map((s) => ({
    name: STAGE_LABELS[s._id] || s._id,
    عدد: s.count,
  }));

  return (
    <Card>
      <p className="mb-3 font-semibold">إجمالي العمليات اليوم</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="عدد" fill="#0459AA" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}