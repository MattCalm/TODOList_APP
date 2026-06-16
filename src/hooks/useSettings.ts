import { useEffect, useMemo, useState } from "react";
import { fonts } from "../config/fonts";
import { themes } from "../config/themes";
import { loadSettings, saveSettings } from "../utils/settingsStorage";
import type { AppSettings, FontId, ThemeId } from "../types/settings";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const selectedTheme = useMemo(
    () => themes.find((theme) => theme.id === settings.themeId) ?? themes[1],
    [settings.themeId],
  );
  const selectedFont = useMemo(
    () => fonts.find((font) => font.id === settings.fontId) ?? fonts[0],
    [settings.fontId],
  );

  const setThemeId = (themeId: ThemeId) => {
    setSettings((currentSettings) => ({ ...currentSettings, themeId }));
  };

  const setFontId = (fontId: FontId) => {
    setSettings((currentSettings) => ({ ...currentSettings, fontId }));
  };

  const setEmoji = (emoji: string) => {
    setSettings((currentSettings) => ({ ...currentSettings, emoji }));
  };

  return {
    settings,
    selectedTheme,
    selectedFont,
    setThemeId,
    setFontId,
    setEmoji,
  };
}
