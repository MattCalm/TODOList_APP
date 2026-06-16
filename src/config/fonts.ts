import type { FontOption } from "../types/settings";

export const fonts: FontOption[] = [
  {
    id: "default",
    label: "Default",
    className: "font-sans",
  },
  {
    id: "serif",
    label: "Serif",
    className: "font-serif",
  },
  {
    id: "rounded",
    label: "Rounded",
    className: "font-rounded",
  },
  {
    id: "mono",
    label: "Mono",
    className: "font-mono",
  },
  {
    id: "cute",
    label: "Cute",
    className: "font-cute",
  },
];

export const defaultFont = fonts[0];
