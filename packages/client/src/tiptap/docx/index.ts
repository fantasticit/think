import axios from 'axios';
import { HeadingLevel } from 'docx';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Attachment } from 'tiptap/core/extensions/attachment';
import { BulletList } from 'tiptap/core/extensions/bullet-list';
import { Callout } from 'tiptap/core/extensions/callout';
import { CodeBlock } from 'tiptap/core/extensions/code-block';
import { DocumentChildren } from 'tiptap/core/extensions/document-children';
import { DocumentReference } from 'tiptap/core/extensions/document-reference';
import { Flow } from 'tiptap/core/extensions/flow';
import { HardBreak } from 'tiptap/core/extensions/hard-break';
import { HorizontalRule } from 'tiptap/core/extensions/horizontal-rule';
import { Iframe } from 'tiptap/core/extensions/iframe';
import { Katex } from 'tiptap/core/extensions/katex';
import { ListItem } from 'tiptap/core/extensions/listItem';
import { Mind } from 'tiptap/core/extensions/mind';
import { OrderedList } from 'tiptap/core/extensions/ordered-list';
import { Status } from 'tiptap/core/extensions/status';
import { TableOfContents } from 'tiptap/core/extensions/table-of-contents';
import { TaskItem } from 'tiptap/core/extensions/task-item';
import { TaskList } from 'tiptap/core/extensions/task-list';
import { Title } from 'tiptap/core/extensions/title';

import { defaultMarks, defaultNodes, DocxSerializer, writeDocx } from './prosemirror-docx';

function getLatexFromNode(node): string {
  return node.attrs.text;
}

const nodeSerializer = {
  ...defaultNodes,
  [Title.name](state, node) {
    state.renderInline(node);
    state.closeBlock(node, { heading: HeadingLevel.TITLE });
  },
  [DocumentChildren.name](state, node) {
    state.renderInline(node);
    state.closeBlock(node);
  },
  [DocumentReference.name](state, node) {
    state.renderInline(node);
    state.closeBlock(node);
  },
  [TableOfContents.name](state, node) {
    state.renderInline(node);
    state.closeBlock(node);
  },
  [BulletList.name](state, node) {
    state.renderList(node, 'bullets');
  },
  [OrderedList.name](state, node) {
    state.renderList(node, 'numbered');
  },
  [ListItem.name](state, node) {
    state.renderListItem(node);
  },
  [HorizontalRule.name](state, node) {
    state.closeBlock(node, { thematicBreak: true });
    state.closeBlock(node);
  },
  [TaskList.name](state, node) {
    state.renderInline(node);
    state.closeBlock(node);
  },
  [TaskItem.name](state, node) {
    state.renderInline(node);
    state.closeBlock(node);
  },
  [CodeBlock.name](state, node) {
    state.renderInline(node.content?.content ?? '');
    state.closeBlock(node);
  },
  [Status.name](state, node) {
    state.text(node.attrs.text ?? '');
    state.closeBlock(node);
  },
  [Flow.name](state, node) {
    state.renderContent(node);
    state.closeBlock(node);
  },
  [Mind.name](state, node) {
    state.renderContent(node);
    state.closeBlock(node);
  },
  [HardBreak.name](state, node) {
    state.addRunOptions({ break: 1 });
  },
  [Katex.name](state, node) {
    state.math(getLatexFromNode(node), { inline: false });
    state.closeBlock(node);
  },
  [Iframe.name](state, node) {
    state.renderContent(node);
    state.closeBlock(node);
  },
  [Attachment.name](state, node) {
    state.renderContent(node);
    state.closeBlock(node);
  },
  [Callout.name](state, node) {
    state.renderContent(node);
    state.closeBlock(node);
  },
};

const docxSerializer = new DocxSerializer(nodeSerializer, defaultMarks);

async function getImageBuffer(src: string) {
  const image = await axios
    .get(src, {
      responseType: 'arraybuffer',
    })
    .catch(() => {
      return { data: '' };
    });
  return Buffer.from(image.data);
}

export const prosemirrorToDocx = async (view: EditorView, state: EditorState): Promise<Blob> => {
  const dom = view.dom.closest('.ProseMirror');
  const imageBufferCache = new Map();
  const images = Array.from(await dom.querySelectorAll('img')) as HTMLImageElement[];

  await Promise.all(
    images.map(async (img) => {
      try {
        const buffer = await getImageBuffer(img.src);
        imageBufferCache.set(img.src, buffer);
      } catch (e) {
        imageBufferCache.set(img.src, Buffer.from('图片加载失败'));
      }
    })
  );

  const wordDocument = docxSerializer.serialize(state.doc, {
    getImageBuffer(src) {
      return imageBufferCache.get(src);
    },
  });

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    await writeDocx(wordDocument, (buffer) => {
      imageBufferCache.clear();
      resolve(new Blob([buffer]));
    });
  });
};
