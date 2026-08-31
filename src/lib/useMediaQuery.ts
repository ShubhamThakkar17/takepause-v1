import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query without an effect, so the first render already
 * knows the answer and there is no cascading re-render.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // Nothing is pre-rendered on a server, but a stable default keeps the
    // pinned layout from being assumed on a narrow screen.
    () => false,
  );
}
