import { Capacitor } from "@capacitor/core";

/**
 * Native shell setup. Called once from main.jsx and does nothing at all on the
 * web, so the browser bundle never pulls these plugins in.
 */
export default async function initNative() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { StatusBar } = await import("@capacitor/status-bar");
    // Keep the WebView below the status bar rather than painting under it.
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (err) {
    console.warn("StatusBar unavailable:", err);
  }

  try {
    const { Keyboard, KeyboardResize } = await import("@capacitor/keyboard");
    // Resize the body so the bottom sheet lifts above the keyboard.
    await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
  } catch (err) {
    console.warn("Keyboard plugin unavailable:", err);
  }
}
