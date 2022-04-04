import { MarkdownSerializer as ProseMirrorMarkdownSerializer, defaultMarkdownSerializer } from 'prosemirror-markdown';
import { Attachment } from '../../extensions/attachment';
import { Banner } from '../../extensions/banner';
import { Bold } from '../../extensions/bold';
import { BulletList } from '../../extensions/bullet-list';
import { Code } from '../../extensions/code';
import { CodeBlock } from '../../extensions/code-block';
import { Countdown } from '../../extensions/countdown';
import { DocumentChildren } from '../../extensions/document-children';
import { DocumentReference } from '../../extensions/document-reference';
import { HardBreak } from '../../extensions/hard-break';
import { Heading } from '../../extensions/heading';
import { HorizontalRule } from '../../extensions/horizontal-rule';
import { marks } from '../../extensions/html-marks';
import { Iframe } from '../../extensions/iframe';
import { Image } from '../../extensions/image';
import { Italic } from '../../extensions/italic';
import { Katex } from '../../extensions/katex';
import { Link } from '../../extensions/link';
import { ListItem } from '../../extensions/listItem';
import { Mind } from '../../extensions/mind';
import { OrderedList } from '../../extensions/ordered-list';
import { Paragraph } from '../../extensions/paragraph';
import { Status } from '../../extensions/status';
import { Strike } from '../../extensions/strike';
import { Subscript } from '../../extensions/subscript';
import { Superscript } from '../../extensions/superscript';
import { Table } from '../../extensions/table';
import { TableCell } from '../../extensions/table-cell';
import { TableHeader } from '../../extensions/table-header';
import { TableRow } from '../../extensions/table-row';
import { Text } from '../../extensions/text';
import { TaskItem } from '../../extensions/task-item';
import { TaskList } from '../../extensions/task-list';
import { TextStyle } from '../../extensions/text-style';
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
    [Banner.name]: (state, node) => {
      state.write(`:::${node.attrs.type || 'info'}\n`);
      state.ensureNewLine();
      state.renderContent(node);
      state.ensureNewLine();
      state.write(':::');
      state.closeBlock(node);
    },
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
