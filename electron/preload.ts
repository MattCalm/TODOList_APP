import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  setAlwaysOnTop: (shouldPin: boolean): Promise<boolean> => {
    return ipcRenderer.invoke("window:set-always-on-top", shouldPin);
  },
  isAlwaysOnTop: (): Promise<boolean> => {
    return ipcRenderer.invoke("window:is-always-on-top");
  },
  getWindowSize: (): Promise<{ width: number; height: number }> => {
    return ipcRenderer.invoke("window:get-size");
  },
  setWindowSize: (width: number, height: number): Promise<boolean> => {
    return ipcRenderer.invoke("window:set-size", width, height);
  },
});
