/**
 * Shared between the no-flash inline script (which runs during HTML parsing,
 * before React exists) and the React provider. Both read the same storage key
 * so the DOM the script produces always matches the provider's initial state.
 */
export const THEME_STORAGE_KEY = "voca-theme";

export type ThemeChoice = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const DEFAULT_THEME: ThemeChoice = "system";

/**
 * Two attributes land on <html>:
 *   data-theme        — the resolved theme ("light" | "dark"); drives all colours
 *   data-theme-choice — the raw preference ("light" | "dark" | "system"); lets the
 *                       toggle show its selected option from CSS alone, so the
 *                       markup is identical on server and client
 *
 * Runs synchronously in <head> so both are set before first paint. Kept
 * dependency-free and wrapped in try/catch: localStorage throws in private-mode
 * Safari and when cookies are blocked.
 */
export const themeInitScript = `(function(){try{var k="${THEME_STORAGE_KEY}",s=localStorage.getItem(k),c=(s==="light"||s==="dark")?s:"system",m=window.matchMedia("(prefers-color-scheme: dark)").matches,t=c==="system"?(m?"dark":"light"):c,e=document.documentElement;e.setAttribute("data-theme",t);e.setAttribute("data-theme-choice",c);e.style.colorScheme=t}catch(e){}})()`;
