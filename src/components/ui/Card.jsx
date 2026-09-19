export default function Card({ children, className = "", title }) {
  return (
    <div title={title} className={`rounded-2xl border border-border bg-bg-surface p-5 ${className}`}>
      {children}
    </div>
  );
}
