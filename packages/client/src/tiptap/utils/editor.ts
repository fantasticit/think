import { Editor } from '@tiptap/core';

const cache = new Map();

export function getEditorContainerDOMSize(editor: Editor): { width: number } {
  if (!cache.has('width')) {
    cache.set('width', (editor.options.element as HTMLElement).offsetWidth);
  }

  if (cache.has('width') && cache.get('width') <= 0) {
    cache.set('width', (editor.options.element as HTMLElement).offsetWidth);
  }

  return { width: cache.get('width') };
}
