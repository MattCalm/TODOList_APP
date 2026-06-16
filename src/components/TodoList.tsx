import { useRef } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Todo } from "../types/todo";
import type { TodoFilter } from "../types/filter";
import { TodoItem } from "./TodoItem";
import type { MoonTodoTheme } from "../types/settings";

type TodoListProps = {
  todos: Todo[];
  totalCount: number;
  activeCount: number;
  completedCount: number;
  activeFilter: TodoFilter;
  hasCompletedTodos: boolean;
  onToggleTodo: (id: number) => void;
  onUpdateTodoTitle: (id: number, title: string) => void;
  onDeleteTodo: (id: number) => void;
  onClearCompletedTodos: () => void;
  onReorderTodos: (activeId: string, overId: string) => void;
  onMoveTodo: (id: number, direction: "up" | "down") => void;
  theme: MoonTodoTheme;
};

export function TodoList({
  todos,
  totalCount,
  activeCount,
  completedCount,
  activeFilter,
  hasCompletedTodos,
  onToggleTodo,
  onUpdateTodoTitle,
  onDeleteTodo,
  onClearCompletedTodos,
  onReorderTodos,
  onMoveTodo,
  theme,
}: TodoListProps) {
  const lastReorderPair = useRef<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const canDrag = activeFilter === "all";
  const emptyMessage = {
    all: "No tasks yet. Add one above.",
    active: "No active tasks. Soft landing.",
    completed: "No completed tasks yet.",
  }[activeFilter];
  const todoIds = todos.map((todo) => String(todo.id));

  const reorderFromDragEvent = (event: DragEndEvent | DragOverEvent) => {
    const { active, over } = event;

    if (!over || !canDrag) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    const reorderPair = `${activeId}:${overId}`;

    if (lastReorderPair.current === reorderPair) {
      return;
    }

    lastReorderPair.current = reorderPair;
    onReorderTodos(activeId, overId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    reorderFromDragEvent(event);
    lastReorderPair.current = null;
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col [-webkit-app-region:no-drag]">
      <div className="mb-2 flex items-center justify-between">
        <h2 className={`text-sm font-bold uppercase tracking-[0.18em] ${theme.mutedText}`}>
          To Do
        </h2>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${theme.mutedText}`}>
            {activeFilter === "active"
              ? activeCount
              : activeFilter === "completed"
                ? completedCount
                : totalCount}{" "}
            tasks
          </span>
          {hasCompletedTodos ? (
            <button
              type="button"
              onClick={onClearCompletedTodos}
              className="rounded-full bg-white/70 px-2 py-1 text-xs font-bold text-slate-400 transition hover:bg-rose-50 hover:text-rose-400 [-webkit-app-region:no-drag]"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1 [-webkit-app-region:no-drag]">
        {todos.length === 0 ? (
          <div className={`flex flex-1 items-center justify-center rounded-2xl border border-dashed px-4 py-6 text-center text-sm font-semibold ${theme.border} ${theme.cardBackground} ${theme.mutedText}`}>
            {emptyMessage}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragCancel={() => {
              lastReorderPair.current = null;
            }}
            onDragEnd={handleDragEnd}
            onDragOver={reorderFromDragEvent}
          >
            <SortableContext
              items={todoIds}
              strategy={verticalListSortingStrategy}
            >
              {todos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  canDrag={canDrag}
                  canMoveUp={canDrag && index > 0}
                  canMoveDown={canDrag && index < todos.length - 1}
                  theme={theme}
                  onToggleTodo={onToggleTodo}
                  onUpdateTodoTitle={onUpdateTodoTitle}
                  onDeleteTodo={onDeleteTodo}
                  onMoveTodo={onMoveTodo}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </section>
  );
}
