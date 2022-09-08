import { Toast } from '@douyinfe/semi-ui';
import { safeJSONParse } from 'helpers/json';
// 自定义节点扩展
import { Attachment } from 'tiptap/core/extensions/attachment';
import { BackgroundColor } from 'tiptap/core/extensions/background-color';
import { Blockquote } from 'tiptap/core/extensions/blockquote';
import { Bold } from 'tiptap/core/extensions/bold';
import { BulletList } from 'tiptap/core/extensions/bullet-list';
import { Callout } from 'tiptap/core/extensions/callout';
import { Clipboard } from 'tiptap/core/extensions/clipboard';
import { Code, CodeMarkPlugin } from 'tiptap/core/extensions/code';
import { CodeBlock } from 'tiptap/core/extensions/code-block';
import { Color } from 'tiptap/core/extensions/color';
import { ColorHighlighter } from 'tiptap/core/extensions/color-highlighter';
import { Column } from 'tiptap/core/extensions/column';
import { Columns } from 'tiptap/core/extensions/columns';
import { Countdown } from 'tiptap/core/extensions/countdown';
// 基础扩展
import { Document } from 'tiptap/core/extensions/document';
import { DocumentChildren } from 'tiptap/core/extensions/document-children';
import { DocumentReference } from 'tiptap/core/extensions/document-reference';
import { Dragable } from 'tiptap/core/extensions/dragable';
import { Dropcursor } from 'tiptap/core/extensions/dropcursor';
import { Emoji } from 'tiptap/core/extensions/emoji';
import { EventEmitter } from 'tiptap/core/extensions/event-emitter';
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
import { ScrollIntoView } from 'tiptap/core/extensions/scroll-into-view';
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
// markdown 支持
import { htmlToProsemirror } from 'tiptap/markdown/html-to-prosemirror';
import { markdownToHTML, markdownToProsemirror } from 'tiptap/markdown/markdown-to-prosemirror';
import { prosemirrorToMarkdown } from 'tiptap/markdown/prosemirror-to-markdown';

const DocumentWithTitle = Document.extend({
  content: 'title{1} block+',
});

export { Document };

const placeholders = [
  '输入 / 唤起更多',
  '使用 markdown 语法进行输入',
  '输入 @ 来提及他人',
  '输入 : 来插入表情',
  '你知道吗？输入 $katex 然后在输入一个 $ 就可以快速插入数学公式，其他节点操作类似哦',
];

const getCreateUserId = () => safeJSONParse(window.localStorage.getItem('user')).id;

export const CollaborationKit = [
  Paragraph,
  Placeholder.configure({
    placeholder: ({ node, editor }) => {
      if (node.type.name === 'title') {
        return editor.isEditable ? '请输入标题' : '未命名文档';
      }

      if (!editor.isEditable) return;

      return placeholders[~~(Math.random() * placeholders.length)];
    },
    showOnlyCurrent: false,
    showOnlyWhenEditable: false,
  }),
  BackgroundColor,
  Blockquote,
  Bold,
  BulletList,
  Clipboard.configure({
    prosemirrorToMarkdown,
  }),
  Code,
  CodeMarkPlugin,
  CodeBlock,
  Color,
  ColorHighlighter,
  Column,
  Columns,
  Dropcursor.configure({
    width: 2,
    class: 'dropcursor',
    color: 'skyblue',
  }),
  Excalidraw,
  EventEmitter,
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
  ScrollIntoView,
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
  TrailingNode,
  Underline,
  Paste.configure({
    htmlToProsemirror,
    markdownToHTML,
    markdownToProsemirror,
    prosemirrorToMarkdown,
  }),
  Attachment,
  Callout,
  Countdown,
  DocumentChildren,
  DocumentReference,
  Emoji,
  Flow.configure({
    getCreateUserId,
  }),
  Iframe,
  Katex.configure({
    getCreateUserId,
  }),
  Mention,
  Mind.configure({
    getCreateUserId,
  }),
  QuickInsert,
  SearchNReplace,
  Status,
  TableOfContents.configure({
    onHasOneBeforeInsert: () => {
      Toast.info('目录已存在');
    },
  }),
  Title,
  DocumentWithTitle,
  Dragable,
];
