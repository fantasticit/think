import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
import { marked } from "marked";
import { sanitize } from "dompurify";
import {
  MarkdownSerializer as ProseMirrorMarkdownSerializer,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { Document, TitledDocument, Title } from "../extensions/title";
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
import { BackgroundColor } from "../extensions/background-color";
import { Link } from "../extensions/link";
import { FontSize } from "../extensions/font-size";
import { ColorHighlighter } from "../extensions/color-highlight";
import { Indent } from "../extensions/indent";
import { Div } from "../extensions/div";
import { Banner } from "../extensions/banner";
import { CodeBlock } from "../extensions/code-block";
import { Iframe } from "../extensions/iframe";
import { Mind } from "../extensions/mind";
import { Katex } from "../extensions/katex";
import { Image } from "../extensions/image";
import { HorizontalRule } from "../extensions/horizontal-rule";
import { Table, TableCell, TableHeader, TableRow } from "../extensions/table";
import { DocumentChildren } from "../extensions/documents/children";

import {
  isPlainURL,
  renderHardBreak,
  renderTable,
  renderTableCell,
  renderTableRow,
  openTag,
  closeTag,
  renderOrderedList,
  renderImage,
  renderPlayable,
  renderHTMLNode,
  renderContent,
} from "./helpers";

const defaultSerializerConfig = {
  marks: {
    [Bold.name]: defaultMarkdownSerializer.marks.strong,
    [Italic.name]: {
      open: "_",
      close: "_",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    [Code.name]: defaultMarkdownSerializer.marks.code,
    // [Subscript.name]: { open: "<sub>", close: "</sub>", mixable: true },
    // [Superscript.name]: { open: "<sup>", close: "</sup>", mixable: true },
    // [InlineDiff.name]: {
    //   mixable: true,
    //   open(state, mark) {
    //     return mark.attrs.type === "addition" ? "{+" : "{-";
    //   },
    //   close(state, mark) {
    //     return mark.attrs.type === "addition" ? "+}" : "-}";
    //   },
    // },
    [Link.name]: {
      open(state, mark, parent, index) {
        return isPlainURL(mark, parent, index, 1) ? "<" : "[";
      },
      close(state, mark, parent, index) {
        const href = mark.attrs.canonicalSrc || mark.attrs.href;

        return isPlainURL(mark, parent, index, -1)
          ? ">"
          : `](${state.esc(href)}${
              mark.attrs.title ? ` ${state.quote(mark.attrs.title)}` : ""
            })`;
      },
    },
    [Strike.name]: {
      open: "~~",
      close: "~~",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
  },

  nodes: {
    // [Audio.name]: renderPlayable,
    [Blockquote.name]: (state, node) => {
      if (node.attrs.multiline) {
        state.write(">>>");
        state.ensureNewLine();
        state.renderContent(node);
        state.ensureNewLine();
        state.write(">>>");
        state.closeBlock(node);
      } else {
        state.wrapBlock("> ", null, node, () => state.renderContent(node));
      }
    },
    [BulletList.name]: defaultMarkdownSerializer.nodes.bullet_list,
    [CodeBlock.name]: (state, node) => {
      state.write(`\`\`\`${node.attrs.language || ""}\n`);
      state.text(node.textContent, false);
      state.ensureNewLine();
      state.write("```");
      state.closeBlock(node);
    },
    [Katex.name]: (state, node) => {
      state.ensureNewLine();
      state.write(`\$\$${node.attrs.text || ""}\$`);
      state.closeBlock(node);
    },
    [DocumentChildren.name]: (state, node) => {
      state.ensureNewLine();
      state.write(`documentChildren$`);
      state.closeBlock(node);
    },
    // [DescriptionList.name]: renderHTMLNode("dl", true),
    // [DescriptionItem.name]: (state, node, parent, index) => {
    //   if (index === 1) state.ensureNewLine();
    //   renderHTMLNode(node.attrs.isTerm ? "dt" : "dd")(state, node);
    //   if (index === parent.childCount - 1) state.ensureNewLine();
    // },
    // [Details.name]: renderHTMLNode("details", true),
    // [DetailsContent.name]: (state, node, parent, index) => {
    //   if (!index) renderHTMLNode("summary")(state, node);
    //   else {
    //     if (index === 1) state.ensureNewLine();
    //     renderContent(state, node);
    //     if (index === parent.childCount - 1) state.ensureNewLine();
    //   }
    // },
    // [Emoji.name]: (state, node) => {
    //   const { name } = node.attrs;

    //   state.write(`:${name}:`);
    // },
    // [FootnoteDefinition.name]: (state, node) => {
    //   state.renderInline(node);
    // },
    // [FootnoteReference.name]: (state, node) => {
    //   state.write(`[^${node.attrs.footnoteNumber}]`);
    // },
    // [FootnotesSection.name]: (state, node) => {
    //   state.renderList(node, "", (index) => `[^${index + 1}]: `);
    // },
    // [Frontmatter.name]: (state, node) => {
    //   const { language } = node.attrs;
    //   const syntax = {
    //     toml: "+++",
    //     json: ";;;",
    //     yaml: "---",
    //   }[language];

    //   state.write(`${syntax}\n`);
    //   state.text(node.textContent, false);
    //   state.ensureNewLine();
    //   state.write(syntax);
    //   state.closeBlock(node);
    // },
    [Title.name]: renderHTMLNode("div", true, true),
    // [FigureCaption.name]: renderHTMLNode("figcaption"),
    [HardBreak.name]: renderHardBreak,
    [Heading.name]: defaultMarkdownSerializer.nodes.heading,
    [HorizontalRule.name]: defaultMarkdownSerializer.nodes.horizontal_rule,
    [Image.name]: renderImage,
    [ListItem.name]: defaultMarkdownSerializer.nodes.list_item,
    [OrderedList.name]: renderOrderedList,
    [Paragraph.name]: defaultMarkdownSerializer.nodes.paragraph,
    // [Reference.name]: (state, node) => {
    //   state.write(node.attrs.originalText || node.attrs.text);
    // },
    // [TableOfContents.name]: (state, node) => {
    //   state.write("[[_TOC_]]");
    //   state.closeBlock(node);
    // },
    [Table.name]: renderTable,
    [TableCell.name]: renderTableCell,
    [TableHeader.name]: renderTableCell,
    [TableRow.name]: renderTableRow,
    [TaskItem.name]: (state, node) => {
      state.write(`[${node.attrs.checked ? "x" : " "}] `);
      state.renderContent(node);
    },
    [TaskList.name]: (state, node) => {
      if (node.attrs.numeric) renderOrderedList(state, node);
      else defaultMarkdownSerializer.nodes.bullet_list(state, node);
    },
    [Text.name]: defaultMarkdownSerializer.nodes.text,
  },
};

const renderMarkdown = (rawMarkdown) => {
  return sanitize(marked(rawMarkdown), {});
};

const createMarkdownSerializer = () => ({
  deserialize: ({ schema, content }) => {
    const html = renderMarkdown(content);
    if (!html) return null;
    const parser = new DOMParser();
    const { body } = parser.parseFromString(html, "text/html");
    body.append(document.createComment(content));
    const state = ProseMirrorDOMParser.fromSchema(schema).parse(body);
    return state;
  },

  serialize: ({ schema, document }) => {
    // const proseMirrorDocument = schema.nodeFromJSON(content);
    const serializer = new ProseMirrorMarkdownSerializer(
      {
        ...defaultSerializerConfig.nodes,
      },
      {
        ...defaultSerializerConfig.marks,
      }
    );
    return serializer.serialize(document, {
      tightLists: true,
    });
  },
});

export const markdownSerializer = createMarkdownSerializer();
