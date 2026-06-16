import { formatTimerTime } from "../hooks/useTaskTimer";
import type { MoonTodoTheme } from "../types/settings";

type CompactTaskTimerProps = {
  alertTaskTitle: string | undefined;
  customMinutes: string;
  hasFinished: boolean;
  isRunning: boolean;
  remainingSeconds: number;
  taskTitle: string | undefined;
  theme: MoonTodoTheme;
  onDismissAlert: () => void;
  onPause: () => void;
  onReset: () => void;
  onStart: () => void;
};

export function CompactTaskTimer({
  alertTaskTitle,
  customMinutes,
  hasFinished,
  isRunning,
  remainingSeconds,
  taskTitle,
  theme,
  onDismissAlert,
  onPause,
  onReset,
  onStart,
}: CompactTaskTimerProps) {
  const hasTask = Boolean(taskTitle);

  return (
    <div className={`rounded-3xl border px-3 py-2 shadow-sm [-webkit-app-region:no-drag] ${theme.border} ${theme.cardBackground}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${theme.mutedText}`}>
            Timer
          </p>
          <p className="truncate text-xs font-semibold text-slate-600">
            {taskTitle ?? "No active task"}
          </p>
        </div>
        <span className={`shrink-0 rounded-2xl px-3 py-1 text-base font-black tabular-nums ${theme.nowBackground} ${theme.nowText}`}>
          {formatTimerTime(remainingSeconds)}
        </span>
      </div>
      <p className={`mb-2 text-xs font-semibold ${theme.mutedText}`}>
        Duration: {customMinutes || "0"} min
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={!hasTask}
          onClick={isRunning ? onPause : onStart}
          className={`rounded-2xl px-3 py-1.5 text-xs font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-45 [-webkit-app-region:no-drag] ${theme.selectedTabBackground} ${theme.selectedTabText}`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-500 shadow-sm transition hover:text-slate-800 [-webkit-app-region:no-drag]"
        >
          Reset
        </button>
      </div>

      {hasFinished ? (
        <div className={`mt-2 rounded-2xl px-3 py-2 text-xs font-bold ${theme.nowBackground} ${theme.nowText}`}>
          <p className="mb-1">
            {alertTaskTitle ? `Time is up for: ${alertTaskTitle}` : "Time is up!"}
          </p>
          <button
            type="button"
            onClick={onDismissAlert}
            className="rounded-full bg-white/70 px-2 py-1 text-[11px] font-bold text-slate-500 [-webkit-app-region:no-drag]"
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </div>
  );
}
