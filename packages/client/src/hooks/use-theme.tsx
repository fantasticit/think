import { useCallback, useEffect, useState } from 'react';

import { createGlobalHook } from './create-global-hook';

export enum ThemeEnum {
  'dark' = 'dark',
  'light' = 'light',
}

const useThemeHook = () => {
  const [theme, setTheme] = useState(ThemeEnum.light);

  const toggle = useCallback(() => {
    const nextTheme = theme === 'dark' ? ThemeEnum.light : ThemeEnum.dark;
    setTheme(nextTheme);
  }, [theme]);

  useEffect(() => {
    const body = document.body;
    if (theme === 'dark') {
      body.setAttribute('theme-mode', 'dark');
      return;
    }
    if (theme === 'light') {
      body.setAttribute('theme-mode', 'light');
      return;
    }
  }, [theme]);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    function matchMode(e) {
      if (e.matches) {
        setTheme(ThemeEnum.dark);
      } else {
        setTheme(ThemeEnum.light);
      }
    }

    matchMode(mql);
    mql.addEventListener('change', matchMode);

    return () => {
      mql.removeEventListener('change', matchMode);
    };
  }, []);

  return {
    theme,
    toggle,
  };
};

export const Theme = createGlobalHook<{ theme: ThemeEnum; toggle: () => void }>(useThemeHook);
