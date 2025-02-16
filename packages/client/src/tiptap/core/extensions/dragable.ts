import type { Editor } from '@tiptap/core';
import { Extension, findParentNodeClosestToPos } from '@tiptap/core';

import type { Node } from 'prosemirror-model';
import { Fragment, Slice } from 'prosemirror-model';
import { NodeSelection, Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
// @ts-expect-error
import { __serializeForClipboard } from 'prosemirror-view';

function findNodeByUuid(editor: Editor, uuid: string) {
  let target = null;
  let pos = -1;

  if (editor && !editor.isDestroyed) {
    editor.state.doc.descendants((node, p) => {
      if (node.attrs.uuid === uuid) {
        target = node;
        pos = p;
        return false;
      }
    });
  }

  return { node: target, pos };
}

export interface GlobalDragHandleOptions {
  dragHandleWidth: number;
  scrollTreshold: number;
  dragHandleSelector?: string;
}

function absoluteRect(node: Element) {
  const data = node.getBoundingClientRect();

  return {
    top: data.top,
    left: data.left,
    width: data.width,
  };
}

function nodeDOMAtCoords(coords: { x: number; y: number }) {
  return document
    .elementsFromPoint(coords.x, coords.y)
    .find(
      (elem: Element) =>
        elem.parentElement?.matches?.('.ProseMirror') ||
        elem.matches(['li', 'p:not(:first-child)', 'pre', 'blockquote', 'h1, h2, h3, h4, h5, h6'].join(', '))
    );
}

function nodePosAtDOM(node: Element, view: EditorView, options: GlobalDragHandleOptions) {
  const boundingRect = node.getBoundingClientRect();

  return view.posAtCoords({
    left: boundingRect.left + 50 + options.dragHandleWidth,
    top: boundingRect.top + 1,
  })?.inside;
}

function calcNodePos(pos: number, view: EditorView) {
  const $pos = view.state.doc.resolve(pos);
  if ($pos.depth > 1) return $pos.before($pos.depth);
  return pos;
}

export function DragHandlePlugin(options: GlobalDragHandleOptions & { pluginKey: string; editor: Editor }) {
  const editor = options.editor;
  let listType = '';
  let dragHandleElement: HTMLElement | null = null;

  let activeNode: { node: Node; pos: number } | null = null;

  const handleDragStart = (event: DragEvent) => {
    const view = options.editor.view;

    view.focus();

    if (!event.dataTransfer) return;

    const node = nodeDOMAtCoords({
      x: event.clientX + 50 + options.dragHandleWidth,
      y: event.clientY,
    });

    if (!(node instanceof Element)) return;

    if (activeNode && NodeSelection.isSelectable(activeNode.node)) {
      const selection = NodeSelection.create(view.state.doc, activeNode.pos);
      view.dispatch(view.state.tr.setSelection(selection));
    } else {
      let draggedNodePos = nodePosAtDOM(node, view, options);
      if (draggedNodePos == null || draggedNodePos < 0) return;
      draggedNodePos = calcNodePos(draggedNodePos, view);

      const { from, to } = view.state.selection;
      const diff = from - to;

      const fromSelectionPos = calcNodePos(from, view);
      let differentNodeSelected = false;

      const nodePos = view.state.doc.resolve(fromSelectionPos);

      // Check if nodePos points to the top level node
      if (nodePos.node().type.name === 'doc') {
        differentNodeSelected = true;
      } else {
        const nodeSelection = NodeSelection.create(view.state.doc, nodePos.before());

        // Check if the node where the drag event started is part of the current selection
        differentNodeSelected = !(
          draggedNodePos + 1 >= nodeSelection.$from.pos && draggedNodePos <= nodeSelection.$to.pos
        );
      }
      let selection = view.state.selection;
      if (!differentNodeSelected && diff !== 0 && !(view.state.selection instanceof NodeSelection)) {
        const endSelection = NodeSelection.create(view.state.doc, to - 1);
        selection = TextSelection.create(view.state.doc, draggedNodePos, endSelection.$to.pos);
      } else {
        selection = NodeSelection.create(view.state.doc, draggedNodePos);

        // select complete table instead of just a row
        if ((selection as NodeSelection).node.type.name === 'tableRow') {
          const $pos = view.state.doc.resolve(selection.from);
          selection = NodeSelection.create(view.state.doc, $pos.before());
        }
      }
      view.dispatch(view.state.tr.setSelection(selection));
    }

    // If the selected node is a list item, we need to save the type of the wrapping list e.g. OL or UL
    if (view.state.selection instanceof NodeSelection && view.state.selection.node.type.name === 'listItem') {
      listType = node.parentElement!.tagName.toUpperCase();
    }

    const slice = view.state.selection.content();
    const { dom, text } = __serializeForClipboard(view, slice);
    event.dataTransfer.clearData();
    event.dataTransfer.setData('text/html', dom.innerHTML);
    event.dataTransfer.setData('text/plain', text);
    event.dataTransfer.effectAllowed = 'copyMove';
    event.dataTransfer.setDragImage(node, 0, 0);
    view.dragging = { slice, move: true };
  };

  const hideDragHandle = () => {
    if (dragHandleElement) {
      dragHandleElement.classList.add('hide');
    }
    activeNode = null;
  };

  const showDragHandle = () => {
    if (dragHandleElement) {
      dragHandleElement.classList.remove('hide');
    }
  };

  const onDragHandleDrag = (e: DragEvent) => {
    hideDragHandle();
    const scrollY = window.scrollY;
    if (e.clientY < options.scrollTreshold) {
      window.scrollTo({ top: scrollY - 30, behavior: 'smooth' });
    } else if (window.innerHeight - e.clientY < options.scrollTreshold) {
      window.scrollTo({ top: scrollY + 30, behavior: 'smooth' });
    }
  };

  const showDragHandleAtDOM = (node: HTMLElement | undefined) => {
    const notDragging = node?.closest('.not-draggable');

    if (!(node instanceof Element) || node.matches('ul, ol') || notDragging) {
      hideDragHandle();
      return;
    }

    const compStyle = window.getComputedStyle(node);
    const parsedLineHeight = Number.parseInt(compStyle.lineHeight, 10);
    const lineHeight = Number.isNaN(parsedLineHeight) ? Number.parseInt(compStyle.fontSize) * 1.2 : parsedLineHeight;
    const paddingTop = Number.parseInt(compStyle.paddingTop, 10);

    const rect = absoluteRect(node);
    rect.top += (lineHeight - 24) / 2;
    rect.top += paddingTop;
    if (node.matches('ul:not([data-type=taskList]) li, ol li')) {
      rect.left -= options.dragHandleWidth;
    }
    rect.width = options.dragHandleWidth;

    if (!dragHandleElement) return;

    dragHandleElement.style.left = `${rect.left - rect.width - 12}px`;
    dragHandleElement.style.top = `${rect.top}px`;
    showDragHandle();
  };

  const onEditorUpdate = () => {
    if (!editor.isEditable) {
      hideDragHandle();
    }
  };

  // const onSelectionUpdate = () => {
  //   if (!editor.isEditable)
  //     return

  //   const maybeNode = findParentNodeClosestToPos(editor.state.selection.$anchor, node => !node.isInline)

  //   if (!maybeNode)
  //     return

  //   const maybeDOM = findDomRefAtPos(maybeNode.pos, editor.view.domAtPos.bind(editor.view))

  //   if (maybeDOM) {
  //     showDragHandleAtDOM(maybeDOM as HTMLElement)
  //     activeNode = { node: maybeNode.node, pos: maybeNode.pos }
  //   }
  // }

  const callShowDraggableMenu = () => {
    if (!dragHandleElement) return;
    showDragHandle();
  };

  return new Plugin({
    key: new PluginKey(options.pluginKey),
    view: (view) => {
      dragHandleElement = document.createElement('div');
      dragHandleElement.draggable = true;
      dragHandleElement.dataset.dragHandle = '';
      dragHandleElement.classList.add('drag-handle');
      dragHandleElement.addEventListener('dragstart', handleDragStart);
      dragHandleElement.addEventListener('drag', onDragHandleDrag);
      dragHandleElement.addEventListener('mousedown', callShowDraggableMenu);
      dragHandleElement.addEventListener('mouseout', hideDragHandle);

      hideDragHandle();
      view?.dom?.parentElement?.appendChild(dragHandleElement);
      // editor.on('selectionUpdate', onSelectionUpdate)
      editor.on('update', onEditorUpdate);

      return {
        destroy: () => {
          dragHandleElement?.removeEventListener('drag', onDragHandleDrag);
          dragHandleElement?.removeEventListener('dragstart', handleDragStart);
          dragHandleElement?.removeEventListener('mousedown', callShowDraggableMenu);
          dragHandleElement?.remove?.();
          dragHandleElement = null;
          // editor.off('selectionUpdate', onSelectionUpdate)
          editor.off('update', onEditorUpdate);
        },
      };
    },
    props: {
      handleDOMEvents: {
        mousemove: (view, event) => {
          if (!view.editable) {
            return;
          }

          const coords = {
            x: event.clientX + 50 + options.dragHandleWidth,
            y: event.clientY,
          };
          const maybePos = editor.view.posAtCoords({ left: coords.x, top: coords.y });
          let dom = nodeDOMAtCoords(coords) as HTMLElement | null;

          while (dom && dom.nodeType === 3) {
            dom = dom.parentElement;
          }

          if (dom?.closest(`[data-node-view-wrapper]`)) {
            dom = dom?.closest(`[data-node-view-wrapper]`);
          }

          if (dom?.closest(`.columns`)) {
            dom = dom?.closest(`.columns`);
          }

          if (dom?.closest(`table`)) {
            dom = dom?.closest(`table`);
          }

          if (!dom) {
            hideDragHandle();
            return false;
          }

          let maybeNode;

          if (dom.getAttribute('data-uuid')) {
            maybeNode = findNodeByUuid(editor, dom.getAttribute('data-uuid')!);
          }

          if (!maybeNode) {
            const p = editor.view.posAtDOM(dom, 1);
            if (!p || p < 0) {
              hideDragHandle();
              return false;
            }
            const maybeAfter = editor.state.doc.resolve(p)?.nodeBefore;

            if (maybeAfter && !maybeAfter.isInline) {
              maybeNode = { node: maybeAfter, pos: p };
            }

            if (!maybeNode && maybePos?.pos) {
              maybeNode = findParentNodeClosestToPos(editor.state.doc.resolve(maybePos?.pos), (node) => {
                return !node.isInline;
              });
            }
          }

          if (!maybeNode) return;

          activeNode = { node: maybeNode.node!, pos: maybeNode.pos };
          showDragHandleAtDOM(dom as HTMLElement);
        },
        keydown: () => {
          hideDragHandle();
        },
        mousewheel: () => {
          hideDragHandle();
        },
        dragstart: (view) => {
          view.dom.classList.add('dragging');
        },
        drop: (view, event) => {
          view.dom.classList.remove('dragging');
          hideDragHandle();
          let droppedNode: Node | null = null;
          const dropPos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });

          if (!dropPos) return;

          if (view.state.selection instanceof NodeSelection) {
            droppedNode = view.state.selection.node;
          }

          if (!droppedNode) return;

          const resolvedPos = view.state.doc.resolve(dropPos.pos);
          const isDroppedInsideList = resolvedPos.parent.type.name === 'listItem';

          if (
            view.state.selection instanceof NodeSelection &&
            view.state.selection.node.type.name === 'listItem' &&
            !isDroppedInsideList &&
            listType === 'OL'
          ) {
            const text = droppedNode.textContent;
            if (!text) return;
            const paragraph = view.state.schema.nodes.paragraph?.createAndFill({}, view.state.schema.text(text));
            const listItem = view.state.schema.nodes.listItem?.createAndFill({}, paragraph);
            const newList = view.state.schema.nodes.orderedList?.createAndFill(null, listItem);
            const slice = new Slice(Fragment.from(newList), 0, 0);
            view.dragging = { slice, move: event.ctrlKey };
          }
        },
        dragend: (view) => {
          view.dom.classList.remove('dragging');
        },
      },
    },
  });
}

export const Dragable = Extension.create({
  name: 'drag',

  addOptions() {
    return {
      dragHandleWidth: 20,
      scrollTreshold: 100,
      dragHandleSelector: 'drag-handle',
    };
  },

  addProseMirrorPlugins() {
    return [
      this.editor.isEditable &&
        DragHandlePlugin({
          editor: this.editor,
          pluginKey: 'drag-handle',
          dragHandleWidth: this.options.dragHandleWidth,
          scrollTreshold: this.options.scrollTreshold,
          dragHandleSelector: this.options.dragHandleSelector,
        }),
    ].filter(Boolean) as Plugin[];
  },
});
