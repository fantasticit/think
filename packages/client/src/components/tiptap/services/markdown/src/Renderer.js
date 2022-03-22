import { BulletList } from './Nodes/BulletList';
import { CodeBlock } from './Nodes/CodeBlock';
import { CodeBlockWrapper } from './Nodes/CodeBlockWrapper';
import { HardBreak } from './Nodes/HardBreak';
import { Heading } from './Nodes/Heading';
import { Image } from './Nodes/Image';
import { ListItem } from './Nodes/ListItem';
import { OrderedList } from './Nodes/OrderedList';
import { Paragraph } from './Nodes/Paragraph';
import { Text } from './Nodes/Text';
import { Blockquote } from './Nodes/blockQuote';

import { Table } from './Nodes/table';
import { TableHeader } from './Nodes/tableHeader';
import { TableRow } from './Nodes/tableRow';
import { TableCell } from './Nodes/tableCell';

import { TaskList } from './Nodes/taskList';
import { TaskListItem } from './Nodes/taskListItem';

import { Bold } from './Marks/Bold';
import { Code } from './Marks/Code';
import { Italic } from './Marks/Italic';
import { Link } from './Marks/Link';

export class Renderer {
  constructor() {
    this.document = undefined;
    this.storedMarks = [];

    this.nodes = [
      CodeBlock,
      CodeBlockWrapper,
      HardBreak,
      Heading,
      Image,
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

    this.marks = [Bold, Code, Italic, Link];
  }

  setDocument(document) {
    this.document = document;
  }

  stripWhitespace(value) {
    // return minify(value, {
    //   collapseWhitespace: true,
    // });
    return value;
  }

  getDocumentBody() {
    return this.document;
    // return this.document.window.document.querySelector('body');
  }

  render(value) {
    this.setDocument(value);

    console.log(value);

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
      //   console.log(node);
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
