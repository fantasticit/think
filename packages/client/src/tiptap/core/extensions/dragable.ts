import ReactDOM from 'react-dom';

import { Extension } from '@tiptap/core';
import { safePos } from 'tiptap/prose-utils';
import { ActiveNode, removePossibleTable, selectAncestorNodeByDom } from 'tiptap/prose-utils';

import {
  NodeSelection,
  Plugin as PMPlugin,
  PluginKey as PMPluginKey,
  Selection,
  TextSelection,
} from 'prosemirror-state';
import { findParentNodeClosestToPos } from 'prosemirror-utils';
import { __serializeForClipboard, Decoration, DecorationSet, EditorView } from 'prosemirror-view';

const DragablePluginKey = new PMPluginKey('dragable');

export const Dragable = Extension.create({
  name: 'dragable',

  // @ts-ignore
  addProseMirrorPlugins() {
    let editorView: EditorView;
    let dragHandleDOM: HTMLElement;
    let activeNode: ActiveNode | null;
    let activeSelection: Selection | null;
    let dragging = false;
    const isMenuVisible = false;
    let mouseleaveTimer = null;
    const menuActions = { setVisible: (arg: boolean) => {}, update: () => {} };

    const getEditorView = () => editorView;
    const getActiveNode = () => activeNode;

    const createDragHandleDOM = () => {
      const dom = document.createElement('div');
      dom.className = 'dragable';
      dom.draggable = true;
      dom.setAttribute('data-drag-handle', 'true');

      return dom;
    };

    const showDragHandleDOM = () => {
      dragHandleDOM?.classList?.add('show');
      dragHandleDOM?.classList?.remove('hide');
    };

    const activeDragHandleDOM = () => {
      dragHandleDOM?.classList?.add('active');
      dragHandleDOM?.classList?.remove('hide');
    };

    const hideDragHandleDOM = () => {
      dragHandleDOM?.classList?.remove('show');
      dragHandleDOM?.classList?.remove('active');
      dragHandleDOM?.classList?.add('hide');
    };

    const renderDragHandleDOM = (view: EditorView, referenceRectDOM: HTMLElement) => {
      const root = view.dom.parentElement;

      if (!root) return;

      const targetNodeRect = referenceRectDOM.getBoundingClientRect();
      const rootRect = root.getBoundingClientRect();
      const handleRect = dragHandleDOM.getBoundingClientRect();

      let offsetX = -5;

      if (referenceRectDOM.tagName === 'LI') {
        offsetX = referenceRectDOM.getAttribute('data-checked') ? -3 : -16;
      }

      const left = targetNodeRect.left - rootRect.left - handleRect.width + offsetX;
      const top = targetNodeRect.top - rootRect.top + handleRect.height / 2 + root.scrollTop;

      const offsetLeft = 0;

      dragHandleDOM.style.left = `${left + offsetLeft}px`;
      dragHandleDOM.style.top = `${top - 2}px`;

      menuActions?.update?.();

      showDragHandleDOM();
    };

    const handleMouseEnter = () => {
      if (!activeNode) return null;

      clearTimeout(mouseleaveTimer);
      showDragHandleDOM();
    };

    const handleMouseLeave = () => {
      if (!activeNode) return null;

      if (!isMenuVisible) {
        hideDragHandleDOM();
      }
    };

    const handleMouseDown = () => {
      if (!activeNode) return null;

      if (NodeSelection.isSelectable(activeNode.node)) {
        const nodeSelection = NodeSelection.create(editorView.state.doc, activeNode.$pos.pos - activeNode.offset);
        editorView.dispatch(editorView.state.tr.setSelection(nodeSelection));
        editorView.focus();
        activeSelection = nodeSelection;
        return nodeSelection;
      }

      return null;
    };

    const handleMouseUp = () => {
      if (!dragging) return;

      dragging = false;
      activeSelection = null;
      activeNode = null;
    };

    const handleDragStart = (event) => {
      dragging = true;
      if (event.dataTransfer && activeSelection) {
        const slice = activeSelection.content();
        event.dataTransfer.effectAllowed = 'copyMove';
        const { dom, text } = __serializeForClipboard(editorView, slice);
        event.dataTransfer.clearData();
        event.dataTransfer.setData('text/html', dom.innerHTML);
        event.dataTransfer.setData('text/plain', text);
        event.dataTransfer.setDragImage(activeNode?.el as any, 0, 0);

        editorView.dragging = {
          slice,
          move: true,
        };

        menuActions?.setVisible?.(false);
      }
    };

    return [
      new PMPlugin({
        key: DragablePluginKey,
        view: (view) => {
          if (view.editable) {
            dragHandleDOM = createDragHandleDOM();
            dragHandleDOM.addEventListener('mouseenter', handleMouseEnter);
            dragHandleDOM.addEventListener('mouseleave', handleMouseLeave);
            dragHandleDOM.addEventListener('mousedown', handleMouseDown);
            dragHandleDOM.addEventListener('mouseup', handleMouseUp);
            dragHandleDOM.addEventListener('dragstart', handleDragStart);
            view.dom.parentNode?.appendChild(dragHandleDOM);
            view.dom.parentNode.style = 'position: relative;';
          }

          return {
            update(view) {
              editorView = view;
            },
            destroy: () => {
              if (!dragHandleDOM) return;

              clearTimeout(mouseleaveTimer);
              ReactDOM.unmountComponentAtNode(dragHandleDOM);
              dragHandleDOM.removeEventListener('mouseenter', handleMouseEnter);
              dragHandleDOM.removeEventListener('mouseleave', handleMouseLeave);
              dragHandleDOM.removeEventListener('mousedown', handleMouseDown);
              dragHandleDOM.removeEventListener('mouseup', handleMouseUp);
              dragHandleDOM.removeEventListener('dragstart', handleDragStart);
              dragHandleDOM.remove();
            },
          };
        },
        props: {
          // @ts-ignore
          handleDOMEvents: {
            drop: (view, event: DragEvent) => {
              if (!view.editable || !dragHandleDOM) return false;
              if (!activeSelection) return false;

              const eventPos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              setTimeout(() => {
                if (activeSelection) {
                  [
                    'ProseMirror-selectednode',
                    'ProseMirror-selectedblocknode-dragable',
                    'ProseMirror-selectedblocknode-normal',
                  ].forEach((cls) => {
                    (view.dom as HTMLElement).querySelectorAll(`.${cls}`).forEach((dom) => dom.classList.remove(cls));
                  });
                  const noneSelection = new TextSelection(
                    view.state.doc.resolve(safePos(view.state, eventPos?.pos ?? 0))
                  );
                  view.dispatch(view.state.tr.setSelection(noneSelection));
                  this.editor.commands.blur();

                  activeSelection = null;
                  activeNode = null;
                }
              }, 100);

              if (!eventPos) {
                return true;
              }

              const maybeTitle = findParentNodeClosestToPos(
                view.state.doc.resolve(safePos(this.editor.state, eventPos.pos)),
                (node) => node.type.name === 'title'
              );

              // 不允许在 title 处放置
              if (eventPos.pos === 0 || maybeTitle) {
                return true;
              }

              if (dragging) {
                const tr = removePossibleTable(view, event);

                dragging = false;

                if (tr) {
                  view.dispatch(tr);
                  event.preventDefault();
                  return true;
                }
              }

              return false;
            },
            mousemove: (view, event) => {
              if (isMenuVisible) return false;
              if (!view.editable || !dragHandleDOM) return false;

              const coords = { left: event.clientX, top: event.clientY };
              const pos = view.posAtCoords(coords);

              if (!pos || !pos.pos) return false;

              let dom = view.nodeDOM(pos.pos) || view.domAtPos(pos.pos)?.node || event.target;

              const maybeTaskItemOrListItem = findParentNodeClosestToPos(view.state.doc.resolve(pos.pos), (node) =>
                ['taskItem', 'listItem'].some((name) => name === node.type.name)
              );

              if (!dom) {
                if (dragging) return false;
                hideDragHandleDOM();
                return false;
              }

              while (dom && dom.nodeType === 3) {
                dom = dom.parentElement;
              }

              // 选中列表项
              if (maybeTaskItemOrListItem) {
                while (dom && dom.tagName !== 'LI') {
                  dom = dom.parentElement;
                }
              }

              if (dom.tagName === 'LI') {
                if (dom?.parentElement?.childElementCount === 1) {
                  return false;
                }
              }

              // 不允许选中整个列表
              if (dom.tagName === 'UL' || dom.tagName === 'OL') {
                return false;
              }

              try {
                let maybeReactRenderer: HTMLElement | null = dom;

                while (maybeReactRenderer && !maybeReactRenderer.classList?.contains('react-renderer')) {
                  maybeReactRenderer = maybeReactRenderer.parentElement;
                }

                if (maybeReactRenderer && !maybeReactRenderer?.classList?.contains('node-columns')) {
                  dom = maybeReactRenderer;
                }
              } catch (e) {
                //
              }

              if (!(dom instanceof Element)) {
                if (dragging) return false;
                hideDragHandleDOM();
                return false;
              }

              const result = selectAncestorNodeByDom(dom, view);

              if (
                !result ||
                result.node.type.name === 'doc' ||
                result.node.type.name === 'title' ||
                result.node.type.name === 'tableOfContents'
              ) {
                if (dragging) return false;
                hideDragHandleDOM();
                return false;
              }

              // if (result.el.parentElement?.classList.contains('ProseMirror')) {
              //   if (dragging) return false;
              //   hideDragHandleDOM();
              //   return false;
              // }

              activeNode = result;
              renderDragHandleDOM(view, result.el);
              return false;
            },
            keydown: () => {
              if (!editorView.editable || !dragHandleDOM) return false;
              hideDragHandleDOM();
              return false;
            },
            mouseleave: () => {
              clearTimeout(mouseleaveTimer);
              mouseleaveTimer = setTimeout(() => {
                if (!isMenuVisible) {
                  hideDragHandleDOM();
                }
              }, 400);
              return false;
            },
          },
        },
      }),
      new PMPlugin({
        key: new PMPluginKey('AncestorDragablePluginFocusKey'),
        props: {
          decorations(state) {
            const usingActiveSelection = !!activeSelection;
            const selection = state.selection;

            if (selection instanceof NodeSelection) {
              const { from, to } = selection;

              return DecorationSet.create(state.doc, [
                Decoration.node(safePos(state, from), safePos(state, to), {
                  class: usingActiveSelection
                    ? 'ProseMirror-selectedblocknode-dragable'
                    : 'ProseMirror-selectedblocknode-normal',
                }),
              ]);
            }

            return DecorationSet.empty;
          },
        },
      }),
    ];
  },
});
