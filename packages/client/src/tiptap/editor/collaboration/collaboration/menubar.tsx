import React, { useMemo } from 'react';
import { Space } from '@douyinfe/semi-ui';
import { Divider } from 'tiptap/components/divider';
import { Editor } from 'tiptap/editor';

import { Insert } from 'tiptap/editor/menus/insert';
import { Undo } from 'tiptap/editor/menus/undo';
import { Redo } from 'tiptap/editor/menus/redo';
import { CleadrNodeAndMarks } from 'tiptap/editor/menus/clear-node-and-marks';

import { Heading } from 'tiptap/editor/menus/heading';
import { FontSize } from 'tiptap/editor/menus/fontsize';
import { Bold } from 'tiptap/editor/menus/bold';
import { Italic } from 'tiptap/editor/menus/italic';
import { Underline } from 'tiptap/editor/menus/underline';
import { Strike } from 'tiptap/editor/menus/strike';
import { Code } from 'tiptap/editor/menus/code';
import { Superscript } from 'tiptap/editor/menus/superscript';
import { Subscript } from 'tiptap/editor/menus/subscript';
import { TextColor } from 'tiptap/editor/menus/text-color';
import { BackgroundColor } from 'tiptap/editor/menus/background-color';

import { Align } from 'tiptap/editor/menus/align';

import { BulletList } from 'tiptap/editor/menus/bullet-list';
import { OrderedList } from 'tiptap/editor/menus/ordered-list';
import { TaskList } from 'tiptap/editor/menus/task-list';
import { Ident } from 'tiptap/editor/menus/ident';

import { Emoji } from 'tiptap/editor/menus/emoji';
import { Link } from 'tiptap/editor/menus/link';
import { Blockquote } from 'tiptap/editor/menus/blockquote';
import { HorizontalRule } from 'tiptap/editor/menus/horizontal-rule';
import { Search } from 'tiptap/editor/menus/search';

import { Attachment } from 'tiptap/editor/menus/attachment';
import { Callout } from 'tiptap/editor/menus/callout';
import { CodeBlock } from 'tiptap/editor/menus/code-block';
import { Countdonw } from 'tiptap/editor/menus/countdown';
import { DocumentChildren } from 'tiptap/editor/menus/document-children';
import { DocumentReference } from 'tiptap/editor/menus/document-reference';
import { Flow } from 'tiptap/editor/menus/flow';
import { Image } from 'tiptap/editor/menus/image';
import { Iframe } from 'tiptap/editor/menus/iframe';
import { Table } from 'tiptap/editor/menus/table';
import { Text } from 'tiptap/editor/menus/text';
import { Mind } from 'tiptap/editor/menus/mind';

const _MenuBar: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isEditable = useMemo(() => editor && editor.isEditable, [editor]);

  if (!editor) return null;

  return (
    <div
      style={{
        overflow: 'auto',
        opacity: isEditable ? 1 : 0.65,
        pointerEvents: isEditable ? 'auto' : 'none',
      }}
    >
      <Space spacing={2}>
        <Insert editor={editor} />

        <Divider />

        <Undo editor={editor} />
        <Redo editor={editor} />
        <CleadrNodeAndMarks editor={editor} />

        <Divider />

        <Heading editor={editor} />
        <FontSize editor={editor} />
        <Bold editor={editor} />
        <Italic editor={editor} />
        <Underline editor={editor} />
        <Strike editor={editor} />
        <Code editor={editor} />
        <Superscript editor={editor} />
        <Subscript editor={editor} />
        <TextColor editor={editor} />
        <BackgroundColor editor={editor} />

        <Divider />

        <Align editor={editor} />

        <Divider />

        <BulletList editor={editor} />
        <OrderedList editor={editor} />
        <TaskList editor={editor} />
        <Ident editor={editor} />

        <Divider />

        <Emoji editor={editor} />
        <Blockquote editor={editor} />
        <Link editor={editor} />
        <HorizontalRule editor={editor} />
        <Search editor={editor} />

        <Attachment editor={editor} />
        <Callout editor={editor} />
        <CodeBlock editor={editor} />
        <Countdonw editor={editor} />
        <DocumentChildren editor={editor} />
        <DocumentReference editor={editor} />
        <Flow editor={editor} />
        <Image editor={editor} />
        <Iframe editor={editor} />
        <Table editor={editor} />
        <Text editor={editor} />
        <Mind editor={editor} />
      </Space>
    </div>
  );
};

export const MenuBar = React.memo(_MenuBar, (prevProps, nextProps) => {
  return prevProps.editor === nextProps.editor;
});
