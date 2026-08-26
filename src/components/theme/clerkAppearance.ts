import type { ResolvedTheme } from "./theme-constants";

/**
 * Clerk renders its own surfaces (the UserButton popover, modals) and derives
 * alpha scales from these values at runtime, so they must be concrete colours —
 * `var(--app-*)` would not parse. Keep them in step with globals.css.
 */
const palettes = {
  light: {
    colorBackground: "#ffffff",
    colorForeground: "#171a21",
    colorMutedForeground: "#5b6070",
    colorInput: "#ffffff",
    colorInputForeground: "#171a21",
    colorBorder: "#d9dce4",
    colorNeutral: "#0f1423",
    colorShadow: "#0f172a",
  },
  dark: {
    colorBackground: "#17181d",
    colorForeground: "#ededf0",
    colorMutedForeground: "#8b8b94",
    colorInput: "#131418",
    colorInputForeground: "#ededf0",
    colorBorder: "#30313a",
    colorNeutral: "#ffffff",
    colorShadow: "#000000",
  },
} as const;

export function clerkAppearance(theme: ResolvedTheme, avatarSize = 34) {
  return {
    variables: { colorPrimary: "#4f46e5", ...palettes[theme] },
    elements: { avatarBox: { height: avatarSize, width: avatarSize } },
  };
}
