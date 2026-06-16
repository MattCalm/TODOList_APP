# MoonTodo

MoonTodo is a soft, pastel desktop todo widget built with Electron, React,
TypeScript, Vite, and Tailwind CSS.

It opens as a small frameless desktop window and keeps tasks locally on the
user's computer with `localStorage`.

## Features

- Add, edit, delete, complete, and reorder tasks
- Local task persistence with `localStorage`
- Now section showing the first unfinished task by priority
- All, Active, and Completed filters
- Clear completed tasks
- Compact mode with clickable tasks
- Custom themes, fonts, and mascot emoji
- Theme-aware Now card and filter highlights
- Focus timer with custom 0-600 minute input
- Timer reminder banner, optional browser notification, and Web Audio beep
- Always-on-top pin toggle
- Frameless draggable window with custom resize handle
- Windows installer and portable app builds with electron-builder

## Tech Stack

- Electron
- React
- TypeScript
- Vite
- Tailwind CSS
- dnd-kit for task drag-and-drop
- electron-builder for Windows packaging

## Getting Started

Install dependencies:

```bash
npm install
```

Run the app in development:

```bash
npm run dev
```

This starts the Vite renderer and then launches Electron.

You can also run only the renderer preview:

```bash
npm run dev:renderer
```

## Build

Create a production renderer build and compile Electron:

```bash
npm run build
```

Create Windows shareable builds:

```bash
npm run dist
```

The generated installer and portable executable are placed in:

```text
dist/release
```

Send the installer or portable `.exe` from that folder to another Windows
computer. Because the app is unsigned, Windows may show a security warning.
Choose "More info" and "Run anyway" only if you trust the file source.

## Project Structure

```text
electron/
  main.ts          Electron window, production loading, and IPC handlers
  preload.ts       Safe renderer API exposed through contextBridge

src/
  components/      React UI components
  config/          Themes, fonts, and emoji options
  data/            Starter sample todos
  hooks/           Todo, settings, and timer logic
  types/           Shared TypeScript types
  utils/           Settings storage helpers
```

## Important Files

- `electron/main.ts` controls the Electron window size, frameless window, IPC,
  production loading path, always-on-top state, and resize behavior.
- `electron/preload.ts` exposes safe APIs like `setAlwaysOnTop`,
  `isAlwaysOnTop`, `getWindowSize`, and `setWindowSize`.
- `src/components/TodoWindow.tsx` connects app state to the main UI and compact
  UI.
- `src/hooks/useTodos.ts` owns todo state, ordering, and task persistence.
- `src/hooks/useSettings.ts` owns selected theme, font, and mascot settings.
- `src/hooks/useTaskTimer.ts` owns the shared full/compact timer state.
- `src/config/themes.ts` is where pastel theme colors are defined.

## Data Flow

Todos are loaded in `useTodos` from:

```text
moontodo.todos
```

If no saved todos exist, MoonTodo starts with `sampleTodos`.

When the user adds, edits, deletes, completes, clears, or reorders tasks,
`useTodos` updates React state. A `useEffect` then saves the latest todo list
back to `localStorage`.

Settings are loaded and saved through:

```text
moontodo.settings
```

The timer duration preference is stored as:

```text
moontodo.timer.customMinutes
```

The active countdown itself is not persisted yet. This keeps the MVP timer
simple and predictable.

## Timer Behavior

The timer is shared between full mode and compact mode through
`src/hooks/useTaskTimer.ts`.

In full mode, the user can enter any whole-minute duration from `0` to `600`.
Values above `600` clamp to `600`; values below `0` clamp to `0`.

Starting with `0` minutes shows a soft validation message instead of starting.
When the timer reaches `0`, MoonTodo shows an in-app reminder and tries to play
a short Web Audio beep. If browser notifications are allowed, it also sends a
system notification.

## Customization

Add more themes in:

```text
src/config/themes.ts
```

Add more font options in:

```text
src/config/fonts.ts
```

Add more mascot emoji options in:

```text
src/config/emojis.ts
```

## Notes

- There is no login.
- There is no cloud database.
- There is no Google Calendar sync.
- There is no real AI API yet.
- All MVP data is local to the user's machine.
