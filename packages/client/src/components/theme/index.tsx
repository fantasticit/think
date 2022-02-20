import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@douyinfe/semi-ui";
import { IconSun, IconMoon } from "@douyinfe/semi-icons";
import { useTheme } from "hooks/useTheme";

export const Theme = () => {
  const { theme, toggle } = useTheme();
  const Icon = theme === "dark" ? IconSun : IconMoon;
  const text = theme === "dark" ? "切换到亮色模式" : "切换到深色模式";

  return (
    <Tooltip content={text} position="bottom">
      <Button
        onClick={toggle}
        icon={<Icon style={{ fontSize: 20 }} />}
        theme="borderless"
      ></Button>
    </Tooltip>
  );
};
