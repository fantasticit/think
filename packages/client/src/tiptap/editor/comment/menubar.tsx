import { Space } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import React from 'react';
import { Editor } from 'tiptap/core';
import { BackgroundColor } from 'tiptap/core/menus/background-color';
import { Bold } from 'tiptap/core/menus/bold';
import { CleadrNodeAndMarks } from 'tiptap/core/menus/clear-node-and-marks';
import { Code } from 'tiptap/core/menus/code';
import { Heading } from 'tiptap/core/menus/heading';
import { Italic } from 'tiptap/core/menus/italic';
import { Redo } from 'tiptap/core/menus/redo';
import { Strike } from 'tiptap/core/menus/strike';
import { Subscript } from 'tiptap/core/menus/subscript';
import { Superscript } from 'tiptap/core/menus/superscript';
import { TextColor } from 'tiptap/core/menus/text-color';
import { Underline } from 'tiptap/core/menus/underline';
import { Undo } from 'tiptap/core/menus/undo';

const _CommentMenuBar: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <Space spacing={2}>
        <Undo editor={editor} />
        <Redo editor={editor} />
        <CleadrNodeAndMarks editor={editor} />

        <Divider />

        <Heading editor={editor} />
        <Bold editor={editor} />
        <Italic editor={editor} />
        <Underline editor={editor} />
        <Strike editor={editor} />
        <Code editor={editor} />
        <Superscript editor={editor} />
        <Subscript editor={editor} />
        <TextColor editor={editor} />
        <BackgroundColor editor={editor} />
      </Space>
    </>
  );
};

export const CommentMenuBar = React.memo(_CommentMenuBar, (prevProps, nextProps) => {
  return prevProps.editor === nextProps.editor;
});
