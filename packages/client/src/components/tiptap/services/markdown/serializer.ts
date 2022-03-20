import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { sanitize } from 'dompurify';
import {
  MarkdownSerializer as ProseMirrorMarkdownSerializer,
  defaultMarkdownSerializer,
} from 'prosemirror-markdown';
import { markdown } from '.';
import { Attachment } from '../../extensions/attachment';
import { Banner } from '../../extensions/banner';
import { Blockquote } from '../../extensions/blockquote';
import { Bold } from '../../extensions/bold';
import { BulletList } from '../../extensions/bulletList';
import { Code } from '../../extensions/code';
import { CodeBlock } from '../../extensions/codeBlock';
import { DocumentChildren } from '../../extensions/documentChildren';
import { DocumentReference } from '../../extensions/documentReference';
import { FootnoteDefinition } from '../../extensions/footnoteDefinition';
import { FootnoteReference } from '../../extensions/footnoteReference';
import { FootnotesSection } from '../../extensions/footnotesSection';
import { HardBreak } from '../../extensions/hardBreak';
import { Heading } from '../../extensions/heading';
import { HorizontalRule } from '../../extensions/horizontalRule';
import { HTMLMarks } from '../../extensions/htmlMarks';
import { Iframe } from '../../extensions/iframe';
import { Image } from '../../extensions/image';
import { Italic } from '../../extensions/italic';
import { Katex } from '../../extensions/katex';
import { Link } from '../../extensions/link';
import { ListItem } from '../../extensions/listItem';
import { Mind } from '../../extensions/mind';
import { OrderedList } from '../../extensions/orderedList';
import { Paragraph } from '../../extensions/paragraph';
import { Strike } from '../../extensions/strike';
import { Table } from '../../extensions/table';
import { TableCell } from '../../extensions/tableCell';
import { TableHeader } from '../../extensions/tableHeader';
import { TableRow } from '../../extensions/tableRow';
import { Text } from '../../extensions/text';
import { TaskItem } from '../../extensions/taskItem';
import { TaskList } from '../../extensions/taskList';
import { Title } from '../../extensions/title';
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
  renderHTMLNode,
} from './serializerHelpers';

const defaultSerializerConfig = {
  marks: {
    [Bold.name]: defaultMarkdownSerializer.marks.strong,
    [Italic.name]: { open: '_', close: '_', mixable: true, expelEnclosingWhitespace: true },
    [Code.name]: defaultMarkdownSerializer.marks.code,
    [Link.name]: {
      open(state, mark, parent, index) {
        return isPlainURL(mark, parent, index, 1) ? '<' : '[';
      },
      close(state, mark, parent, index) {
        const href = mark.attrs.canonicalSrc || mark.attrs.href;
        return isPlainURL(mark, parent, index, -1)
          ? '>'
          : `](${state.esc(href)}${mark.attrs.title ? ` ${state.quote(mark.attrs.title)}` : ''})`;
      },
    },
    [Strike.name]: {
      open: '~~',
      close: '~~',
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    ...HTMLMarks.reduce(
      (acc, { name }) => ({
        ...acc,
        [name]: {
          mixable: true,
          open(state, node) {
            return openTag(name, node.attrs);
          },
          close: closeTag(name),
        },
      }),
      {}
    ),
  },

  nodes: {
    [Attachment.name]: (state, node) => {
      state.ensureNewLine();
      state.write(`attachment$`);
      state.closeBlock(node);
    },
    [Banner.name]: (state, node) => {
      state.write(`:::${node.attrs.type || 'info'}\n`);
      state.ensureNewLine();
      state.renderContent(node);
      state.ensureNewLine();
      state.write(':::');
      state.closeBlock(node);
    },
    [Blockquote.name]: (state, node) => {
      if (node.attrs.multiline) {
        state.write('>>>');
        state.ensureNewLine();
        state.renderContent(node);
        state.ensureNewLine();
        state.write('>>>');
        state.closeBlock(node);
      } else {
        state.wrapBlock('> ', null, node, () => state.renderContent(node));
      }
    },
    [BulletList.name]: defaultMarkdownSerializer.nodes.bullet_list,
    [CodeBlock.name]: (state, node) => {
      state.write(`\`\`\`${node.attrs.language || ''}\n`);
      state.text(node.textContent, false);
      state.ensureNewLine();
      state.write('```');
      state.closeBlock(node);
    },
    [DocumentChildren.name]: (state, node) => {
      state.ensureNewLine();
      state.write(`documentChildren$`);
      state.closeBlock(node);
    },
    [DocumentReference.name]: (state, node) => {
      state.ensureNewLine();
      state.write(`documentReference$`);
      state.closeBlock(node);
    },
    [FootnoteDefinition.name]: (state, node) => {
      state.renderInline(node);
    },
    [FootnoteReference.name]: (state, node) => {
      state.write(`[^${node.attrs.footnoteNumber}]`);
    },
    [FootnotesSection.name]: (state, node) => {
      state.renderList(node, '', (index) => `[^${index + 1}]: `);
    },
    [HardBreak.name]: renderHardBreak,
    [Heading.name]: defaultMarkdownSerializer.nodes.heading,
    [HorizontalRule.name]: defaultMarkdownSerializer.nodes.horizontal_rule,
    [Iframe.name]: renderImage,
    [Image.name]: renderImage,
    [Katex.name]: (state, node) => {
      state.ensureNewLine();
      state.write(`\$\$${node.attrs.text || ''}\$\$`);
      state.closeBlock(node);
    },
    [ListItem.name]: defaultMarkdownSerializer.nodes.list_item,
    [Mind.name]: (state, node) => {
      state.write(`$mind\n`);
      state.ensureNewLine();
      state.renderContent(node);
      state.ensureNewLine();
      state.closeBlock(node);
    },
    [OrderedList.name]: renderOrderedList,
    [Paragraph.name]: defaultMarkdownSerializer.nodes.paragraph,
    [Table.name]: renderTable,
    [TableCell.name]: renderTableCell,
    [TableHeader.name]: renderTableCell,
    [TableRow.name]: renderTableRow,
    [TaskItem.name]: (state, node) => {
      state.write(`[${node.attrs.checked ? 'x' : ' '}] `);
      state.renderContent(node);
    },
    [TaskList.name]: (state, node) => {
      state.renderList(node, '  ', () => (node.attrs.bullet || '*') + ' ');
    },
    [Text.name]: defaultMarkdownSerializer.nodes.text,
    [Title.name]: (state, node) => {
      if (!node.textContent) return;

      state.write(`# `);
      state.text(node.textContent, false);
      state.ensureNewLine();
      state.closeBlock(node);
    },
  },
};

const renderMarkdown = (rawMarkdown) => {
  return sanitize(markdown.render(rawMarkdown), {});
};

const createMarkdownSerializer = () => ({
  // 将 markdown 字符串转换为 ProseMirror JSONDocument
  deserialize: ({ schema, content }) => {
    const html = renderMarkdown(content);
    if (!html) return null;
    const parser = new DOMParser();
    const { body } = parser.parseFromString(html, 'text/html');
    body.append(document.createComment(content));
    const state = ProseMirrorDOMParser.fromSchema(schema).parse(body);
    return state;
  },

  // 将 ProseMirror JSONDocument 转换为 markdown 字符串
  serialize: ({ schema, content }) => {
    const serializer = new ProseMirrorMarkdownSerializer(
      {
        ...defaultSerializerConfig.nodes,
      },
      {
        ...defaultSerializerConfig.marks,
      }
    );
    return serializer.serialize(content, {
      tightLists: true,
    });
  },
});

export const markdownSerializer = createMarkdownSerializer();
