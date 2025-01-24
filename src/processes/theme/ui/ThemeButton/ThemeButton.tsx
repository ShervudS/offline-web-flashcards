import { useEffect, useState } from "react";

import { WINDOW_MATH_MEDIA } from "_configs/index";

const STORAGE_THEME_KEY = "theme";
const THEME_DATA_ATTR = "data-theme";
const enum THEME {
  DARK = "dark",
  LIGHT = "light",
}

export const ThemeButton = () => {
  const [theme, setTheme] = useState<THEME | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) as THEME;
      const systemPrefersDark = window.matchMedia(
        WINDOW_MATH_MEDIA.PREFERS_COLOR_SCHEME
      ).matches;

      setTheme(savedTheme || (systemPrefersDark ? THEME.DARK : THEME.LIGHT));
    }
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute(THEME_DATA_ATTR, theme);

      localStorage.setItem(STORAGE_THEME_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    );
  };

  return <button onClick={toggleTheme}>Theme</button>;
};
