import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import TransactionRow from "../transactions/TransactionRow";

export default function RecentTransactionsList({ transactions, showDate = false }) {
  if (!transactions?.length) {
    return (
      <Card>
        <EmptyState message="لا توجد عمليات بعد" />
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-right text-text-secondary">
            <th className="px-4 py-3 font-medium">المسؤول</th>
            <th className="px-4 py-3 font-medium">القناة</th>
            <th className="px-4 py-3 font-medium">المرحلة</th>
            <th className="px-4 py-3 font-medium">المبلغ</th>
            <th className="px-4 py-3 font-medium">الوقت</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <TransactionRow key={t._id} transaction={t} showDate={showDate} />
          ))}
        </tbody>
      </table>
    </Card>
  );
}