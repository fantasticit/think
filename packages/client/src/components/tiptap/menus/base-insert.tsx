import React from "react";
import { Button, Tooltip } from "@douyinfe/semi-ui";
import {
  IconQuote,
  IconCheckboxIndeterminate,
  IconLink,
} from "@douyinfe/semi-icons";
import { isTitleActive } from "../utils/active";
import { Emoji } from "./components/emoji";

export const BaseInsertMenu: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <Emoji editor={editor} />

      <Tooltip zIndex={10000} content="插入链接">
        <Button
          theme={editor.isActive("link") ? "light" : "borderless"}
          type="tertiary"
          icon={<IconLink />}
          onClick={() => editor.chain().focus().toggleLink().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip zIndex={10000} content="插入引用">
        <Button
          theme={editor.isActive("blockquote") ? "light" : "borderless"}
          type="tertiary"
          icon={<IconQuote />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip zIndex={10000} content="插入分割线">
        <Button
          theme={"borderless"}
          type="tertiary"
          icon={<IconCheckboxIndeterminate />}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>
    </>
  );
};
