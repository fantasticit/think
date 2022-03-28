import { Attachment } from './extensions/attachment';
import { BackgroundColor } from './extensions/background-color';
import { Banner } from './extensions/banner';
import { Blockquote } from './extensions/blockquote';
import { Bold } from './extensions/bold';
import { BulletList } from './extensions/bullet-list';
import { Code } from './extensions/code';
import { CodeBlock } from './extensions/code-block';
import { Color } from './extensions/color';
import { ColorHighlighter } from './extensions/color-highlighter';
import { DocumentChildren } from './extensions/document-children';
import { DocumentReference } from './extensions/document-reference';
import { Dropcursor } from './extensions/dropcursor';
import { Emoji } from './extensions/emoji';
import { EvokeMenu } from './extensions/evoke-menu';
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
import { Mind } from './extensions/mind';
import { OrderedList } from './extensions/ordered-list';
import { Paragraph } from './extensions/paragraph';
import { Placeholder } from './extensions/placeholder';
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

export const BaseKit = [
  Attachment,
  BackgroundColor,
  Banner,
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  Color,
  ColorHighlighter,
  DocumentChildren,
  DocumentReference,
  Dropcursor,
  Emoji,
  EvokeMenu,
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
  Mind,
  OrderedList,
  Paragraph,
  Placeholder,
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
