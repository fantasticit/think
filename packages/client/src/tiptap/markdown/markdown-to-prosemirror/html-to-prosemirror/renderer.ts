// 自定义节点
import { Iframe } from './nodes/iframe';
import { Attachment } from './nodes/attachment';
import { Banner } from './nodes/banner';
import { Status } from './nodes/status';
import { DocumentReference } from './nodes/document-reference';
import { DocumentChildren } from './nodes/document-children';
import { Mention } from './nodes/mention';
import { Mind } from './nodes/mind';
// 通用
import { CodeBlock } from './nodes/code-block';
import { CodeBlockWrapper } from './nodes/code-block-wrapper';
import { HardBreak } from './nodes/hard-break';
import { Heading } from './nodes/heading';
import { Image } from './nodes/image';
import { HorizontalRule } from './nodes/horizontal-rule';
import { Blockquote } from './nodes/blockquote';
import { Countdown } from './nodes/countdown';
// 文本
import { Title } from './nodes/title';
import { Katex } from './nodes/katex';
import { Paragraph } from './nodes/paragraph';
import { Text } from './nodes/text';
// 表格
import { Table } from './nodes/table';
import { TableHeader } from './nodes/table-header';
import { TableRow } from './nodes/table-row';
import { TableCell } from './nodes/table-cell';
// 列表
import { TaskList } from './nodes/task-list';
import { TaskListItem } from './nodes/task-list-item';
import { ListItem } from './nodes/list-item';
import { OrderedList } from './nodes/ordered-list';
import { BulletList } from './nodes/bullet-list';

// marks
import { Bold } from './marks/bold';
import { Code } from './marks/code';
import { Italic } from './marks/italic';
import { Link } from './marks/link';
import { Subscript } from './marks/subscript';
import { Superscript } from './marks/superscript';
import { Underline } from './marks/underline';

export class Renderer {
  document: HTMLElement;
  nodes = [];
  marks = [];
  storedMarks = [];

  constructor() {
    this.document = undefined;
    this.storedMarks = [];

    this.nodes = [
      Attachment,
      Countdown,
      Banner,
      Iframe,
      Status,
      Mention,
      Mind,
      DocumentChildren,
      DocumentReference,

      CodeBlock,
      CodeBlockWrapper,
      HardBreak,
      Heading,
      Image,
      HorizontalRule,

      Title,
      Katex,
      Paragraph,

      Text,
      Blockquote,

      Table,
      TableHeader,
      TableRow,
      TableCell,

      // 列表
      TaskList,
      TaskListItem,
      OrderedList,
      ListItem,
      BulletList,
    ];

    this.marks = [Bold, Code, Italic, Link, Subscript, Superscript, Underline];
  }

  setDocument(document) {
    this.document = document;
  }

  stripWhitespace(value) {
    return value;
  }

  getDocumentBody() {
    return this.document;
  }

  render(value) {
    this.setDocument(value);
    const content = this.renderChildren(this.getDocumentBody());

    return {
      type: 'doc',
      content,
    };
  }

  renderChildren(node) {
    let nodes = [];

    node.childNodes.forEach((child) => {
      const NodeClass = this.getMatchingNode(child);
      let MarkClass;

      if (NodeClass) {
        let item = NodeClass.data();

        if (!item) {
          if (child.hasChildNodes()) {
            nodes.push(...this.renderChildren(child));
          }
          return;
        }

        if (child.hasChildNodes()) {
          item = {
            ...item,
            content: this.renderChildren(child),
          };
        }

        if (this.storedMarks.length) {
          item = {
            ...item,
            marks: this.storedMarks,
          };
          this.storedMarks = [];
        }

        if (NodeClass.wrapper) {
          item.content = [
            {
              ...NodeClass.wrapper,
              content: item.content || [],
            },
          ];
        }

        nodes.push(item);
      } else if ((MarkClass = this.getMatchingMark(child))) {
        this.storedMarks.push(MarkClass.data());

        if (child.hasChildNodes()) {
          nodes.push(...this.renderChildren(child));
        }
      } else if (child.hasChildNodes()) {
        nodes.push(...this.renderChildren(child));
      }
    });

    return nodes;
  }

  getMatchingNode(item) {
    return this.getMatchingClass(item, this.nodes);
  }

  getMatchingMark(item) {
    return this.getMatchingClass(item, this.marks);
  }

  getMatchingClass(node, classes) {
    for (let i in classes) {
      const Class = classes[i];
      const instance = new Class(node);
      if (instance.matching()) {
        return instance;
      }
    }

    return false;
  }

  addNode(node) {
    this.nodes.push(node);
  }

  addNodes(nodes) {
    for (const i in nodes) {
      this.addNode(nodes[i]);
    }
  }

  addMark(mark) {
    this.marks.push(mark);
  }

  addMarks(marks) {
    for (const i in marks) {
      this.addMark(marks[i]);
    }
  }
}
