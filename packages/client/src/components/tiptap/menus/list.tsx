import React from "react";
import { Button, Tooltip } from "@douyinfe/semi-ui";
import {
  IconList,
  IconOrderedList,
  IconIndentLeft,
  IconIndentRight,
} from "@douyinfe/semi-icons";
import { IconTask } from "components/icons";
import { isTitleActive } from "../utils/active";

export const ListMenu: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <Tooltip zIndex={10000} content="无序列表">
        <Button
          theme={editor.isActive("bulletList") ? "light" : "borderless"}
          type="tertiary"
          icon={<IconList />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip zIndex={10000} content="有序列表">
        <Button
          theme={editor.isActive("orderedList") ? "light" : "borderless"}
          type="tertiary"
          icon={<IconOrderedList />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip zIndex={10000} content="任务列表">
        <Button
          theme={editor.isActive("taskList") ? "light" : "borderless"}
          type="tertiary"
          icon={<IconTask />}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip zIndex={10000} content="增加缩进">
        <Button
          onClick={() => {
            editor.chain().focus().indent().run();
          }}
          icon={<IconIndentRight />}
          theme={"borderless"}
          type="tertiary"
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip zIndex={10000} content="减少缩进">
        <Button
          onClick={() => {
            editor.chain().focus().outdent().run();
          }}
          icon={<IconIndentLeft />}
          theme={"borderless"}
          type="tertiary"
          disabled={isTitleActive(editor)}
        />
      </Tooltip>
    </>
  );
};
