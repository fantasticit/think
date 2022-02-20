import React from "react";
import { Button, Tooltip } from "@douyinfe/semi-ui";
import {
  IconBold,
  IconItalic,
  IconStrikeThrough,
  IconUnderline,
  IconCode,
} from "@douyinfe/semi-icons";
import { isTitleActive } from "../utils/active";
import { ColorMenu } from "./color";

export const BaseMenu: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <Tooltip zIndex={10000} content="粗体">
        <Button
          theme={editor.isActive("bold") ? "light" : "borderless"}
          type="tertiary"
          icon={<IconBold />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip zIndex={10000} content="斜体">
        <Button
          theme={editor.isActive("italic") ? "light" : "borderless"}
          type="tertiary"
          icon={<IconItalic />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip zIndex={10000} content="下划线">
        <Button
          theme={editor.isActive("underline") ? "light" : "borderless"}
          type="tertiary"
          icon={<IconUnderline />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip zIndex={10000} content="删除线">
        <Button
          theme={editor.isActive("strike") ? "light" : "borderless"}
          type="tertiary"
          icon={<IconStrikeThrough />}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip zIndex={10000} content="行内代码">
        <Button
          theme={editor.isActive("code") ? "light" : "borderless"}
          type="tertiary"
          icon={<IconCode />}
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <ColorMenu editor={editor} />
    </>
  );
};
