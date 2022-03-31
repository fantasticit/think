import React from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import { Space } from '@douyinfe/semi-ui';
import { Title } from '../extensions/title';
import { Link } from '../extensions/link';
import { Attachment } from '../extensions/attachment';
import { Image } from '../extensions/image';
import { Banner } from '../extensions/banner';
import { CodeBlock } from '../extensions/code-block';
import { Status } from '../extensions/status';
import { HorizontalRule } from '../extensions/horizontal-rule';
import { Iframe } from '../extensions/iframe';
import { Mind } from '../extensions/mind';
import { Table } from '../extensions/table';
import { TaskList } from '../extensions/task-list';
import { TaskItem } from '../extensions/task-item';
import { Katex } from '../extensions/katex';
import { DocumentReference } from '../extensions/document-reference';
import { DocumentChildren } from '../extensions/document-children';
import { BaseMenu } from './base-menu';

const OTHER_BUBBLE_MENU_TYPES = [
  Title.name,
  Link.name,
  Attachment.name,
  Image.name,
  Banner.name,
  CodeBlock.name,
  Status.name,
  Iframe.name,
  Mind.name,
  Table.name,
  TaskList.name,
  TaskItem.name,
  DocumentReference.name,
  DocumentChildren.name,
  Katex.name,
  HorizontalRule.name,
];

export const BaseBubbleMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      className={'bubble-menu'}
      pluginKey="base-bubble-menu"
      shouldShow={() =>
        !editor.state.selection.empty && OTHER_BUBBLE_MENU_TYPES.every((type) => !editor.isActive(type))
      }
    >
      <Space>
        <BaseMenu editor={editor} />
      </Space>
    </BubbleMenu>
  );
};
