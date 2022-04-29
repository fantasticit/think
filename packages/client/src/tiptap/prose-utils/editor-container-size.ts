import { Editor } from '@tiptap/core';

const cache = new Map();

export function getEditorContainerDOMSize(editor: Editor): { width: number } {
  const targetNode = editor.options.element as HTMLElement;

  if (!cache.has('width')) {
    cache.set('width', targetNode.clientWidth);
  }

  if (cache.has('width') && cache.get('width') <= 0) {
    cache.set('width', targetNode.clientWidth);
  }

  const config = { attributes: true, childList: true, subtree: true };
  const callback = function (mutationsList, observer) {
    cache.set('width', targetNode.clientWidth);
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);

  editor.on('destroy', () => {
    observer.disconnect();
  });

  return { width: cache.get('width') };
}
