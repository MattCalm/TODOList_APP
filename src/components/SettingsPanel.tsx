import { mascotEmojis } from "../config/emojis";
import { fonts } from "../config/fonts";
import { themes } from "../config/themes";
import type {
  AppSettings,
  FontId,
  MoonTodoTheme,
  ThemeId,
} from "../types/settings";

type SettingsPanelProps = {
  settings: AppSettings;
  selectedTheme: MoonTodoTheme;
  onSelectTheme: (themeId: ThemeId) => void;
  onSelectFont: (fontId: FontId) => void;
  onSelectEmoji: (emoji: string) => void;
};

export function SettingsPanel({
  settings,
  selectedTheme,
  onSelectTheme,
  onSelectFont,
  onSelectEmoji,
}: SettingsPanelProps) {
  return (
    <section
      className={`rounded-3xl border px-4 py-3 shadow-sm [-webkit-app-region:no-drag] ${selectedTheme.border} ${selectedTheme.cardBackground}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className={`text-xs font-bold uppercase tracking-[0.18em] ${selectedTheme.mutedText}`}>
          Settings
        </h2>
        <span className="text-sm">Cute mode</span>
      </div>

      <div className="space-y-3">
        <div>
          <p className={`mb-1.5 text-xs font-bold ${selectedTheme.mutedText}`}>
            Theme
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelectTheme(theme.id)}
                title={theme.label}
                aria-label={`Use ${theme.label} theme`}
                className={`h-8 rounded-2xl border-2 [-webkit-app-region:no-drag] ${theme.accent} ${
                  settings.themeId === theme.id
                    ? "border-slate-950"
                    : "border-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <p className={`mb-1.5 text-xs font-bold ${selectedTheme.mutedText}`}>
            Font
          </p>
          <div className="grid grid-cols-5 gap-1">
            {fonts.map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => onSelectFont(font.id)}
                className={`rounded-xl px-2 py-1.5 text-xs font-bold transition [-webkit-app-region:no-drag] ${
                  settings.fontId === font.id
                    ? "bg-slate-950 text-white"
                    : "bg-white/60 text-slate-500 hover:text-slate-800"
                } ${font.className}`}
              >
                {font.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className={`mb-1.5 text-xs font-bold ${selectedTheme.mutedText}`}>
            Mascot
          </p>
          <div className="grid grid-cols-10 gap-1">
            {mascotEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onSelectEmoji(emoji)}
                className={`h-7 rounded-xl text-base transition [-webkit-app-region:no-drag] ${
                  settings.emoji === emoji
                    ? "bg-slate-950"
                    : "bg-white/60 hover:bg-white"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
