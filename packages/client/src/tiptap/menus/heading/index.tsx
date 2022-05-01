import React, { useCallback } from 'react';
import { Editor } from '@tiptap/core';
import { Select } from '@douyinfe/semi-ui';
import { isTitleActive } from 'tiptap/prose-utils';

const getCurrentCaretTitle = (editor) => {
  if (editor.isActive('heading', { level: 1 })) return 1;
  if (editor.isActive('heading', { level: 2 })) return 2;
  if (editor.isActive('heading', { level: 3 })) return 3;
  if (editor.isActive('heading', { level: 4 })) return 4;
  if (editor.isActive('heading', { level: 5 })) return 5;
  if (editor.isActive('heading', { level: 6 })) return 6;
  return 'paragraph';
};

export const Heading: React.FC<{ editor: Editor }> = ({ editor }) => {
  const toggle = useCallback(
    (level) => {
      if (level === 'paragraph') {
        editor.chain().focus().setParagraph().run();
      } else {
        editor.chain().focus().toggleHeading({ level }).run();
      }
    },
    [editor]
  );

  return (
    <Select
      disabled={isTitleActive(editor)}
      value={getCurrentCaretTitle(editor)}
      onChange={toggle}
      style={{ width: 90, marginRight: 10 }}
    >
      <Select.Option value="paragraph">正文</Select.Option>
      <Select.Option value={1}>
        <h1 style={{ margin: 0, fontSize: '1.3em' }}>标题1</h1>
      </Select.Option>
      <Select.Option value={2}>
        <h2 style={{ margin: 0, fontSize: '1.1em' }}>标题2</h2>
      </Select.Option>
      <Select.Option value={3}>
        <h3 style={{ margin: 0, fontSize: '1.0em' }}>标题3</h3>
      </Select.Option>
      <Select.Option value={4}>
        <h4 style={{ margin: 0, fontSize: '0.9em' }}>标题4</h4>
      </Select.Option>
      <Select.Option value={5}>
        <h5 style={{ margin: 0, fontSize: '0.8em' }}>标题5</h5>
      </Select.Option>
      <Select.Option value={6}>
        <h6 style={{ margin: 0, fontSize: '0.8em' }}>标题6</h6>
      </Select.Option>
    </Select>
  );
};
