import type { ReactNode } from "react";
import type { Todo } from "../types/todo";
import type { MoonTodoTheme } from "../types/settings";

type CompactTaskListProps = {
  mascotEmoji: string;
  timer: ReactNode;
  todos: Todo[];
  theme: MoonTodoTheme;
  onExitCompactMode: () => void;
  onToggleTodo: (id: number) => void;
};

export function CompactTaskList({
  mascotEmoji,
  timer,
  todos,
  theme,
  onExitCompactMode,
  onToggleTodo,
}: CompactTaskListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-5 pt-5 [-webkit-app-region:no-drag]">
      <div className="flex items-center justify-between gap-3 [-webkit-app-region:drag]">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${theme.mutedText}`}>
            {mascotEmoji} MoonTodo
          </p>
          <h2 className="text-2xl font-bold text-slate-950">Tasks</h2>
        </div>
        <button
          type="button"
          onClick={onExitCompactMode}
          className="rounded-full bg-white/75 px-3 py-2 text-sm font-bold text-slate-500 shadow-sm transition hover:text-slate-800 [-webkit-app-region:no-drag]"
        >
          Expand
        </button>
      </div>

      {timer}

      <div className={`min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-3xl border p-2 shadow-sm [-webkit-app-region:no-drag] ${theme.border} ${theme.cardBackground}`}>
        {todos.length === 0 ? (
          <div className={`flex h-full items-center justify-center px-4 text-center text-sm font-semibold ${theme.mutedText}`}>
            No tasks yet
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <button
                key={todo.id}
                type="button"
                onClick={() => onToggleTodo(todo.id)}
                className={`flex w-full max-w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-white/45 focus:outline-none focus:ring-2 focus:ring-white/70 [-webkit-app-region:no-drag] ${
                  todo.completed ? `${theme.mutedText} line-through opacity-70` : "text-slate-800"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                    todo.completed
                      ? `${theme.accent} border-transparent text-white`
                      : "border-slate-200 bg-white/70"
                  }`}
                >
                  {todo.completed ? "x" : ""}
                </span>
                <span className="min-w-0 flex-1 whitespace-normal break-words leading-snug">
                  {todo.title}
                </span>
              </button>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
