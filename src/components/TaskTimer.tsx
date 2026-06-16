import { formatTimerTime } from "../hooks/useTaskTimer";
import type { MoonTodoTheme } from "../types/settings";

type TaskTimerProps = {
  alertTaskTitle: string | undefined;
  customMinutes: string;
  durationSeconds: number;
  hasFinished: boolean;
  isRunning: boolean;
  remainingSeconds: number;
  taskTitle: string | undefined;
  theme: MoonTodoTheme;
  validationMessage: string | undefined;
  onDismissAlert: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetCustomMinutes: (value: string) => void;
  onStart: () => void;
};

export function TaskTimer({
  alertTaskTitle,
  customMinutes,
  durationSeconds,
  hasFinished,
  isRunning,
  remainingSeconds,
  taskTitle,
  theme,
  validationMessage,
  onDismissAlert,
  onPause,
  onReset,
  onSetCustomMinutes,
  onStart,
}: TaskTimerProps) {
  const hasTask = Boolean(taskTitle);

  return (
    <section className={`rounded-2xl border px-4 py-3 shadow-sm [-webkit-app-region:no-drag] ${theme.border} ${theme.cardBackground}`}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className={`text-xs font-bold uppercase tracking-[0.18em] ${theme.mutedText}`}>
            Focus Timer
          </h2>
          <p className="mt-0.5 truncate text-xs font-semibold text-slate-600">
            {taskTitle ? `For: ${taskTitle}` : "No active task"}
          </p>
        </div>
        <div className={`shrink-0 rounded-2xl px-3 py-1 text-lg font-black tabular-nums ${theme.nowBackground} ${theme.nowText}`}>
          {formatTimerTime(remainingSeconds)}
        </div>
      </div>

      <div className="mb-2 flex items-end gap-2">
        <label className="min-w-0 flex-1">
          <span className={`mb-1 block text-[11px] font-bold uppercase tracking-[0.16em] ${theme.mutedText}`}>
            Duration
          </span>
          <div className="flex items-center rounded-2xl bg-white/70 px-3 py-2 shadow-sm">
            <input
              type="number"
              min={0}
              max={600}
              step={1}
              inputMode="numeric"
              value={customMinutes}
              onChange={(event) => onSetCustomMinutes(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-700 outline-none [-webkit-app-region:no-drag]"
            />
            <span className="text-xs font-bold text-slate-400">min</span>
          </div>
        </label>
        <span className={`rounded-2xl px-3 py-2 text-xs font-bold ${theme.nowBackground} ${theme.nowText}`}>
          {durationSeconds > 0 ? formatTimerTime(durationSeconds) : "00:00"}
        </span>
      </div>

      {validationMessage ? (
        <p className={`mb-2 text-xs font-semibold ${theme.mutedText}`}>
          {validationMessage}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={!hasTask}
          onClick={isRunning ? onPause : onStart}
          className={`rounded-2xl px-3 py-2 text-xs font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-45 [-webkit-app-region:no-drag] ${theme.selectedTabBackground} ${theme.selectedTabText}`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl bg-white/70 px-3 py-2 text-xs font-bold text-slate-500 shadow-sm transition hover:text-slate-800 [-webkit-app-region:no-drag]"
        >
          Reset
        </button>
      </div>

      {hasFinished ? (
        <div className={`mt-2 flex items-center justify-between gap-2 rounded-2xl px-3 py-2 text-xs font-bold ${theme.nowBackground} ${theme.nowText}`}>
          <span className="min-w-0 flex-1">
            {alertTaskTitle ? `Time is up for: ${alertTaskTitle}` : "Time is up!"}
          </span>
          <button
            type="button"
            onClick={onDismissAlert}
            className="shrink-0 rounded-full bg-white/70 px-2 py-1 text-[11px] font-bold text-slate-500 [-webkit-app-region:no-drag]"
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </section>
  );
}
