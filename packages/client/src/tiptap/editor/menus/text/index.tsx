import React, { useCallback } from 'react';
import { Space } from '@douyinfe/semi-ui';
import { BubbleMenu } from 'tiptap/editor/views/bubble-menu';

import { Bold } from '../bold';
import { Italic } from '../italic';
import { Underline } from '../underline';
import { Strike } from '../strike';
import { Code } from '../code';
import { Superscript } from '../superscript';
import { Subscript } from '../subscript';
import { TextColor } from '../text-color';
import { BackgroundColor } from '../background-color';

import { Title } from 'tiptap/core/extensions/title';
import { Link } from 'tiptap/core/extensions/link';
import { Attachment } from 'tiptap/core/extensions/attachment';
import { Image } from 'tiptap/core/extensions/image';
import { Callout } from 'tiptap/core/extensions/callout';
import { CodeBlock } from 'tiptap/core/extensions/code-block';
import { Iframe } from 'tiptap/core/extensions/iframe';
import { Flow } from 'tiptap/core/extensions/flow';
import { Mind } from 'tiptap/core/extensions/mind';
import { Table } from 'tiptap/core/extensions/table';
import { TableOfContents } from 'tiptap/core/extensions/table-of-contents';
import { Katex } from 'tiptap/core/extensions/katex';
import { DocumentReference } from 'tiptap/core/extensions/document-reference';
import { DocumentChildren } from 'tiptap/core/extensions/document-children';
import { HorizontalRule } from 'tiptap/core/extensions/horizontal-rule';

const OTHER_BUBBLE_MENU_TYPES = [
  Title.name,
  Link.name,
  Attachment.name,
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
];

export const Text = ({ editor }) => {
  const shouldShow = useCallback(
    () => !editor.state.selection.empty && OTHER_BUBBLE_MENU_TYPES.every((type) => !editor.isActive(type)),
    [editor]
  );

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="code-block-bubble-menu"
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
