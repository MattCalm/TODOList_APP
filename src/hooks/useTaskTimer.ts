import { useEffect, useMemo, useRef, useState } from "react";

const TIMER_CUSTOM_MINUTES_STORAGE_KEY = "moontodo.timer.customMinutes";
const LEGACY_TIMER_DURATION_STORAGE_KEY = "moontodo.timer.duration";
const DEFAULT_CUSTOM_MINUTES = "25";
const MIN_TIMER_MINUTES = 0;
const MAX_TIMER_MINUTES = 600;

const clampMinutes = (minutes: number) => {
  return Math.min(Math.max(Math.floor(minutes), MIN_TIMER_MINUTES), MAX_TIMER_MINUTES);
};

const normalizeMinutesInput = (value: string) => {
  const trimmedValue = value.trim();

  if (trimmedValue === "") {
    return "";
  }

  const numericValue = Number(trimmedValue);

  if (!Number.isFinite(numericValue)) {
    return trimmedValue;
  }

  return String(clampMinutes(numericValue));
};

const getValidMinutes = (value: string) => {
  if (value.trim() === "") {
    return undefined;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return undefined;
  }

  return clampMinutes(numericValue);
};

const loadCustomMinutes = () => {
  if (typeof window === "undefined") {
    return DEFAULT_CUSTOM_MINUTES;
  }

  const savedCustomMinutes = window.localStorage.getItem(TIMER_CUSTOM_MINUTES_STORAGE_KEY);

  if (savedCustomMinutes !== null) {
    return normalizeMinutesInput(savedCustomMinutes) || DEFAULT_CUSTOM_MINUTES;
  }

  const legacySavedDuration = window.localStorage.getItem(LEGACY_TIMER_DURATION_STORAGE_KEY);
  const legacySeconds = legacySavedDuration ? Number(legacySavedDuration) : NaN;

  if (Number.isFinite(legacySeconds)) {
    return String(clampMinutes(legacySeconds / 60));
  }

  return DEFAULT_CUSTOM_MINUTES;
};

const playTimerBeep = () => {
  try {
    const AudioContextClass =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const audioContext = new AudioContextClass();
    const now = audioContext.currentTime;

    [0, 0.18, 0.36].forEach((offset) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(740, now + offset);
      gainNode.gain.setValueAtTime(0.0001, now + offset);
      gainNode.gain.exponentialRampToValueAtTime(0.08, now + offset + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.14);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.15);
    });

    window.setTimeout(() => {
      void audioContext.close();
    }, 900);
  } catch {
    // Sound is a nice extra; the in-app reminder is the reliable fallback.
  }
};

const requestNotificationPermission = () => {
  if (!("Notification" in window) || Notification.permission !== "default") {
    return;
  }

  void Notification.requestPermission().catch(() => undefined);
};

const showSystemNotification = (taskTitle: string | undefined) => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  try {
    new Notification("Time is up!", {
      body: taskTitle ? `Time is up for: ${taskTitle}` : undefined,
    });
  } catch {
    // The in-app reminder remains visible if system notifications fail.
  }
};

export const formatTimerTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

export function useTaskTimer(defaultTodoId: number | undefined, getTodoTitle?: (id: number | undefined) => string | undefined) {
  const [customMinutes, setCustomMinutesState] = useState(loadCustomMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    return (getValidMinutes(loadCustomMinutes()) ?? Number(DEFAULT_CUSTOM_MINUTES)) * 60;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | undefined>();
  const [alertTodoId, setAlertTodoId] = useState<number | undefined>();
  const [hasFinished, setHasFinished] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | undefined>();
  const didRunAlarmRef = useRef(false);

  const durationSeconds = useMemo(() => {
    return (getValidMinutes(customMinutes) ?? 0) * 60;
  }, [customMinutes]);

  useEffect(() => {
    if (getValidMinutes(customMinutes) !== undefined) {
      window.localStorage.setItem(TIMER_CUSTOM_MINUTES_STORAGE_KEY, customMinutes);
    }
  }, [customMinutes]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          setIsRunning(false);
          setHasFinished(true);
          setAlertTodoId(selectedTodoId);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, selectedTodoId]);

  useEffect(() => {
    if (!hasFinished || didRunAlarmRef.current) {
      return;
    }

    const alertTaskTitle = getTodoTitle?.(alertTodoId);

    didRunAlarmRef.current = true;
    playTimerBeep();
    showSystemNotification(alertTaskTitle);
  }, [alertTodoId, getTodoTitle, hasFinished]);

  const setCustomMinutes = (value: string) => {
    const nextCustomMinutes = normalizeMinutesInput(value);
    const nextMinutes = getValidMinutes(nextCustomMinutes);

    setCustomMinutesState(nextCustomMinutes);
    setIsRunning(false);
    setHasFinished(false);
    didRunAlarmRef.current = false;
    setAlertTodoId(undefined);
    setValidationMessage(undefined);
    setRemainingSeconds((nextMinutes ?? 0) * 60);
  };

  const startTimer = () => {
    const minutes = getValidMinutes(customMinutes);
    const todoId = selectedTodoId ?? defaultTodoId;

    if (!minutes || minutes <= 0) {
      setValidationMessage("Please enter 1-600 minutes.");
      setIsRunning(false);
      return;
    }

    if (todoId === undefined) {
      return;
    }

    requestNotificationPermission();
    didRunAlarmRef.current = false;
    setSelectedTodoId(todoId);
    setValidationMessage(undefined);
    setHasFinished(false);
    setAlertTodoId(undefined);
    setRemainingSeconds((currentSeconds) => {
      return currentSeconds <= 0 ? minutes * 60 : currentSeconds;
    });
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingSeconds(durationSeconds);
    setSelectedTodoId(undefined);
    setAlertTodoId(undefined);
    setHasFinished(false);
    didRunAlarmRef.current = false;
    setValidationMessage(undefined);
  };

  const dismissAlert = () => {
    setAlertTodoId(undefined);
    setHasFinished(false);
    didRunAlarmRef.current = false;
  };

  return {
    alertTodoId,
    customMinutes,
    durationSeconds,
    hasFinished,
    isRunning,
    remainingSeconds,
    selectedTodoId: selectedTodoId ?? defaultTodoId,
    validationMessage,
    dismissAlert,
    pauseTimer,
    resetTimer,
    setCustomMinutes,
    startTimer,
  };
}
