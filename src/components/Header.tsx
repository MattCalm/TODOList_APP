import { useEffect, useState, type ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
  mascotEmoji: string;
  isCompactMode: boolean;
  isSettingsOpen: boolean;
  mutedTextClassName: string;
  onToggleCompactMode: () => void;
  onToggleSettings: () => void;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export function Header({
  children,
  mascotEmoji,
  isCompactMode,
  isSettingsOpen,
  mutedTextClassName,
  onToggleCompactMode,
  onToggleSettings,
}: HeaderProps) {
  const today = dateFormatter.format(new Date());
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncPinnedState = async () => {
      try {
        const realPinnedState = await window.electronAPI?.isAlwaysOnTop();

        if (isMounted && typeof realPinnedState === "boolean") {
          setIsPinned(realPinnedState);
        }
      } catch {
        // Keep the default unpinned state when Electron IPC is unavailable.
      }
    };

    void syncPinnedState();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePinClick = async () => {
    const nextPinnedState = !isPinned;

    try {
      const confirmedPinnedState =
        await window.electronAPI?.setAlwaysOnTop(nextPinnedState);

      if (typeof confirmedPinnedState === "boolean") {
        setIsPinned(confirmedPinnedState);
      }
    } catch {
      // Leave the current state unchanged if Electron rejects the pin change.
    }
  };

  return (
    <header className="flex items-start justify-between px-5 pb-2 pt-4 [-webkit-app-region:drag]">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${mutedTextClassName}`}>
          Focus softly
        </p>
        <h1 className="text-2xl font-bold text-slate-950">
          <span className="mr-2">{mascotEmoji}</span>
          MoonTodo
        </h1>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 [-webkit-app-region:no-drag]">
          <button
            type="button"
            onClick={onToggleCompactMode}
            aria-pressed={isCompactMode}
            aria-label={isCompactMode ? "Show full view" : "Show compact view"}
            title="Compact mode"
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold shadow-sm transition ${
              isCompactMode
                ? "bg-slate-950 text-white"
                : "bg-white/75 text-slate-400 hover:text-slate-700"
            }`}
          >
            {"\u25A4"}
          </button>
          <button
            type="button"
            onClick={onToggleSettings}
            aria-pressed={isSettingsOpen}
            aria-label={isSettingsOpen ? "Close settings" : "Open settings"}
            title="Settings"
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold shadow-sm transition ${
              isSettingsOpen
                ? "bg-slate-950 text-white"
                : "bg-white/75 text-slate-400 hover:text-slate-700"
            }`}
          >
            {"\u2699"}
          </button>
          <button
            type="button"
            onClick={handlePinClick}
            aria-pressed={isPinned}
            aria-label={isPinned ? "Unpin window" : "Pin window on top"}
            title={isPinned ? "Unpin window" : "Pin window"}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold shadow-sm transition ${
              isPinned
                ? "bg-slate-950 text-white"
                : "bg-white/75 text-slate-400 hover:text-slate-700"
            }`}
          >
            {isPinned ? "\uD83D\uDCCC" : "\u25C9"}
          </button>
          <time className="rounded-full bg-white/75 px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            {today}
          </time>
        </div>
        <div className="[-webkit-app-region:no-drag]">{children}</div>
      </div>
    </header>
  );
}
