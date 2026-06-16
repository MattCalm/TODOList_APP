import { defaultMascotEmoji, mascotEmojis } from "../config/emojis";
import { defaultFont, fonts } from "../config/fonts";
import { defaultTheme, themes } from "../config/themes";
import type { AppSettings } from "../types/settings";

const STORAGE_KEY = "moontodo.settings";

export const defaultSettings: AppSettings = {
  themeId: defaultTheme.id,
  fontId: defaultFont.id,
  emoji: defaultMascotEmoji,
};

const normalizeSettings = (settings: Partial<AppSettings>): AppSettings => {
  const themeExists = themes.some((theme) => theme.id === settings.themeId);
  const fontExists = fonts.some((font) => font.id === settings.fontId);
  const emojiExists = mascotEmojis.includes(settings.emoji ?? "");

  return {
    themeId: themeExists ? settings.themeId! : defaultSettings.themeId,
    fontId: fontExists ? settings.fontId! : defaultSettings.fontId,
    emoji: emojiExists ? settings.emoji! : defaultSettings.emoji,
  };
};

export const loadSettings = (): AppSettings => {
  try {
    const savedSettings = window.localStorage.getItem(STORAGE_KEY);

    if (!savedSettings) {
      return defaultSettings;
    }

    return normalizeSettings(JSON.parse(savedSettings) as Partial<AppSettings>);
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: AppSettings) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};
