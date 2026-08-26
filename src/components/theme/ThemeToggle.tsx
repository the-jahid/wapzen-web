"use client";

import { useTheme, useThemeChoiceAttribute } from "./ThemeProvider";
import type { ThemeChoice } from "./theme-constants";

type IconProps = { size?: number };

function SunIcon({ size = 15 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={size}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon({ size = 15 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
    </svg>
  );
}

function SystemIcon({ size = 15 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={size}
    >
      <rect height="12" rx="2" width="18" x="3" y="4" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

const options: Array<{ value: ThemeChoice; label: string; Icon: (p: IconProps) => React.JSX.Element }> = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: SystemIcon },
];

/**
 * The selected option is highlighted purely from `[data-theme-choice]` on
 * <html>, which the inline script sets before first paint. That keeps the
 * server and client markup identical — only the ARIA state is applied after
 * mount, which no user can see flash.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { setTheme } = useTheme();
  const choice = useThemeChoiceAttribute();

  return (
    <div
      aria-label="Colour theme"
      className={`theme-toggle ${className}`.trim()}
      role="group"
    >
      {options.map(({ value, label, Icon }) => (
        <button
          aria-label={`${label} theme`}
          aria-pressed={choice === null ? undefined : choice === value}
          className="theme-toggle-option"
          data-theme-value={value}
          key={value}
          onClick={() => setTheme(value)}
          title={`${label} theme`}
          type="button"
        >
          <Icon />
        </button>
      ))}
    </div>
  );
}

/**
 * Single-button variant for tight spots (marketing header). Flips between
 * light and dark; the icon is swapped by CSS so it is correct before paint.
 */
export function ThemeToggleButton({ className = "" }: { className?: string }) {
  const { toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle colour theme"
      className={`theme-toggle-button ${className}`.trim()}
      onClick={toggleTheme}
      title="Toggle colour theme"
      type="button"
    >
      <span className="theme-toggle-icon theme-toggle-icon-light">
        <SunIcon size={16} />
      </span>
      <span className="theme-toggle-icon theme-toggle-icon-dark">
        <MoonIcon size={16} />
      </span>
    </button>
  );
}
