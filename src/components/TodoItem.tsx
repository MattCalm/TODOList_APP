import { KeyboardEvent, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MoonTodoTheme } from "../types/settings";
import type { Todo } from "../types/todo";

type TodoItemProps = {
  todo: Todo;
  canDrag: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  theme: MoonTodoTheme;
  onToggleTodo: (id: number) => void;
  onUpdateTodoTitle: (id: number, title: string) => void;
  onDeleteTodo: (id: number) => void;
  onMoveTodo: (id: number, direction: "up" | "down") => void;
};

export function TodoItem({
  todo,
  canDrag,
  canMoveUp,
  canMoveDown,
  theme,
  onToggleTodo,
  onUpdateTodoTitle,
  onDeleteTodo,
  onMoveTodo,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(todo.id), disabled: !canDrag });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const finishEditing = () => {
    onUpdateTodoTitle(todo.id, draftTitle);
    setDraftTitle(todo.title);
    setIsEditing(false);
  };

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      finishEditing();
    }

    if (event.key === "Escape") {
      setDraftTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2 shadow-sm transition ${
        isDragging ? "scale-[1.01] opacity-80 shadow-lg" : ""
      } ${theme.border} ${theme.cardBackground} [-webkit-app-region:no-drag]`}
    >
      <div className="flex shrink-0 items-center gap-1 [-webkit-app-region:no-drag]">
        <button
          type="button"
          aria-label="Drag task"
          disabled={!canDrag}
          className={`rounded-lg px-1.5 py-1 text-sm font-bold transition [-webkit-app-region:no-drag] ${
            canDrag
              ? "cursor-grab text-slate-300 hover:bg-white/60 hover:text-slate-500 active:cursor-grabbing"
              : "cursor-not-allowed text-slate-200"
          }`}
          {...attributes}
          {...listeners}
        >
          ::
        </button>
        <div className="flex flex-col">
          <button
            type="button"
            aria-label="Move task up"
            disabled={!canMoveUp}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onMoveTodo(todo.id, "up")}
            className="h-4 rounded text-[10px] font-bold leading-none text-slate-300 transition hover:bg-white/60 hover:text-slate-500 disabled:cursor-not-allowed disabled:opacity-30 [-webkit-app-region:no-drag]"
          >
            ^
          </button>
          <button
            type="button"
            aria-label="Move task down"
            disabled={!canMoveDown}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onMoveTodo(todo.id, "down")}
            className="h-4 rounded text-[10px] font-bold leading-none text-slate-300 transition hover:bg-white/60 hover:text-slate-500 disabled:cursor-not-allowed disabled:opacity-30 [-webkit-app-region:no-drag]"
          >
            v
          </button>
        </div>
      </div>

      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onToggleTodo(todo.id)}
        aria-label={todo.completed ? "Mark task unfinished" : "Mark task complete"}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition [-webkit-app-region:no-drag] ${
          todo.completed
            ? `border-transparent ${theme.accent}`
            : "border-slate-300 bg-white"
        }`}
      >
        {todo.completed ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
      </button>

      {isEditing ? (
        <input
          value={draftTitle}
          autoFocus
          onChange={(event) => setDraftTitle(event.target.value)}
          onBlur={finishEditing}
          onKeyDown={handleTitleKeyDown}
          className="min-w-0 flex-1 rounded-xl bg-white px-2 py-1 text-sm font-medium text-slate-800 outline-none ring-2 ring-violet-200 [-webkit-app-region:no-drag]"
        />
      ) : (
        <p
          onDoubleClick={() => {
            setDraftTitle(todo.title);
            setIsEditing(true);
          }}
          className={`min-w-0 flex-1 text-sm font-medium leading-snug [-webkit-app-region:no-drag] ${
            todo.completed ? "text-slate-400 line-through" : "text-slate-800"
          }`}
        >
          {todo.title}
        </p>
      )}

      <button
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onDeleteTodo(todo.id)}
        aria-label="Delete task"
        className="rounded-full px-2 py-1 text-sm font-bold text-slate-300 transition hover:bg-rose-50 hover:text-rose-400 [-webkit-app-region:no-drag]"
      >
        x
      </button>
    </article>
  );
}
