import type { TodoFilter } from "../types/filter";
import type { MoonTodoTheme } from "../types/settings";

type FilterTabsProps = {
  activeFilter: TodoFilter;
  onChangeFilter: (filter: TodoFilter) => void;
  theme: MoonTodoTheme;
};

const filters: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function FilterTabs({ activeFilter, onChangeFilter, theme }: FilterTabsProps) {
  return (
    <div className="grid grid-cols-3 rounded-2xl bg-white/60 p-1 shadow-sm [-webkit-app-region:no-drag]">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChangeFilter(filter.value)}
          className={`rounded-xl px-2 py-1.5 text-xs font-bold transition [-webkit-app-region:no-drag] ${
            activeFilter === filter.value
              ? `${theme.selectedTabBackground} ${theme.selectedTabText} shadow-sm`
              : theme.unselectedTabText
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
