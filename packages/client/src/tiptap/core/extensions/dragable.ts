import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { NodeSelection } from 'prosemirror-state';
import { __serializeForClipboard } from 'prosemirror-view';

function createRect(rect) {
  if (rect == null) {
    return null;
  }
  const newRect = {
    left: rect.left + document.body.scrollLeft,
    top: rect.top + document.body.scrollTop,
    width: rect.width,
    height: rect.height,
    bottom: 0,
    right: 0,
  };
  newRect.bottom = newRect.top + newRect.height;
  newRect.right = newRect.left + newRect.width;
  return newRect;
}

function absoluteRect(element) {
  return createRect(element.getBoundingClientRect());
}

export const Dragable = Extension.create({
  name: 'dragable',

  addProseMirrorPlugins() {
    let dropElement;
    let currentNode;
    let editorView;
    const WIDTH = 24;

    function drag(e) {
      if (!currentNode || currentNode.nodeType !== 1) return;
      let pos = null;
      const desc = editorView.docView.nearestDesc(currentNode, true);

      if (!(!desc || desc === editorView.docView)) {
        pos = desc.posBefore;
      }

      if (!pos) return;

      editorView.dispatch(editorView.state.tr.setSelection(NodeSelection.create(editorView.state.doc, pos)));
      const slice = editorView.state.selection.content();
      const { dom, text } = __serializeForClipboard(editorView, slice);
      e.dataTransfer.clearData();
      e.dataTransfer.setData('text/html', dom.innerHTML);
      e.dataTransfer.setData('text/plain', text);
      editorView.dragging = { slice, move: true };
    }

    return [
      new Plugin({
        view(view) {
          editorView = view;
          dropElement = document.createElement('div');
          dropElement.setAttribute('draggable', 'true');
          dropElement.className = 'drag-handler';
          dropElement.addEventListener('dragstart', drag);
          view.dom.parentElement.appendChild(dropElement);

          return {
            update(view) {
              editorView = view;
            },
            destroy() {
              if (dropElement && dropElement.parentNode) {
                dropElement.removeEventListener('dragstart', drag);
                dropElement.parentNode.removeChild(dropElement);
              }
            },
          };
        },
        props: {
          handleDOMEvents: {
            drop() {
              dropElement.style.opacity = 0;
              setTimeout(() => {
                const node = document.querySelector('.ProseMirror-hideselection');
                if (node) {
                  node.classList.remove('ProseMirror-hideselection');
                }
              }, 50);
            },
            mousemove(view, event) {
              const coords = { left: event.clientX, top: event.clientY };
              const pos = view.posAtCoords(coords);

              if (!pos) return;

              let node = view.domAtPos(pos.pos);

              node = node.node;

              while (node && node.parentNode) {
                if (node.parentNode?.classList?.contains?.('ProseMirror')) {
                  break;
                }
                node = node.parentNode;
              }

              if (!node || !node.getBoundingClientRect) {
                return;
              }

              if (node?.classList?.contains('node-title') || node?.classList?.contains('node-table')) {
                return;
              }

              currentNode = node;

              const rect = absoluteRect(node);
              const win = node.ownerDocument.defaultView;
              rect.top += win.pageYOffset;
              rect.left += win.pageXOffset;
              rect.width = WIDTH + 'px';
              dropElement.style.left = rect.left - WIDTH + 'px';
              dropElement.style.top = rect.top + 6 + 'px';
              dropElement.style.opacity = 1;
            },
          },
        },
      }),
    ];
  },
});
