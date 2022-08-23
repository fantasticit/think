import { Space } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import React, { useMemo } from 'react';
import { Editor } from 'tiptap/core';
import { Align } from 'tiptap/core/menus/align';
import { Attachment } from 'tiptap/core/menus/attachment';
import { BackgroundColor } from 'tiptap/core/menus/background-color';
import { Blockquote } from 'tiptap/core/menus/blockquote';
import { Bold } from 'tiptap/core/menus/bold';
import { BulletList } from 'tiptap/core/menus/bullet-list';
import { Callout } from 'tiptap/core/menus/callout';
import { CleadrNodeAndMarks } from 'tiptap/core/menus/clear-node-and-marks';
import { Code } from 'tiptap/core/menus/code';
import { CodeBlock } from 'tiptap/core/menus/code-block';
import { Columns } from 'tiptap/core/menus/columns';
import { Countdonw } from 'tiptap/core/menus/countdown';
import { DocumentChildren } from 'tiptap/core/menus/document-children';
import { DocumentReference } from 'tiptap/core/menus/document-reference';
import { Emoji } from 'tiptap/core/menus/emoji';
import { Excalidraw } from 'tiptap/core/menus/excalidraw';
import { Flow } from 'tiptap/core/menus/flow';
import { FontSize } from 'tiptap/core/menus/fontsize';
import { Heading } from 'tiptap/core/menus/heading';
import { HorizontalRule } from 'tiptap/core/menus/horizontal-rule';
import { Ident } from 'tiptap/core/menus/ident';
import { Iframe } from 'tiptap/core/menus/iframe';
import { Image } from 'tiptap/core/menus/image';
import { Insert } from 'tiptap/core/menus/insert';
import { Italic } from 'tiptap/core/menus/italic';
import { Katex } from 'tiptap/core/menus/katex';
import { Link } from 'tiptap/core/menus/link';
import { Mind } from 'tiptap/core/menus/mind';
import { OrderedList } from 'tiptap/core/menus/ordered-list';
import { Redo } from 'tiptap/core/menus/redo';
import { Search } from 'tiptap/core/menus/search';
import { Strike } from 'tiptap/core/menus/strike';
import { Subscript } from 'tiptap/core/menus/subscript';
import { Superscript } from 'tiptap/core/menus/superscript';
import { Table } from 'tiptap/core/menus/table';
import { TaskList } from 'tiptap/core/menus/task-list';
import { Text } from 'tiptap/core/menus/text';
import { TextColor } from 'tiptap/core/menus/text-color';
import { Underline } from 'tiptap/core/menus/underline';
import { Undo } from 'tiptap/core/menus/undo';

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
        <Katex editor={editor} />
        <Mind editor={editor} />
        <Excalidraw editor={editor} />
        <Columns editor={editor} />

        <Text editor={editor} />
      </Space>
    </div>
  );
};

export const MenuBar = React.memo(_MenuBar, (prevProps, nextProps) => {
  return prevProps.editor === nextProps.editor;
});
