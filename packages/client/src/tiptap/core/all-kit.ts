import { Attachment } from 'tiptap/core/extensions/attachment';
import { BackgroundColor } from 'tiptap/core/extensions/background-color';
import { Blockquote } from 'tiptap/core/extensions/blockquote';
import { Bold } from 'tiptap/core/extensions/bold';
import { BulletList } from 'tiptap/core/extensions/bullet-list';
import { Callout } from 'tiptap/core/extensions/callout';
import { Code } from 'tiptap/core/extensions/code';
import { CodeBlock } from 'tiptap/core/extensions/code-block';
import { Color } from 'tiptap/core/extensions/color';
import { ColorHighlighter } from 'tiptap/core/extensions/color-highlighter';
import { Countdown } from 'tiptap/core/extensions/countdown';
import { Document } from 'tiptap/core/extensions/document';
import { DocumentChildren } from 'tiptap/core/extensions/document-children';
import { DocumentReference } from 'tiptap/core/extensions/document-reference';
import { Dropcursor } from 'tiptap/core/extensions/dropcursor';
import { Emoji } from 'tiptap/core/extensions/emoji';
import { Excalidraw } from 'tiptap/core/extensions/excalidraw';
import { Flow } from 'tiptap/core/extensions/flow';
import { Focus } from 'tiptap/core/extensions/focus';
import { FontSize } from 'tiptap/core/extensions/font-size';
import { Gapcursor } from 'tiptap/core/extensions/gapcursor';
import { HardBreak } from 'tiptap/core/extensions/hard-break';
import { Heading } from 'tiptap/core/extensions/heading';
import { HorizontalRule } from 'tiptap/core/extensions/horizontal-rule';
import { HTMLMarks } from 'tiptap/core/extensions/html-marks';
import { Iframe } from 'tiptap/core/extensions/iframe';
import { Image } from 'tiptap/core/extensions/image';
import { Indent } from 'tiptap/core/extensions/indent';
import { Italic } from 'tiptap/core/extensions/italic';
import { Katex } from 'tiptap/core/extensions/katex';
import { Link } from 'tiptap/core/extensions/link';
import { ListItem } from 'tiptap/core/extensions/listItem';
import { Loading } from 'tiptap/core/extensions/loading';
import { Mention } from 'tiptap/core/extensions/mention';
import { Mind } from 'tiptap/core/extensions/mind';
import { OrderedList } from 'tiptap/core/extensions/ordered-list';
import { Paragraph } from 'tiptap/core/extensions/paragraph';
import { Paste } from 'tiptap/core/extensions/paste';
import { Placeholder } from 'tiptap/core/extensions/placeholder';
import { QuickInsert } from 'tiptap/core/extensions/quick-insert';
import { SearchNReplace } from 'tiptap/core/extensions/search';
import { SelectionExtension } from 'tiptap/core/extensions/selection';
import { Status } from 'tiptap/core/extensions/status';
import { Strike } from 'tiptap/core/extensions/strike';
import { Subscript } from 'tiptap/core/extensions/subscript';
import { Superscript } from 'tiptap/core/extensions/superscript';
import { Table } from 'tiptap/core/extensions/table';
import { TableCell } from 'tiptap/core/extensions/table-cell';
import { TableHeader } from 'tiptap/core/extensions/table-header';
import { TableOfContents } from 'tiptap/core/extensions/table-of-contents';
import { TableRow } from 'tiptap/core/extensions/table-row';
import { TaskItem } from 'tiptap/core/extensions/task-item';
import { TaskList } from 'tiptap/core/extensions/task-list';
import { Text } from 'tiptap/core/extensions/text';
import { TextAlign } from 'tiptap/core/extensions/text-align';
import { TextStyle } from 'tiptap/core/extensions/text-style';
import { Title } from 'tiptap/core/extensions/title';
import { TrailingNode } from 'tiptap/core/extensions/trailing-node';
import { Underline } from 'tiptap/core/extensions/underline';

export const DocumentWithTitle = Document.extend({
  content: 'title{1} block+',
});

export const AllExtensions = [
  Paragraph,
  Placeholder,
  BackgroundColor,
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  Color,
  ColorHighlighter,
  Dropcursor,
  Excalidraw,
  Focus,
  FontSize,
  Gapcursor,
  HardBreak,
  Heading,
  HorizontalRule,
  ...HTMLMarks,
  Image,
  Indent,
  Italic,
  Link,
  ListItem,
  Loading,
  OrderedList,
  SelectionExtension,
  Strike,
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableOfContents,
  Text,
  TextAlign,
  TextStyle,
  TaskItem,
  TaskList,
  TrailingNode,
  Underline,
  Paste,
  Attachment,
  Callout,
  Countdown,
  DocumentChildren,
  DocumentReference,
  Emoji,
  Iframe,
  Katex,
  Mention,
  Mind,
  QuickInsert,
  SearchNReplace,
  Status,
  DocumentWithTitle,
  Title,
  Flow,
];
