import React, { useCallback } from "react";
import { Select } from "@douyinfe/semi-ui";
import { isTitleActive } from "../../utils/active";

const getCurrentCaretTitle = (editor) => {
  if (editor.isActive("heading", { level: 1 })) return 1;
  if (editor.isActive("heading", { level: 2 })) return 2;
  if (editor.isActive("heading", { level: 3 })) return 3;
  if (editor.isActive("heading", { level: 4 })) return 4;
  if (editor.isActive("heading", { level: 5 })) return 5;
  if (editor.isActive("heading", { level: 6 })) return 6;
  return "paragraph";
};

export const Paragraph = ({ editor }) => {
  const toggle = useCallback((level) => {
    if (level === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  }, []);

  return (
    <Select
      disabled={isTitleActive(editor)}
      value={getCurrentCaretTitle(editor)}
      onChange={toggle}
      style={{ width: 90, marginRight: 10 }}
    >
      <Select.Option value="paragraph">正文</Select.Option>
      <Select.Option value={1}>标题1</Select.Option>
      <Select.Option value={2}>标题2</Select.Option>
      <Select.Option value={3}>标题3</Select.Option>
      <Select.Option value={4}>标题4</Select.Option>
      <Select.Option value={5}>标题5</Select.Option>
      <Select.Option value={6}>标题6</Select.Option>
    </Select>
  );
};
