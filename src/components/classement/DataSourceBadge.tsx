/**
 * Small badge indicating whether data is real or fallback.
 */
export function DataSourceBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center">
      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
        {label}
      </span>
    </div>
  );
}
