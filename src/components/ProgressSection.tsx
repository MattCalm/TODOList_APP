type ProgressSectionProps = {
  completedCount: number;
  totalCount: number;
  cardClassName: string;
  borderClassName: string;
  mutedTextClassName: string;
  progressClassName: string;
};

export function ProgressSection({
  completedCount,
  totalCount,
  cardClassName,
  borderClassName,
  mutedTextClassName,
  progressClassName,
}: ProgressSectionProps) {
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const isComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <section className={`rounded-2xl border px-4 py-2.5 shadow-sm ${borderClassName} ${cardClassName}`}>
      <div className="mb-1.5 flex items-center justify-between">
        <h2 className={`text-xs font-bold uppercase tracking-[0.18em] ${mutedTextClassName}`}>
          Today Progress
        </h2>
        <span className="text-sm font-bold text-slate-700">
          {completedCount}/{totalCount}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200/70">
        <div
          className={`h-full rounded-full transition-all duration-300 ${progressClassName}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className={`mt-1.5 text-xs font-semibold ${mutedTextClassName}`}>
        {isComplete ? "Everything is done for today." : `${progressPercent}% complete`}
      </p>
    </section>
  );
}
