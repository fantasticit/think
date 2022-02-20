import React from "react";
import { Button, Dropdown, Tooltip } from "@douyinfe/semi-ui";
import {
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustify,
} from "@douyinfe/semi-icons";
import { isTitleActive } from "../utils/active";

export const AlignMenu = ({ editor }) => {
  const current = (() => {
    if (editor.isActive({ textAlign: "center" })) {
      return <IconAlignCenter />;
    }
    if (editor.isActive({ textAlign: "right" })) {
      return <IconAlignRight />;
    }
    if (editor.isActive({ textAlign: "justify" })) {
      return <IconAlignJustify />;
    }
    return <IconAlignLeft />;
  })();

  const toggle = (align) => {
    return () => editor.chain().focus().setTextAlign(align).run();
  };

  return (
    <Dropdown
      trigger="click"
      render={
        <>
          <Tooltip content="左对齐">
            <Button
              onClick={toggle("left")}
              icon={<IconAlignLeft />}
              type="tertiary"
              theme="borderless"
            />
          </Tooltip>
          <Tooltip content="居中">
            <Button
              onClick={toggle("center")}
              icon={<IconAlignCenter />}
              type="tertiary"
              theme="borderless"
            />
          </Tooltip>
          <Tooltip content="右对齐">
            <Button
              onClick={toggle("right")}
              icon={<IconAlignRight />}
              type="tertiary"
              theme="borderless"
            />
          </Tooltip>
          <Tooltip content="两端对齐">
            <Button
              onClick={toggle("justify")}
              icon={<IconAlignJustify />}
              type="tertiary"
              theme="borderless"
            />
          </Tooltip>
        </>
      }
    >
      <span>
        <Tooltip content="对齐方式" spacing={6}>
          <Button
            type="tertiary"
            theme="borderless"
            icon={current}
            disabled={isTitleActive(editor)}
          ></Button>
        </Tooltip>
      </span>
    </Dropdown>
  );
};
