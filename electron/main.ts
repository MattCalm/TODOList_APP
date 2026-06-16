import { app, BrowserWindow, ipcMain } from "electron";
import fs from "node:fs";
import path from "node:path";

const logProductionIssue = (message: string, details: unknown) => {
  console.error(message, details);

  if (!app.isPackaged) {
    return;
  }

  try {
    const logPath = path.join(app.getPath("userData"), "load-errors.log");
    const timestamp = new Date().toISOString();
    const payload =
      typeof details === "string" ? details : JSON.stringify(details, null, 2);

    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n${payload}\n\n`);
  } catch (error) {
    console.error("Failed to write MoonTodo load log", error);
  }
};

const createWindow = () => {
  const window = new BrowserWindow({
    width: 420,
    height: 650,
    minWidth: 320,
    minHeight: 420,
    maxWidth: 720,
    maxHeight: 1000,
    resizable: true,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    title: "MoonTodo",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  window.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription, validatedURL) => {
      logProductionIssue("MoonTodo failed to load renderer", {
        errorCode,
        errorDescription,
        validatedURL,
      });
    },
  );

  window.webContents.on("render-process-gone", (_event, details) => {
    logProductionIssue("MoonTodo renderer process went away", details);
  });

  if (app.isPackaged) {
    const rendererPath = path.join(app.getAppPath(), "dist", "index.html");
    window.loadFile(rendererPath);
  } else {
    window.loadURL("http://127.0.0.1:5173");
  }
};

ipcMain.handle("window:set-always-on-top", (event, shouldPin: boolean) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  if (!window) {
    return false;
  }

  window.setAlwaysOnTop(shouldPin);
  return window.isAlwaysOnTop();
});

ipcMain.handle("window:is-always-on-top", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  if (!window) {
    return false;
  }

  return window.isAlwaysOnTop();
});

ipcMain.handle("window:get-size", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  if (!window) {
    return { width: 420, height: 650 };
  }

  const [width, height] = window.getSize();
  return { width, height };
});

ipcMain.handle("window:set-size", (event, width: number, height: number) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  if (!window) {
    return false;
  }

  const safeWidth = Math.round(Math.min(Math.max(width, 320), 720));
  const safeHeight = Math.round(Math.min(Math.max(height, 420), 1000));

  const bounds = window.getBounds();

  window.setBounds(
    {
      x: bounds.x,
      y: bounds.y,
      width: safeWidth,
      height: safeHeight,
    },
    false
  );

  return true;
});
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
