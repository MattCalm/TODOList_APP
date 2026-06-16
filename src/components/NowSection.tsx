import type { Todo } from "../types/todo";

type NowSectionProps = {
  todo: Todo | undefined;
  accentClassName: string;
  backgroundClassName: string;
  borderClassName: string;
  mutedTextClassName: string;
  textClassName: string;
};

export function NowSection({
  todo,
  accentClassName,
  backgroundClassName,
  borderClassName,
  mutedTextClassName,
  textClassName,
}: NowSectionProps) {
  return (
    <section className={`rounded-2xl border px-4 py-3 shadow-sm ${backgroundClassName} ${borderClassName} ${textClassName}`}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className={`text-sm font-semibold uppercase tracking-[0.18em] ${mutedTextClassName}`}>
          Now
        </h2>
        <span className={`h-2 w-2 rounded-full shadow-sm ${accentClassName}`} />
      </div>

      <p className="text-base font-semibold leading-snug">
        {todo ? todo.title : "All tasks are complete"}
      </p>
    </section>
  );
}
