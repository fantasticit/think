import { Document, TitledDocument, Title } from "./extensions/title";
import Placeholder from "@tiptap/extension-placeholder";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { HorizontalRule } from "./extensions/horizontal-rule";
import { BackgroundColor } from "./extensions/background-color";
import { Link } from "./extensions/link";
import { FontSize } from "./extensions/font-size";
import { ColorHighlighter } from "./extensions/color-highlight";
import { Indent } from "./extensions/indent";
import { Div } from "./extensions/div";
import { Banner } from "./extensions/banner";
import { CodeBlock } from "./extensions/code-block";
import { Iframe } from "./extensions/iframe";
import { Mind } from "./extensions/mind";
import { Image } from "./extensions/image";
import { Status } from "./extensions/status";
import { Paste } from "./extensions/paste";
import { Table, TableRow, TableCell, TableHeader } from "./extensions/table";
import { Toc } from "./extensions/toc";
import { TrailingNode } from "./extensions/trailing-node";
import { Attachment } from "./extensions/attachment";
import { Katex } from "./extensions/katex";
import { DocumentReference } from "./extensions/documents/reference";
import { DocumentChildren } from "./extensions/documents/children";

export { Document, TitledDocument };

export const BaseExtension = [
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "title") {
        return "请输入标题";
      }
      return "请输入内容";
    },
    showOnlyWhenEditable: true,
  }),
  Title,
  Paragraph,
  Text,
  Strike,
  Underline,
  TextStyle,
  Color,
  BackgroundColor,
  Bold,
  Code,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Heading,
  HorizontalRule,
  Italic,
  OrderedList,
  BulletList,
  ListItem,
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({
    types: ["heading", "paragraph", "image"],
  }),
  Link.configure({ openOnClick: false }),
  Blockquote,
  FontSize,
  ColorHighlighter,
  Indent,
  CodeBlock,
  Div,
  Banner,
  Iframe,
  Mind,
  Image,
  Status,
  Paste,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableCell,
  TableHeader,
  Toc,
  TrailingNode,
  Attachment,
  Katex,
  DocumentReference,
  DocumentChildren,
];
