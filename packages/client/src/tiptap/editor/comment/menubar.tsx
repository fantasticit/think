import React from 'react';
import { Editor } from 'tiptap/editor';
import { Space } from '@douyinfe/semi-ui';
import { Divider } from 'tiptap/components/divider';

import { Undo } from 'tiptap/editor/menus/undo';
import { Redo } from 'tiptap/editor/menus/redo';
import { CleadrNodeAndMarks } from 'tiptap/editor/menus/clear-node-and-marks';

import { Heading } from 'tiptap/editor/menus/heading';
import { Bold } from 'tiptap/editor/menus/bold';
import { Italic } from 'tiptap/editor/menus/italic';
import { Underline } from 'tiptap/editor/menus/underline';
import { Strike } from 'tiptap/editor/menus/strike';
import { Code } from 'tiptap/editor/menus/code';
import { Superscript } from 'tiptap/editor/menus/superscript';
import { Subscript } from 'tiptap/editor/menus/subscript';
import { TextColor } from 'tiptap/editor/menus/text-color';
import { BackgroundColor } from 'tiptap/editor/menus/background-color';

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
