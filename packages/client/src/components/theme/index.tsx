import { IconMoon, IconSun } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { Theme as ThemeState } from 'hooks/use-theme';
import React from 'react';

export const Theme = () => {
  const { theme, toggle } = ThemeState.useHook();
  const Icon = theme === 'dark' ? IconSun : IconMoon;
  const text = theme === 'dark' ? '切换到亮色模式' : '切换到深色模式';

  return (
    <Tooltip content={text} position="bottom">
      <Button onClick={toggle} icon={<Icon style={{ fontSize: 20 }} />} theme="borderless"></Button>
    </Tooltip>
  );
};
