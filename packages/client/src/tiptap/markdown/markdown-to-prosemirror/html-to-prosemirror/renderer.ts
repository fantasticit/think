import { Editor } from '@tiptap/core';

// marks
import { Bold } from './marks/bold';
import { Code } from './marks/code';
import { Italic } from './marks/italic';
import { Link } from './marks/link';
import { Subscript } from './marks/subscript';
import { Superscript } from './marks/superscript';
import { Underline } from './marks/underline';
import { Attachment } from './nodes/attachment';
import { Blockquote } from './nodes/blockquote';
import { BulletList } from './nodes/bullet-list';
import { Callout } from './nodes/callout';
// 通用
import { CodeBlock } from './nodes/code-block';
import { CodeBlockWrapper } from './nodes/code-block-wrapper';
import { Countdown } from './nodes/countdown';
import { DocumentChildren } from './nodes/document-children';
import { DocumentReference } from './nodes/document-reference';
import { Excalidraw } from './nodes/excalidraw';
import { Flow } from './nodes/flow';
import { HardBreak } from './nodes/hard-break';
import { Heading } from './nodes/heading';
import { HorizontalRule } from './nodes/horizontal-rule';
import { Iframe } from './nodes/iframe';
import { Image } from './nodes/image';
import { Katex } from './nodes/katex';
import { ListItem } from './nodes/list-item';
import { Mention } from './nodes/mention';
import { Mind } from './nodes/mind';
import { OrderedList } from './nodes/ordered-list';
import { Paragraph } from './nodes/paragraph';
import { Status } from './nodes/status';
// 表格
import { Table } from './nodes/table';
import { TableCell } from './nodes/table-cell';
import { TableHeader } from './nodes/table-header';
import { TableOfContents } from './nodes/table-of-contents';
import { TableRow } from './nodes/table-row';
// 列表
import { TaskList } from './nodes/task-list';
import { TaskListItem } from './nodes/task-list-item';
import { Text } from './nodes/text';
// 文本
import { Title } from './nodes/title';

export class Renderer {
  editor: Editor;
  document: HTMLElement;
  nodes = [];
  marks = [];
  storedMarks = [];

  constructor(editor) {
    this.editor = editor;
    this.document = undefined;
    this.storedMarks = [];

    this.nodes = [
      Attachment,
      Countdown,
      Callout,
      Excalidraw,
      Iframe,
      Status,
      Mention,
      Mind,
      DocumentChildren,
      DocumentReference,
      Flow,

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
      TableOfContents,

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
    const nodes = [];

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
    for (const i in classes) {
      const Class = classes[i];
      const instance = new Class(this.editor, node);
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
