import { HocuspocusProvider } from '@hocuspocus/provider';
import { Attachment } from './extensions/attachment';
import { BackgroundColor } from './extensions/background-color';
import { Blockquote } from './extensions/blockquote';
import { Bold } from './extensions/bold';
import { BulletList } from './extensions/bullet-list';
import { Callout } from './extensions/callout';
import { Code } from './extensions/code';
import { CodeBlock } from './extensions/code-block';
import { Color } from './extensions/color';
import { ColorHighlighter } from './extensions/color-highlighter';
import { Countdown } from './extensions/countdown';
import { DocumentChildren } from './extensions/document-children';
import { DocumentReference } from './extensions/document-reference';
import { Dropcursor } from './extensions/dropcursor';
import { Emoji } from './extensions/emoji';
import { Focus } from './extensions/focus';
import { FontSize } from './extensions/font-size';
import { Gapcursor } from './extensions/gapcursor';
import { HardBreak } from './extensions/hard-break';
import { Heading } from './extensions/heading';
import { HorizontalRule } from './extensions/horizontal-rule';
import { HTMLMarks } from './extensions/html-marks';
import { Iframe } from './extensions/iframe';
import { Image } from './extensions/image';
import { Indent } from './extensions/indent';
import { Italic } from './extensions/italic';
import { Katex } from './extensions/katex';
import { Link } from './extensions/link';
import { ListItem } from './extensions/listItem';
import { Loading } from './extensions/loading';
import { Mention } from './extensions/mention';
import { Mind } from './extensions/mind';
import { OrderedList } from './extensions/ordered-list';
import { Paragraph } from './extensions/paragraph';
import { Placeholder } from './extensions/placeholder';
import { QuickInsert } from './extensions/quick-insert';
import { SearchNReplace } from './extensions/search';
import { SelectionExtension } from './extensions/selection';
import { Status } from './extensions/status';
import { Strike } from './extensions/strike';
import { Subscript } from './extensions/subscript';
import { Superscript } from './extensions/superscript';
import { Table } from './extensions/table';
import { TableCell } from './extensions/table-cell';
import { TableHeader } from './extensions/table-header';
import { TableRow } from './extensions/table-row';
import { Text } from './extensions/text';
import { TextAlign } from './extensions/text-align';
import { TextStyle } from './extensions/text-style';
import { TaskItem } from './extensions/task-item';
import { TaskList } from './extensions/task-list';
import { Title } from './extensions/title';
import { TrailingNode } from './extensions/trailing-node';
import { Underline } from './extensions/underline';
import { Paste } from './extensions/paste';

import { getRandomColor } from 'helpers/color';
// 文档
import { Document } from './extensions/document';
// 操作历史
import History from '@tiptap/extension-history';
// 协作
import { Collaboration } from './extensions/collaboration';
import { CollaborationCursor } from './extensions/collaboration-cursor';

export const BaseKit = [
  Attachment,
  BackgroundColor,
  Blockquote,
  Bold,
  BulletList,
  Callout,
  Code,
  CodeBlock,
  Color,
  ColorHighlighter,
  Countdown,
  DocumentChildren,
  DocumentReference,
  Dropcursor,
  Emoji,
  Focus,
  FontSize,
  Gapcursor,
  HardBreak,
  Heading,
  HorizontalRule,
  ...HTMLMarks,
  Iframe,
  Image,
  Indent,
  Italic,
  Katex,
  Link,
  ListItem,
  Loading,
  Mention,
  Mind,
  OrderedList,
  Paragraph,
  Placeholder.configure({
    placeholder: ({ node, editor }) => {
      if (!editor.isEditable) return;

      if (node.type.name === 'title') {
        return '请输入标题';
      }
      return '输入 / 唤起更多';
    },
    showOnlyCurrent: false,
    showOnlyWhenEditable: true,
  }),
  QuickInsert,
  SearchNReplace,
  SelectionExtension,
  Status,
  Strike,
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text,
  TextAlign,
  TextStyle,
  TaskItem,
  TaskList,
  Title,
  TrailingNode,
  Underline,
  Paste,
];

export const CommentKit = [
  BackgroundColor,
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  Color,
  ColorHighlighter,
  Dropcursor,
  Emoji,
  Focus,
  FontSize,
  Gapcursor,
  HardBreak,
  Heading,
  HorizontalRule,
  ...HTMLMarks,
  Indent,
  Italic,
  Katex,
  Link,
  ListItem,
  Mention,
  OrderedList,
  Paragraph,
  Placeholder.configure({
    placeholder: '请输入内容',
    showOnlyWhenEditable: true,
  }),
  Strike,
  Subscript,
  Superscript,
  Text,
  TextAlign,
  TextStyle,
  TaskItem,
  TaskList,
  TrailingNode,
  Underline,
];

export { Document, History };

export const DocumentWithTitle = Document.extend({
  content: 'title block+',
});

export const getCollaborationExtension = (provider: HocuspocusProvider) => {
  return Collaboration.configure({
    document: provider.document,
  });
};

export const getCollaborationCursorExtension = (provider: HocuspocusProvider, user) => {
  return CollaborationCursor.configure({
    provider,
    user: {
      ...user,
      color: getRandomColor(),
    },
  });
};
