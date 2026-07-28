"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_CHANGE_EVENT = "themechange";

function getTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const isDark = theme === "dark";

  useEffect(() => {
    const syncTheme = () => setTheme(getTheme());

    syncTheme();
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);

    try {
      localStorage.setItem("theme", next);
    } catch {
      // The theme still applies when storage is unavailable or blocked.
    }

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
        onClick={toggle}
        className={`flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/50 ${
          isDark ? "bg-accent" : "bg-line-strong"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            isDark ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <span className="hidden whitespace-nowrap text-sm font-medium text-muted sm:inline">
        {isDark ? "Dark" : "Light"}
      </span>
    </div>
  );
}
