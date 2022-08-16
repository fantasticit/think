import { defaultMarkdownSerializer, MarkdownSerializer as ProseMirrorMarkdownSerializer } from 'prosemirror-markdown';
import { Attachment } from 'tiptap/core/extensions/attachment';
import { Blockquote } from 'tiptap/core/extensions/blockquote';
import { Bold } from 'tiptap/core/extensions/bold';
import { BulletList } from 'tiptap/core/extensions/bullet-list';
import { Callout } from 'tiptap/core/extensions/callout';
import { Code } from 'tiptap/core/extensions/code';
import { CodeBlock } from 'tiptap/core/extensions/code-block';
import { Countdown } from 'tiptap/core/extensions/countdown';
import { DocumentChildren } from 'tiptap/core/extensions/document-children';
import { DocumentReference } from 'tiptap/core/extensions/document-reference';
import { Excalidraw } from 'tiptap/core/extensions/excalidraw';
import { Flow } from 'tiptap/core/extensions/flow';
import { HardBreak } from 'tiptap/core/extensions/hard-break';
import { Heading } from 'tiptap/core/extensions/heading';
import { HorizontalRule } from 'tiptap/core/extensions/horizontal-rule';
import { marks } from 'tiptap/core/extensions/html-marks';
import { Iframe } from 'tiptap/core/extensions/iframe';
import { Image } from 'tiptap/core/extensions/image';
import { Italic } from 'tiptap/core/extensions/italic';
import { Katex } from 'tiptap/core/extensions/katex';
import { Link } from 'tiptap/core/extensions/link';
import { ListItem } from 'tiptap/core/extensions/listItem';
import { Mention } from 'tiptap/core/extensions/mention';
import { Mind } from 'tiptap/core/extensions/mind';
import { OrderedList } from 'tiptap/core/extensions/ordered-list';
import { Paragraph } from 'tiptap/core/extensions/paragraph';
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
import { TextStyle } from 'tiptap/core/extensions/text-style';
import { Title } from 'tiptap/core/extensions/title';

import {
  closeTag,
  isPlainURL,
  openTag,
  renderCustomContainer,
  renderHardBreak,
  renderHTMLNode,
  renderImage,
  renderOrderedList,
  renderTable,
  renderTableCell,
  renderTableRow,
} from './helpers';

const SerializerConfig = {
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
    [Subscript.name]: { open: '<sub>', close: '</sub>', mixable: true },
    [Superscript.name]: { open: '<sup>', close: '</sup>', mixable: true },
    // FIXME: 如何导出 style？
    [TextStyle.name]: { open: '', close: '', mixable: true, expelEnclosingWhitespace: true },
    ...marks.reduce(
      (acc, { name, tag }) => ({
        ...acc,
        [name]: {
          mixable: true,
          open(state, node) {
            return openTag(tag, node.attrs);
          },
          close: closeTag(tag),
        },
      }),
      {}
    ),
  },

  nodes: {
    [Attachment.name]: renderCustomContainer('attachment'),
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
    [Callout.name]: (state, node) => {
      state.write(`:::callout\n`);
      state.ensureNewLine();
      state.renderContent(node);
      state.ensureNewLine();
      state.write(':::');
      state.closeBlock(node);
    },
    [CodeBlock.name]: (state, node) => {
      state.write(`\`\`\`${node.attrs.language || ''}\n`);
      state.text(node.textContent, false);
      state.ensureNewLine();
      state.write('```');
      state.closeBlock(node);
    },
    [Countdown.name]: renderCustomContainer('countdown'),
    [DocumentChildren.name]: renderCustomContainer('documentChildren'),
    [DocumentReference.name]: renderCustomContainer('documentReference'),
    [Excalidraw.name]: renderCustomContainer('excalidraw'),
    [Flow.name]: renderCustomContainer('flow'),
    [HardBreak.name]: renderHardBreak,
    [Heading.name]: defaultMarkdownSerializer.nodes.heading,
    [HorizontalRule.name]: defaultMarkdownSerializer.nodes.horizontal_rule,
    [Iframe.name]: renderCustomContainer('iframe'),
    [Image.name]: renderImage,
    [Katex.name]: (state, node) => {
      state.ensureNewLine();
      // eslint-disable-next-line no-useless-escape
      state.write(`\$\$${node.attrs.text || ''}\$\$`);
      state.closeBlock(node);
    },
    [ListItem.name]: defaultMarkdownSerializer.nodes.list_item,
    [Mind.name]: renderCustomContainer('mind'),
    [Mention.name]: renderCustomContainer('mention'),
    [OrderedList.name]: renderOrderedList,
    [Paragraph.name]: defaultMarkdownSerializer.nodes.paragraph,
    [Status.name]: renderCustomContainer('status'),
    [Table.name]: renderTable,
    [TableCell.name]: renderTableCell,
    [TableHeader.name]: renderTableCell,
    [TableOfContents.name]: renderCustomContainer('tableOfContents'),
    [TableRow.name]: renderTableRow,
    [TaskItem.name]: (state, node) => {
      state.write(`[${node.attrs.checked ? 'x' : ' '}] `);
      state.renderContent(node);
    },
    [TaskList.name]: (state, node) => {
      state.renderList(node, '  ', () => (node.attrs.bullet || '*') + ' ');
    },
    [Text.name]: defaultMarkdownSerializer.nodes.text,
    [Title.name]: renderHTMLNode('div', false, true, { class: 'title' }),
  },
};

/**
 *  将 ProseMirror Document Node JSON 转换为 markdown 字符串
 * @param param.content
 * @returns
 */
export const prosemirrorToMarkdown = ({ content }) => {
  const serializer = new ProseMirrorMarkdownSerializer(SerializerConfig.nodes, SerializerConfig.marks);
  const markdown = serializer.serialize(content, {
    tightLists: true,
  });

  return markdown;
};
