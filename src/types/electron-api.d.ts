export {};

declare global {
  interface Window {
    electronAPI?: {
      setAlwaysOnTop: (shouldPin: boolean) => Promise<boolean>;
      isAlwaysOnTop: () => Promise<boolean>;
      getWindowSize: () => Promise<{ width: number; height: number }>;
      setWindowSize: (width: number, height: number) => Promise<boolean>;
    };
  }
}
