import { useEffect, useState } from "react";

export enum Theme {
  "dark" = "dark",
  "light" = "light",
}

export const useTheme = () => {
  const [theme, setTheme] = useState(Theme.light);

  const toggle = () => {
    const nextTheme = theme === "dark" ? Theme.light : Theme.dark;
    setTheme(nextTheme);
  };

  useEffect(() => {
    const body = document.body;
    if (theme === "dark") {
      body.setAttribute("theme-mode", "dark");
      return;
    }

    if (theme === "light") {
      body.setAttribute("theme-mode", "light");
      return;
    }
  }, [theme]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    function matchMode(e) {
      if (e.matches) {
        setTheme(Theme.dark);
      } else {
        setTheme(Theme.light);
      }
    }

    matchMode(mql);
    mql.addEventListener("change", matchMode);
  }, []);

  return {
    theme,
    toggle,
  };
};
