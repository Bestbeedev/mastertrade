import { useEffect, useState } from "react";

export function useSplashScreen(options?: { minDurationMs?: number; storageKey?: string }) {
  const { minDurationMs = 1200, storageKey = "splash_shown" } = options || {};
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const shown = localStorage.getItem(storageKey);
      if (!shown) {
        setVisible(true);
        const t = setTimeout(() => {
          localStorage.setItem(storageKey, "1");
          setVisible(false);
        }, minDurationMs);
        return () => clearTimeout(t);
      }
    } catch {
      // ignore
    }
  }, [minDurationMs, storageKey]);

  const hide = () => setVisible(false);

  return { visible, hide } as const;
}
