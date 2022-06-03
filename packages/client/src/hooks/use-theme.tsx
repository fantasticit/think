import { useCallback, useEffect, useRef, useState } from 'react';

import { createGlobalHook } from './create-global-hook';

export enum ThemeEnum {
  'dark' = 'dark',
  'light' = 'light',
  'system' = 'system',
}

function syncSystemTheme() {
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  function matchMode(e) {
    if (e.matches) {
      document.body.setAttribute('theme-mode', 'dark');
    } else {
      document.body.setAttribute('theme-mode', 'light');
    }
  }
  matchMode(mql);
}

const useThemeHook = () => {
  const $remove = useRef<() => void>();
  const [theme, setTheme] = useState(ThemeEnum.system);
  const [userPrefer, setUserPrefer] = useState(ThemeEnum.system);

  const followSystem = useCallback(() => {
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

    const remove = () => {
      mql.removeEventListener('change', matchMode);
    };

    $remove.current = remove;
  }, []);

  const toggle = useCallback(
    (nextTheme: ThemeEnum) => {
      setUserPrefer(nextTheme);
      setTheme(nextTheme);
      if (nextTheme !== ThemeEnum.system) {
        $remove.current && $remove.current();
      } else {
        followSystem();
      }
    },
    [followSystem]
  );

  useEffect(() => {
    const body = document.body;

    switch (theme) {
      case ThemeEnum.light:
        body.setAttribute('theme-mode', 'light');
        return;

      case ThemeEnum.dark:
        body.setAttribute('theme-mode', 'dark');
        return;

      case ThemeEnum.system:
      default:
        syncSystemTheme();
        return;
    }
  }, [theme]);

  useEffect(() => {
    if (theme === ThemeEnum.system) {
      followSystem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    userPrefer,
    theme,
    toggle,
  };
};

export const Theme =
  createGlobalHook<{ userPrefer: ThemeEnum; theme: ThemeEnum; toggle: (nextTheme: ThemeEnum) => void }>(useThemeHook);
