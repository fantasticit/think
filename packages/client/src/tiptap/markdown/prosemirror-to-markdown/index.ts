import { MarkdownSerializer as ProseMirrorMarkdownSerializer, defaultMarkdownSerializer } from 'prosemirror-markdown';
import { Attachment } from 'tiptap/extensions/attachment';
import { Bold } from 'tiptap/extensions/bold';
import { BulletList } from 'tiptap/extensions/bullet-list';
import { Callout } from 'tiptap/extensions/callout';
import { Code } from 'tiptap/extensions/code';
import { CodeBlock } from 'tiptap/extensions/code-block';
import { Countdown } from 'tiptap/extensions/countdown';
import { DocumentChildren } from 'tiptap/extensions/document-children';
import { DocumentReference } from 'tiptap/extensions/document-reference';
import { HardBreak } from 'tiptap/extensions/hard-break';
import { Heading } from 'tiptap/extensions/heading';
import { HorizontalRule } from 'tiptap/extensions/horizontal-rule';
import { marks } from 'tiptap/extensions/html-marks';
import { Mention } from 'tiptap/extensions/mention';
import { Iframe } from 'tiptap/extensions/iframe';
import { Image } from 'tiptap/extensions/image';
import { Italic } from 'tiptap/extensions/italic';
import { Katex } from 'tiptap/extensions/katex';
import { Link } from 'tiptap/extensions/link';
import { ListItem } from 'tiptap/extensions/listItem';
import { Mind } from 'tiptap/extensions/mind';
import { OrderedList } from 'tiptap/extensions/ordered-list';
import { Paragraph } from 'tiptap/extensions/paragraph';
import { Status } from 'tiptap/extensions/status';
import { Strike } from 'tiptap/extensions/strike';
import { Subscript } from 'tiptap/extensions/subscript';
import { Superscript } from 'tiptap/extensions/superscript';
import { Table } from 'tiptap/extensions/table';
import { TableCell } from 'tiptap/extensions/table-cell';
import { TableHeader } from 'tiptap/extensions/table-header';
import { TableRow } from 'tiptap/extensions/table-row';
import { Text } from 'tiptap/extensions/text';
import { TaskItem } from 'tiptap/extensions/task-item';
import { TaskList } from 'tiptap/extensions/task-list';
import { TextStyle } from 'tiptap/extensions/text-style';
import { Title } from 'tiptap/extensions/title';
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
  renderCustomContainer,
  renderHTMLNode,
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
    blockquote: (state, node) => {
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
    [HardBreak.name]: renderHardBreak,
    [Heading.name]: defaultMarkdownSerializer.nodes.heading,
    [HorizontalRule.name]: defaultMarkdownSerializer.nodes.horizontal_rule,
    [Iframe.name]: renderCustomContainer('iframe'),
    [Image.name]: renderImage,
    [Katex.name]: (state, node) => {
      state.ensureNewLine();
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
    [TableRow.name]: renderTableRow,
    [TaskItem.name]: (state, node) => {
      state.write(`[${node.attrs.checked ? 'x' : ' '}] `);
      state.renderContent(node);
    },
    [TaskList.name]: (state, node) => {
      state.renderList(node, '  ', () => (node.attrs.bullet || '*') + ' ');
    },
    [Text.name]: defaultMarkdownSerializer.nodes.text,
    [Title.name]: renderHTMLNode('p', false, true, { class: 'title' }),
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
