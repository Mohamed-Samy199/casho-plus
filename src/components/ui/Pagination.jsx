import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Pagination({ currentPage, pages, onPageChange }) {
  if (!pages || pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-lg border border-border p-2 text-text-secondary hover:bg-bg-raised disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="الصفحة السابقة"
      >
        <ChevronRight size={16} />
      </button>

      <span className="px-3 text-sm text-text-secondary">
        صفحة {currentPage} من {pages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= pages}
        className="rounded-lg border border-border p-2 text-text-secondary hover:bg-bg-raised disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="الصفحة التالية"
      >
        <ChevronLeft size={16} />
      </button>
    </div>
  );
}