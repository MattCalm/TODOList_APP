import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { sampleTodos } from "../data/sampleTodos";
import type { Todo } from "../types/todo";

const STORAGE_KEY = "moontodo.todos";

const sortTodosByOrder = (todos: Todo[]): Todo[] => {
  return [...todos].sort((firstTodo, secondTodo) => {
    return firstTodo.order - secondTodo.order;
  });
};

const reindexTodos = (todos: Todo[]): Todo[] => {
  return todos.map((todo, index) => ({ ...todo, order: index }));
};

const normalizeLoadedTodos = (todos: Todo[]): Todo[] => {
  return sortTodosByOrder(
    todos.map((todo, index) => ({
      ...todo,
      order: Number.isFinite(todo.order) ? todo.order : index,
    })),
  ).map((todo, index) => ({ ...todo, order: index }));
};

const loadInitialTodos = (): Todo[] => {
  try {
    const savedTodos = window.localStorage.getItem(STORAGE_KEY);

    if (!savedTodos) {
      return normalizeLoadedTodos(sampleTodos);
    }

    const parsedTodos = JSON.parse(savedTodos) as Todo[];

    if (!Array.isArray(parsedTodos)) {
      return normalizeLoadedTodos(sampleTodos);
    }

    return normalizeLoadedTodos(parsedTodos);
  } catch {
    return normalizeLoadedTodos(sampleTodos);
  }
};

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadInitialTodos);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    setTodos((currentTodos) => {
      const newTodo: Todo = {
        id: Date.now(),
        title: trimmedTitle,
        completed: false,
        order: currentTodos.length,
      };

      return reindexTodos([...sortTodosByOrder(currentTodos), newTodo]);
    });
  };

  const toggleTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const updateTodoTitle = (id: number, title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, title: trimmedTitle } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((currentTodos) =>
      reindexTodos(sortTodosByOrder(currentTodos).filter((todo) => todo.id !== id)),
    );
  };

  const clearCompletedTodos = () => {
    setTodos((currentTodos) =>
      reindexTodos(
        sortTodosByOrder(currentTodos).filter((todo) => !todo.completed),
      ),
    );
  };

  const reorderTodos = (activeId: string, overId: string) => {
    setTodos((currentTodos) => {
      const orderedTodos = sortTodosByOrder(currentTodos);
      const oldIndex = orderedTodos.findIndex(
        (todo) => String(todo.id) === activeId,
      );
      const newIndex = orderedTodos.findIndex(
        (todo) => String(todo.id) === overId,
      );

      if (oldIndex === -1 || newIndex === -1) {
        return currentTodos;
      }

      return reindexTodos(arrayMove(orderedTodos, oldIndex, newIndex));
    });
  };

  const moveTodo = (id: number, direction: "up" | "down") => {
    setTodos((currentTodos) => {
      const orderedTodos = sortTodosByOrder(currentTodos);
      const oldIndex = orderedTodos.findIndex((todo) => todo.id === id);

      if (oldIndex === -1) {
        return currentTodos;
      }

      const newIndex = direction === "up" ? oldIndex - 1 : oldIndex + 1;

      if (newIndex < 0 || newIndex >= orderedTodos.length) {
        return currentTodos;
      }

      return reindexTodos(arrayMove(orderedTodos, oldIndex, newIndex));
    });
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    updateTodoTitle,
    deleteTodo,
    clearCompletedTodos,
    reorderTodos,
    moveTodo,
  };
}
