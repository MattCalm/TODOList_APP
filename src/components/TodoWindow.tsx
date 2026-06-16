import { useCallback, useMemo, useState } from "react";
import { Header } from "./Header";
import { NowSection } from "./NowSection";
import { TodoList } from "./TodoList";
import { AddTodoForm } from "./AddTodoForm";
import { FilterTabs } from "./FilterTabs";
import { ProgressSection } from "./ProgressSection";
import { ResizeHandle } from "./ResizeHandle";
import { SettingsPanel } from "./SettingsPanel";
import { CompactTaskList } from "./CompactTaskList";
import { CompactTaskTimer } from "./CompactTaskTimer";
import { TaskTimer } from "./TaskTimer";
import { useSettings } from "../hooks/useSettings";
import { useTaskTimer } from "../hooks/useTaskTimer";
import { useTodos } from "../hooks/useTodos";
import type { TodoFilter } from "../types/filter";

const COMPACT_WINDOW_SIZE = {
  width: 360,
  height: 420,
};

const NORMAL_WINDOW_SIZE = {
  width: 420,
  height: 650,
};

export function TodoWindow() {
  const {
    todos,
    addTodo,
    toggleTodo,
    updateTodoTitle,
    deleteTodo,
    clearCompletedTodos,
    reorderTodos,
    moveTodo,
  } = useTodos();
  const {
    settings,
    selectedTheme,
    selectedFont,
    setThemeId,
    setFontId,
    setEmoji,
  } = useSettings();
  const [activeFilter, setActiveFilter] = useState<TodoFilter>("all");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);

  const sortedTodos = useMemo(() => {
    return [...todos].sort((firstTodo, secondTodo) => {
      return firstTodo.order - secondTodo.order;
    });
  }, [todos]);
  const completedCount = sortedTodos.filter((todo) => todo.completed).length;
  const activeCount = sortedTodos.length - completedCount;
  const hasCompletedTodos = completedCount > 0;
  const currentTodo = sortedTodos.find((todo) => !todo.completed);
  const getTodoTitle = useCallback(
    (todoId: number | undefined) => {
      return sortedTodos.find((todo) => todo.id === todoId)?.title;
    },
    [sortedTodos],
  );
  const taskTimer = useTaskTimer(currentTodo?.id, getTodoTitle);
  const filteredTodos = useMemo(() => {
    if (activeFilter === "active") {
      return sortedTodos.filter((todo) => !todo.completed);
    }

    if (activeFilter === "completed") {
      return sortedTodos.filter((todo) => todo.completed);
    }

    return sortedTodos;
  }, [activeFilter, sortedTodos]);
  const timerTodo = sortedTodos.find((todo) => todo.id === taskTimer.selectedTodoId);
  const alertTodo = sortedTodos.find((todo) => todo.id === taskTimer.alertTodoId);

  const resizeWindow = (width: number, height: number) => {
    void window.electronAPI?.setWindowSize(width, height);
  };

  const enterCompactMode = () => {
    setIsSettingsOpen(false);
    setIsCompactMode(true);
    resizeWindow(COMPACT_WINDOW_SIZE.width, COMPACT_WINDOW_SIZE.height);
  };

  const exitCompactMode = () => {
    setIsCompactMode(false);
    resizeWindow(NORMAL_WINDOW_SIZE.width, NORMAL_WINDOW_SIZE.height);
  };

  const handleToggleCompactMode = () => {
    if (isCompactMode) {
      exitCompactMode();
      return;
    }

    enterCompactMode();
  };

  return (
    <main className={`h-full w-full bg-transparent p-3 [-webkit-app-region:drag] ${selectedTheme.text} ${selectedFont.className}`}>
      <section
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border bg-gradient-to-br shadow-widget backdrop-blur [-webkit-app-region:drag] ${selectedTheme.border} ${selectedTheme.background}`}
      >
        {isCompactMode ? (
          <CompactTaskList
            mascotEmoji={settings.emoji}
            timer={
              <CompactTaskTimer
                alertTaskTitle={alertTodo?.title}
                customMinutes={taskTimer.customMinutes}
                hasFinished={taskTimer.hasFinished}
                isRunning={taskTimer.isRunning}
                remainingSeconds={taskTimer.remainingSeconds}
                taskTitle={timerTodo?.title}
                theme={selectedTheme}
                onDismissAlert={taskTimer.dismissAlert}
                onPause={taskTimer.pauseTimer}
                onReset={taskTimer.resetTimer}
                onStart={taskTimer.startTimer}
              />
            }
            todos={sortedTodos}
            theme={selectedTheme}
            onExitCompactMode={exitCompactMode}
            onToggleTodo={toggleTodo}
          />
        ) : (
          <>
            <Header
              mascotEmoji={settings.emoji}
              isCompactMode={isCompactMode}
              isSettingsOpen={isSettingsOpen}
              mutedTextClassName={selectedTheme.mutedText}
              onToggleCompactMode={handleToggleCompactMode}
              onToggleSettings={() => setIsSettingsOpen((isOpen) => !isOpen)}
            />

            <div className="flex flex-1 flex-col gap-2.5 overflow-hidden px-5 pb-4 [-webkit-app-region:drag]">
              {isSettingsOpen ? (
                <SettingsPanel
                  settings={settings}
                  selectedTheme={selectedTheme}
                  onSelectTheme={setThemeId}
                  onSelectFont={setFontId}
                  onSelectEmoji={setEmoji}
                />
              ) : null}
              <ProgressSection
                completedCount={completedCount}
                totalCount={todos.length}
                cardClassName={selectedTheme.cardBackground}
                borderClassName={selectedTheme.border}
                mutedTextClassName={selectedTheme.mutedText}
                progressClassName={selectedTheme.progress}
              />
              <NowSection
                todo={currentTodo}
                accentClassName={selectedTheme.nowAccent}
                backgroundClassName={selectedTheme.nowBackground}
                borderClassName={selectedTheme.border}
                mutedTextClassName={selectedTheme.nowMutedText}
                textClassName={selectedTheme.nowText}
              />
              <TaskTimer
                alertTaskTitle={alertTodo?.title}
                customMinutes={taskTimer.customMinutes}
                durationSeconds={taskTimer.durationSeconds}
                hasFinished={taskTimer.hasFinished}
                isRunning={taskTimer.isRunning}
                remainingSeconds={taskTimer.remainingSeconds}
                taskTitle={timerTodo?.title}
                theme={selectedTheme}
                validationMessage={taskTimer.validationMessage}
                onDismissAlert={taskTimer.dismissAlert}
                onPause={taskTimer.pauseTimer}
                onReset={taskTimer.resetTimer}
                onSetCustomMinutes={taskTimer.setCustomMinutes}
                onStart={taskTimer.startTimer}
              />
              <AddTodoForm
                onAddTodo={addTodo}
                cardClassName={selectedTheme.cardBackground}
                accentClassName={selectedTheme.accent}
              />
              <FilterTabs
                activeFilter={activeFilter}
                onChangeFilter={setActiveFilter}
                theme={selectedTheme}
              />
              <TodoList
                todos={filteredTodos}
                totalCount={sortedTodos.length}
                activeCount={activeCount}
                completedCount={completedCount}
                activeFilter={activeFilter}
                hasCompletedTodos={hasCompletedTodos}
                onToggleTodo={toggleTodo}
                onUpdateTodoTitle={updateTodoTitle}
                onDeleteTodo={deleteTodo}
                onClearCompletedTodos={clearCompletedTodos}
                onReorderTodos={reorderTodos}
                onMoveTodo={moveTodo}
                theme={selectedTheme}
              />
            </div>
          </>
        )}
        <ResizeHandle />
      </section>
    </main>
  );
}
