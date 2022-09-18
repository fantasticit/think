import { Space } from '@douyinfe/semi-ui';
import React, { useCallback } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { Attachment } from 'tiptap/core/extensions/attachment';
import { Callout } from 'tiptap/core/extensions/callout';
import { CodeBlock } from 'tiptap/core/extensions/code-block';
import { Columns } from 'tiptap/core/extensions/columns';
import { Countdown } from 'tiptap/core/extensions/countdown';
import { DocumentChildren } from 'tiptap/core/extensions/document-children';
import { DocumentReference } from 'tiptap/core/extensions/document-reference';
import { Excalidraw } from 'tiptap/core/extensions/excalidraw';
import { Flow } from 'tiptap/core/extensions/flow';
import { HorizontalRule } from 'tiptap/core/extensions/horizontal-rule';
import { Iframe } from 'tiptap/core/extensions/iframe';
import { Image } from 'tiptap/core/extensions/image';
import { Katex } from 'tiptap/core/extensions/katex';
import { Link } from 'tiptap/core/extensions/link';
import { Mind } from 'tiptap/core/extensions/mind';
import { Status } from 'tiptap/core/extensions/status';
import { Table } from 'tiptap/core/extensions/table';
import { TableOfContents } from 'tiptap/core/extensions/table-of-contents';
import { Title } from 'tiptap/core/extensions/title';

import { BackgroundColor } from '../background-color';
import { Bold } from '../bold';
import { Code } from '../code';
import { Italic } from '../italic';
import { Strike } from '../strike';
import { Subscript } from '../subscript';
import { Superscript } from '../superscript';
import { TextColor } from '../text-color';
import { Underline } from '../underline';

const OTHER_BUBBLE_MENU_TYPES = [
  Title.name,
  Link.name,
  Attachment.name,
  Countdown.name,
  Image.name,
  Callout.name,
  CodeBlock.name,
  Iframe.name,
  Flow.name,
  Mind.name,
  Table.name,
  TableOfContents.name,
  DocumentReference.name,
  DocumentChildren.name,
  Katex.name,
  HorizontalRule.name,
  Status.name,
  Excalidraw.name,
  Columns.name,
];

export const Text = ({ editor }) => {
  const shouldShow = useCallback(() => {
    return !editor.state.selection.empty && OTHER_BUBBLE_MENU_TYPES.every((type) => !editor.isActive(type));
  }, [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="text-bubble-menu"
      shouldShow={shouldShow}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
    >
      <Space spacing={4}>
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
    </BubbleMenu>
  );
};
