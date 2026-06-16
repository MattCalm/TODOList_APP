import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

const MIN_WIDTH = 320;
const MIN_HEIGHT = 420;
const MAX_WIDTH = 720;
const MAX_HEIGHT = 1000;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

type ResizeState = {
  pointerId: number;
  startMouseX: number;
  startMouseY: number;
  startWidth: number;
  startHeight: number;
};

export function ResizeHandle() {
  const resizeState = useRef<ResizeState | null>(null);

  useEffect(() => {
    const stopResizing = () => {
      resizeState.current = null;
      document.body.style.userSelect = "";
    };

    const handlePointerMove = (event: PointerEvent) => {
      const state = resizeState.current;

      if (!state || state.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.screenX - state.startMouseX;
      const deltaY = event.screenY - state.startMouseY;
      const nextWidth = clamp(state.startWidth + deltaX, MIN_WIDTH, MAX_WIDTH);
      const nextHeight = clamp(state.startHeight + deltaY, MIN_HEIGHT, MAX_HEIGHT);

      window.electronAPI?.setWindowSize(
        Math.round(nextWidth),
        Math.round(nextHeight),
      );
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);
    window.addEventListener("pointercancel", stopResizing);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
      window.removeEventListener("pointercancel", stopResizing);
      document.body.style.userSelect = "";
    };
  }, []);

  const handlePointerDown = async (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.style.userSelect = "none";

    const size = await window.electronAPI?.getWindowSize();

    resizeState.current = {
      pointerId: event.pointerId,
      startMouseX: event.screenX,
      startMouseY: event.screenY,
      startWidth: size?.width ?? window.innerWidth,
      startHeight: size?.height ?? window.innerHeight,
    };
  };

  return (
    <button
      type="button"
      aria-label="Resize window"
      onPointerDown={handlePointerDown}
      className="pointer-events-auto absolute bottom-2 right-2 h-6 w-6 cursor-nwse-resize rounded-full bg-white/45 text-xs font-bold text-slate-300 shadow-sm transition hover:bg-white/75 hover:text-slate-500 [-webkit-app-region:no-drag]"
    >
      //
    </button>
  );
}
