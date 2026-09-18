export default function Select({ label, error, options = [], placeholder, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm text-text-secondary">{label}</span>}
      <select
        className={`w-full rounded-lg border bg-bg-raised px-4 py-2.5 text-text-primary
          transition-colors
          ${error ? "border-danger" : "border-border focus:border-accent"}
          ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-sm text-danger">{error}</span>}
    </label>
  );
}