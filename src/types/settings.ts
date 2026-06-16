export type ThemeId =
  | "creamVanilla"
  | "lavenderMilk"
  | "peachSoda"
  | "mintCream"
  | "babyBlue"
  | "strawberryMilk"
  | "lemonChiffon"
  | "matchaLatte";

export type FontId = "default" | "serif" | "rounded" | "mono" | "cute";

export type MoonTodoTheme = {
  id: ThemeId;
  label: string;
  background: string;
  cardBackground: string;
  accent: string;
  text: string;
  mutedText: string;
  border: string;
  progress: string;
  nowBackground: string;
  nowText: string;
  nowMutedText: string;
  nowAccent: string;
  selectedTabBackground: string;
  selectedTabText: string;
  unselectedTabText: string;
};

export type FontOption = {
  id: FontId;
  label: string;
  className: string;
};

export type AppSettings = {
  themeId: ThemeId;
  fontId: FontId;
  emoji: string;
};
