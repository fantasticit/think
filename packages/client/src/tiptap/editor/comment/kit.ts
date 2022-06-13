import History from '@tiptap/extension-history';
import { BackgroundColor } from 'tiptap/core/extensions/background-color';
import { Blockquote } from 'tiptap/core/extensions/blockquote';
import { Bold } from 'tiptap/core/extensions/bold';
import { BulletList } from 'tiptap/core/extensions/bullet-list';
import { Clipboard } from 'tiptap/core/extensions/clipboard';
import { Code } from 'tiptap/core/extensions/code';
import { CodeBlock } from 'tiptap/core/extensions/code-block';
import { Color } from 'tiptap/core/extensions/color';
import { ColorHighlighter } from 'tiptap/core/extensions/color-highlighter';
import { Document } from 'tiptap/core/extensions/document';
import { Dropcursor } from 'tiptap/core/extensions/dropcursor';
import { Emoji } from 'tiptap/core/extensions/emoji';
import { EventEmitter } from 'tiptap/core/extensions/event-emitter';
import { Focus } from 'tiptap/core/extensions/focus';
import { FontSize } from 'tiptap/core/extensions/font-size';
import { Gapcursor } from 'tiptap/core/extensions/gapcursor';
import { HardBreak } from 'tiptap/core/extensions/hard-break';
import { Heading } from 'tiptap/core/extensions/heading';
import { HorizontalRule } from 'tiptap/core/extensions/horizontal-rule';
import { HTMLMarks } from 'tiptap/core/extensions/html-marks';
import { Image } from 'tiptap/core/extensions/image';
import { Indent } from 'tiptap/core/extensions/indent';
import { Italic } from 'tiptap/core/extensions/italic';
import { Katex } from 'tiptap/core/extensions/katex';
import { Link } from 'tiptap/core/extensions/link';
import { ListItem } from 'tiptap/core/extensions/listItem';
import { Mention } from 'tiptap/core/extensions/mention';
import { OrderedList } from 'tiptap/core/extensions/ordered-list';
import { Paragraph } from 'tiptap/core/extensions/paragraph';
import { Paste } from 'tiptap/core/extensions/paste';
import { Placeholder } from 'tiptap/core/extensions/placeholder';
import { ScrollIntoView } from 'tiptap/core/extensions/scroll-into-view';
import { Strike } from 'tiptap/core/extensions/strike';
import { Subscript } from 'tiptap/core/extensions/subscript';
import { Superscript } from 'tiptap/core/extensions/superscript';
import { Table } from 'tiptap/core/extensions/table';
import { TableCell } from 'tiptap/core/extensions/table-cell';
import { TableHeader } from 'tiptap/core/extensions/table-header';
import { TableRow } from 'tiptap/core/extensions/table-row';
import { TaskItem } from 'tiptap/core/extensions/task-item';
import { TaskList } from 'tiptap/core/extensions/task-list';
import { Text } from 'tiptap/core/extensions/text';
import { TextAlign } from 'tiptap/core/extensions/text-align';
import { TextStyle } from 'tiptap/core/extensions/text-style';
import { TrailingNode } from 'tiptap/core/extensions/trailing-node';
import { Underline } from 'tiptap/core/extensions/underline';
// markdown 支持
import { markdownToProsemirror } from 'tiptap/markdown/markdown-to-prosemirror';
import { markdownToHTML } from 'tiptap/markdown/markdown-to-prosemirror/markdown-to-html';
import { prosemirrorToMarkdown } from 'tiptap/markdown/prosemirror-to-markdown';

export const CommentKit = [
  BackgroundColor,
  Blockquote,
  Bold,
  BulletList,
  Clipboard.configure({
    prosemirrorToMarkdown,
  }),
  Code,
  CodeBlock,
  Color,
  ColorHighlighter,
  Document,
  Dropcursor,
  EventEmitter,
  Emoji,
  Focus,
  FontSize,
  Gapcursor,
  HardBreak,
  Heading,
  History,
  HorizontalRule,
  ...HTMLMarks,
  Indent,
  Image,
  Italic,
  Katex,
  Link,
  ListItem,
  Mention,
  OrderedList,
  Paragraph,
  Paste.configure({
    markdownToHTML,
    markdownToProsemirror,
    prosemirrorToMarkdown,
  }),
  Placeholder.configure({
    placeholder: '请输入内容',
    showOnlyWhenEditable: true,
  }),
  Strike,
  ScrollIntoView,
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
  TrailingNode,
  Underline,
];
