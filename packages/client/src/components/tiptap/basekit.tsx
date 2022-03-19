import { Attachment } from './extensions/attachment';
import { BackgroundColor } from './extensions/backgroundColor';
import { Banner } from './extensions/banner';
import { Blockquote } from './extensions/blockquote';
import { Bold } from './extensions/bold';
import { BulletList } from './extensions/bulletList';
import { Code } from './extensions/code';
import { CodeBlock } from './extensions/codeBlock';
import { Color } from './extensions/color';
import { ColorHighlighter } from './extensions/colorHighlighter';
import { DocumentChildren } from './extensions/documentChildren';
import { DocumentReference } from './extensions/documentReference';
import { Dropcursor } from './extensions/dropCursor';
import { FontSize } from './extensions/fontSize';
import { FootnoteDefinition } from './extensions/footnoteDefinition';
import { FootnoteReference } from './extensions/footnoteReference';
import { FootnotesSection } from './extensions/footnotesSection';
import { Gapcursor } from './extensions/gapCursor';
import { HardBreak } from './extensions/hardBreak';
import { Heading } from './extensions/heading';
import { HorizontalRule } from './extensions/horizontalRule';
import { HTMLMarks } from './extensions/htmlMarks';
import { Iframe } from './extensions/iframe';
import { Image } from './extensions/image';
import { Italic } from './extensions/italic';
import { Katex } from './extensions/katex';
import { Link } from './extensions/link';
import { ListItem } from './extensions/listItem';
import { Mind } from './extensions/mind';
import { OrderedList } from './extensions/orderedList';
import { Paragraph } from './extensions/paragraph';
import { PasteFile } from './extensions/pasteFile';
import { PasteMarkdown } from './extensions/pasteMarkdown';
import { Placeholder } from './extensions/placeholder';
import { Status } from './extensions/status';
import { Strike } from './extensions/strike';
import { Table } from './extensions/table';
import { TableCell } from './extensions/tableCell';
import { TableHeader } from './extensions/tableHeader';
import { TableRow } from './extensions/tableRow';
import { Text } from './extensions/text';
import { TextAlign } from './extensions/textAlign';
import { TextStyle } from './extensions/textStyle';
import { TaskItem } from './extensions/taskItem';
import { TaskList } from './extensions/taskList';
import { Title } from './extensions/title';
import { TrailingNode } from './extensions/trailingNode';
import { Underline } from './extensions/underline';

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
  FontSize,
  FootnoteDefinition,
  FootnoteReference,
  FootnotesSection,
  Gapcursor,
  HardBreak,
  Heading,
  HorizontalRule,
  ...HTMLMarks,
  Iframe,
  Image,
  Italic,
  Katex,
  Link,
  ListItem,
  Mind,
  OrderedList,
  Paragraph,
  PasteFile,
  PasteMarkdown,
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'title') {
        return '请输入标题';
      }
      return '请输入内容';
    },
    showOnlyWhenEditable: true,
  }),
  Status,
  Strike,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text,
  TextAlign.configure({
    types: ['heading', 'paragraph', 'image'],
  }),
  TextStyle,
  TaskItem,
  TaskList,
  Title,
  TrailingNode,
  Underline,
];
