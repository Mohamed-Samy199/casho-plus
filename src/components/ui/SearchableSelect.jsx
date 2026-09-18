import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

export default function SearchableSelect({
  label,
  placeholder = "دوّر...",
  value,
  onChange,
  options = [],
  required,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      {label && <span className="mb-1.5 block text-sm text-text-secondary">{label}</span>}

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-bg-raised px-4 py-2.5 text-right text-text-primary hover:border-accent"
      >
        <span className={selectedLabel ? "" : "text-text-muted"}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown size={16} className="text-text-secondary" />
      </button>

      {/* حقل مخفي عشان required في الفورم يشتغل صح */}
      {required && <input tabIndex={-1} className="sr-only" value={value} onChange={() => {}} required />}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-bg-surface shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search size={14} className="text-text-secondary" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب للبحث..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="max-h-56 overflow-y-auto">
            {!filtered.length && (
              <p className="px-4 py-3 text-sm text-text-secondary">لا توجد نتائج</p>
            )}
            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  setQuery("");
                }}
                className={`block w-full px-4 py-2 text-right text-sm hover:bg-bg-raised ${
                  opt.value === value ? "bg-accent-soft text-accent" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}