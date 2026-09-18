export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm text-text-secondary">{label}</span>
      )}
      <input
        className={`w-full rounded-lg border bg-bg-raised px-4 py-2.5 text-text-primary
          placeholder:text-text-muted transition-colors
          ${error ? "border-danger" : "border-border focus:border-accent"}
          ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-sm text-danger">{error}</span>}
    </label>
  );
}