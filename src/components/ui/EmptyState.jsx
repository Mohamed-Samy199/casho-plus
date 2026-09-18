export default function EmptyState({ message = "لا توجد بيانات حاليًا" }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}