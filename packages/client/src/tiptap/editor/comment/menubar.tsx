import { Space } from '@douyinfe/semi-ui';
import React from 'react';
import { Divider } from 'tiptap/components/divider';
import { Editor } from 'tiptap/editor';
import { BackgroundColor } from 'tiptap/editor/menus/background-color';
import { Bold } from 'tiptap/editor/menus/bold';
import { CleadrNodeAndMarks } from 'tiptap/editor/menus/clear-node-and-marks';
import { Code } from 'tiptap/editor/menus/code';
import { Heading } from 'tiptap/editor/menus/heading';
import { Italic } from 'tiptap/editor/menus/italic';
import { Redo } from 'tiptap/editor/menus/redo';
import { Strike } from 'tiptap/editor/menus/strike';
import { Subscript } from 'tiptap/editor/menus/subscript';
import { Superscript } from 'tiptap/editor/menus/superscript';
import { TextColor } from 'tiptap/editor/menus/text-color';
import { Underline } from 'tiptap/editor/menus/underline';
import { Undo } from 'tiptap/editor/menus/undo';

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
