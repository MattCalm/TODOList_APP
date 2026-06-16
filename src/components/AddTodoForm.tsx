import { FormEvent, useState } from "react";

type AddTodoFormProps = {
  onAddTodo: (title: string) => void;
  cardClassName: string;
  accentClassName: string;
};

export function AddTodoForm({
  onAddTodo,
  cardClassName,
  accentClassName,
}: AddTodoFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTodo(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 [-webkit-app-region:no-drag]">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a moonlit task..."
        className={`min-w-0 flex-1 rounded-2xl border border-white/80 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-white/60 [-webkit-app-region:no-drag] ${cardClassName}`}
      />
      <button
        type="submit"
        className={`rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-white/60 [-webkit-app-region:no-drag] ${accentClassName}`}
      >
        Add
      </button>
    </form>
  );
}
