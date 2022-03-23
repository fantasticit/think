// 自定义节点
import { Iframe } from './nodes/iframe';
import { Attachment } from './nodes/attachment';
import { Banner } from './nodes/banner';
import { Status } from './nodes/status';
import { DocumentReference } from './nodes/documentReference';
import { DocumentChildren } from './nodes/documentChildren';
import { Mind } from './nodes/mind';
// 通用
import { CodeBlock } from './nodes/codeBlock';
import { CodeBlockWrapper } from './nodes/codeBlockWrapper';
import { HardBreak } from './nodes/hardBreak';
import { Heading } from './nodes/heading';
import { Image } from './nodes/image';
import { HorizontalRule } from './nodes/horizontalRule';
import { Blockquote } from './nodes/blockQuote';
// 文本
import { Title } from './nodes/title';
import { Katex } from './nodes/katex';
import { Paragraph } from './nodes/paragraph';
import { Text } from './nodes/text';
// 表格
import { Table } from './nodes/table';
import { TableHeader } from './nodes/tableHeader';
import { TableRow } from './nodes/tableRow';
import { TableCell } from './nodes/tableCell';
// 列表
import { TaskList } from './nodes/taskList';
import { TaskListItem } from './nodes/taskListItem';
import { ListItem } from './nodes/listItem';
import { OrderedList } from './nodes/orderedList';
import { BulletList } from './nodes/bulletList';

// marks
import { Bold } from './marks/bold';
import { Code } from './marks/code';
import { Italic } from './marks/italic';
import { Link } from './marks/link';
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
      Banner,
      Iframe,
      Status,
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

    this.marks = [Bold, Code, Italic, Link, Underline];
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
