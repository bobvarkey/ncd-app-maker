import { useEffect, useState } from "react";

export type AppMode = "easy" | "complex";

const KEY = "ncd_app_mode";

function read(): AppMode {
  if (typeof window === "undefined") return "complex";
  const v = window.localStorage.getItem(KEY);
  return v === "easy" ? "easy" : "complex";
}

export function useMode(): [AppMode, (m: AppMode) => void] {
  const [mode, setModeState] = useState<AppMode>(read());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setModeState(read());
    };
    const onCustom = () => setModeState(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("ncd-mode-change", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ncd-mode-change", onCustom);
    };
  }, []);

  const setMode = (m: AppMode) => {
    window.localStorage.setItem(KEY, m);
    window.dispatchEvent(new Event("ncd-mode-change"));
    setModeState(m);
  };

  return [mode, setMode];
}
