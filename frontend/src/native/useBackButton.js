import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Runs `handler` when the Android hardware back button is pressed, for as long
 * as the calling component is mounted. No-ops on the web, where Escape and the
 * backdrop already cover dismissal.
 */
export default function useBackButton(handler) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let remove = null;
    let cancelled = false;

    import("@capacitor/app").then(({ App }) => {
      if (cancelled) return;
      App.addListener("backButton", () => handler?.()).then((listener) => {
        if (cancelled) listener.remove();
        else remove = () => listener.remove();
      });
    });

    return () => {
      cancelled = true;
      remove?.();
    };
  }, [handler]);
}
