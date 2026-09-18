export default function SubmitButton({ children, isLoading, className = "", ...props }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full rounded-lg bg-accent px-4 py-2.5 font-medium text-bg
        transition-colors hover:bg-accent-hover
        disabled:cursor-not-allowed disabled:opacity-60
        ${className}`}
      {...props}
    >
      {isLoading ? "جاري التحميل..." : children}
    </button>
  );
}