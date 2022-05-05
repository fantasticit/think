// 基础扩展
import { Document } from 'tiptap/core/extensions/document';
import { BackgroundColor } from 'tiptap/core/extensions/background-color';
import { Blockquote } from 'tiptap/core/extensions/blockquote';
import { Bold } from 'tiptap/core/extensions/bold';
import { BulletList } from 'tiptap/core/extensions/bullet-list';
import { Code } from 'tiptap/core/extensions/code';
import { CodeBlock } from 'tiptap/core/extensions/code-block';
import { Color } from 'tiptap/core/extensions/color';
import { ColorHighlighter } from 'tiptap/core/extensions/color-highlighter';
import { Dropcursor } from 'tiptap/core/extensions/dropcursor';
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
import { Link } from 'tiptap/core/extensions/link';
import { ListItem } from 'tiptap/core/extensions/listItem';
import { Loading } from 'tiptap/core/extensions/loading';
import { OrderedList } from 'tiptap/core/extensions/ordered-list';
import { Paragraph } from 'tiptap/core/extensions/paragraph';
import { Placeholder } from 'tiptap/core/extensions/placeholder';
import { SelectionExtension } from 'tiptap/core/extensions/selection';
import { ScrollIntoView } from 'tiptap/core/extensions/scroll-into-view';
import { Strike } from 'tiptap/core/extensions/strike';
import { Subscript } from 'tiptap/core/extensions/subscript';
import { Superscript } from 'tiptap/core/extensions/superscript';
import { Table } from 'tiptap/core/extensions/table';
import { TableCell } from 'tiptap/core/extensions/table-cell';
import { TableHeader } from 'tiptap/core/extensions/table-header';
import { TableRow } from 'tiptap/core/extensions/table-row';
import { Text } from 'tiptap/core/extensions/text';
import { TextAlign } from 'tiptap/core/extensions/text-align';
import { TextStyle } from 'tiptap/core/extensions/text-style';
import { TaskItem } from 'tiptap/core/extensions/task-item';
import { TaskList } from 'tiptap/core/extensions/task-list';
import { Title } from 'tiptap/core/extensions/title';
import { TrailingNode } from 'tiptap/core/extensions/trailing-node';
import { Underline } from 'tiptap/core/extensions/underline';
import { Paste } from 'tiptap/core/extensions/paste';
// 自定义节点扩展
import { Attachment } from 'tiptap/core/extensions/attachment';
import { Callout } from 'tiptap/core/extensions/callout';
import { Countdown } from 'tiptap/core/extensions/countdown';
import { DocumentChildren } from 'tiptap/core/extensions/document-children';
import { DocumentReference } from 'tiptap/core/extensions/document-reference';
import { Emoji } from 'tiptap/core/extensions/emoji';
import { Iframe } from 'tiptap/core/extensions/iframe';
import { Katex } from 'tiptap/core/extensions/katex';
import { Mention } from 'tiptap/core/extensions/mention';
import { Mind } from 'tiptap/core/extensions/mind';
import { QuickInsert } from 'tiptap/core/extensions/quick-insert';
import { SearchNReplace } from 'tiptap/core/extensions/search';
import { Status } from 'tiptap/core/extensions/status';

// markdown 支持
import { markdownToProsemirror } from 'tiptap/markdown/markdown-to-prosemirror';
import { markdownToHTML } from 'tiptap/markdown/markdown-to-prosemirror/markdown-to-html';
import { prosemirrorToMarkdown } from 'tiptap/markdown/prosemirror-to-markdown';
import { debounce } from 'helpers/debounce';

const DocumentWithTitle = Document.extend({
  content: 'title block+',
});

export const CollaborationKit = [
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
  BackgroundColor,
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  Color,
  ColorHighlighter,
  Dropcursor,
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
  ScrollIntoView.configure({
    onScroll: debounce((editor) => {
      setTimeout(() => {
        const element = editor.options.element;
        // 脏代码：这里使用 parentElement 是和布局有关的，需要根据实际情况修改
        const parentElement = element.parentNode as HTMLElement;
        const nextScrollTop = element.scrollHeight;
        parentElement.scrollTop = nextScrollTop;
      }, 0);
    }, 200),
  }),
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
  Iframe,
  Katex,
  Mention,
  Mind,
  QuickInsert,
  SearchNReplace,
  Status,
  Title,
  DocumentWithTitle,
];
