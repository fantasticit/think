import { Editor, isNodeSelection, isTextSelection, posToDOMRect } from '@tiptap/core';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import tippy, { Instance, Props } from 'tippy.js';

export interface BubbleMenuPluginProps {
  pluginKey: PluginKey | string;
  editor: Editor;
  element: HTMLElement;
  tippyOptions?: Partial<Props>;
  shouldShow?:
    | ((props: {
        editor: Editor;
        node?: HTMLElement;
        view?: EditorView;
        state?: EditorState;
        oldState?: EditorState;
        from?: number;
        to?: number;
      }) => boolean)
    | null;
  getRenderContainer?: (node: HTMLElement) => HTMLElement;
  defaultAnimation?: boolean;
}

export type BubbleMenuViewProps = BubbleMenuPluginProps & {
  view: EditorView;
};

const ACTIVE_BUBBLE_MENUS: Instance[] = [];

export class BubbleMenuView {
  public editor: Editor;

  public element: HTMLElement;

  public view: EditorView;

  public preventHide = false;

  public tippy: Instance | undefined;

  public tippyOptions?: Partial<Props>;

  public getRenderContainer?: BubbleMenuPluginProps['getRenderContainer'];

  public defaultAnimation?: BubbleMenuPluginProps['defaultAnimation'];

  public shouldShow: Exclude<BubbleMenuPluginProps['shouldShow'], null> = ({ view, state, from, to }) => {
    const { doc, selection } = state;
    const { empty } = selection;

    // Sometime check for `empty` is not enough.
    // Doubleclick an empty paragraph returns a node size of 2.
    // So we check also for an empty text size.
    const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(state.selection);

    if (!view.hasFocus() || empty || isEmptyTextBlock) {
      return false;
    }

    return true;
  };

  constructor({
    editor,
    element,
    view,
    tippyOptions = {},
    shouldShow,
    getRenderContainer,
    defaultAnimation = true,
  }: BubbleMenuViewProps) {
    this.editor = editor;
    this.element = element;
    this.view = view;
    this.getRenderContainer = getRenderContainer;
    this.defaultAnimation = defaultAnimation;

    if (shouldShow) {
      this.shouldShow = shouldShow;
    }

    this.element.addEventListener('mousedown', this.mousedownHandler, {
      capture: true,
    });
    this.view.dom.addEventListener('dragstart', this.dragstartHandler);
    // this.editor.on('focus', this.focusHandler);
    // this.editor.on('blur', this.blurHandler);
    this.tippyOptions = tippyOptions || {};
    // Detaches menu content from its current parent
    this.element.remove();
    this.element.style.visibility = 'visible';
  }

  mousedownHandler = () => {
    this.preventHide = true;
  };

  dragstartHandler = () => {
    this.hide();
  };

  focusHandler = () => {
    // we use `setTimeout` to make sure `selection` is already updated
    setTimeout(() => this.update(this.editor.view));
  };

  blurHandler = ({ event }: { event: FocusEvent }) => {
    if (this.preventHide) {
      this.preventHide = false;

      return;
    }

    if (event?.relatedTarget && this.element.parentNode?.contains(event.relatedTarget as Node)) {
      return;
    }

    const shouldShow =
      this.editor.isEditable &&
      this.shouldShow?.({
        editor: this.editor,
      });

    if (shouldShow) return;

    this.hide();
  };

  createTooltip() {
    const { element: editorElement } = this.editor.options;
    const editorIsAttached = !!editorElement.parentElement;

    if (this.tippy || !editorIsAttached) {
      return;
    }

    this.tippy = tippy(editorElement, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: true,
      trigger: 'manual',
      placement: 'top',
      hideOnClick: 'toggle',
      ...Object.assign(
        {
          zIndex: 999,
          duration: 200,
          ...(this.defaultAnimation
            ? { animation: 'shift-toward-subtle', moveTransition: 'transform 0.2s ease-in-out' }
            : {}),
        },
        this.tippyOptions
      ),
    });

    // maybe we have to hide tippy on its own blur event as well
    if (this.tippy.popper.firstChild) {
      (this.tippy.popper.firstChild as HTMLElement).addEventListener('blur', (event) => {
        this.blurHandler({ event });
      });
    }
  }

  update(view: EditorView, oldState?: EditorState) {
    const { state, composing } = view;
    const { doc, selection } = state;
    const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);

    if (composing || isSame) {
      return;
    }

    this.createTooltip();

    // support for CellSelections
    const { ranges } = selection;
    const cursorAt = selection.$anchor.pos;
    const from = Math.min(...ranges.map((range) => range.$from.pos));
    const to = Math.max(...ranges.map((range) => range.$to.pos));
    const placement = isNodeSelection(selection)
      ? 'top'
      : Math.abs(cursorAt - to) <= Math.abs(cursorAt - from)
      ? 'bottom-start'
      : 'top-start';
    const domAtPos = view.domAtPos(from).node as HTMLElement;
    const nodeDOM = view.nodeDOM(from) as HTMLElement;
    const node = nodeDOM || domAtPos;

    const shouldShow =
      this.editor.isEditable &&
      this.shouldShow?.({
        editor: this.editor,
        view,
        node,
        state,
        oldState,
        from,
        to,
      });

    if (!shouldShow) {
      this.hide();
      return;
    }

    const otherBubbleMenus = ACTIVE_BUBBLE_MENUS.filter(
      (instance) => instance.id !== this.tippy?.id && instance.popperInstance && instance.popperInstance.state
    );
    const offsetX = this.tippyOptions?.offset?.[0] ?? 0;
    const offsetY = otherBubbleMenus.length
      ? otherBubbleMenus.reduce((prev, instance, currentIndex, array) => {
          const prevY = array[currentIndex - 1]
            ? array[currentIndex - 1]?.popperInstance?.state?.modifiersData?.popperOffsets?.y ?? 0
            : 0;
          const currentY = instance?.popperInstance?.state?.modifiersData?.popperOffsets?.y ?? 0;
          const currentHeight = instance?.popperInstance?.state?.rects?.popper?.height ?? 40;

          if (Math.abs(prevY - currentY) <= currentHeight) {
            prev += currentHeight;
          }

          return prev;
        }, 0)
      : this.tippyOptions?.offset?.[1] ?? 10;

    this.tippy?.setProps({
      offset: [offsetX, offsetY],
      placement,
      getReferenceClientRect: () => {
        let toMountNode = null;

        if (isNodeSelection(state.selection)) {
          if (this.getRenderContainer && node) {
            toMountNode = this.getRenderContainer(node);
          }
        }

        if (this.getRenderContainer && node) {
          toMountNode = this.getRenderContainer(node);
        }

        if (toMountNode && toMountNode.getBoundingClientRect) {
          return toMountNode.getBoundingClientRect();
        }

        if (node && node.getBoundingClientRect) {
          return node.getBoundingClientRect();
        }

        return posToDOMRect(view, from, to);
      },
    });

    this.show();
  }

  addActiveBubbleMenu = () => {
    const idx = ACTIVE_BUBBLE_MENUS.findIndex((instance) => instance?.id === this.tippy?.id);
    if (idx < 0) {
      ACTIVE_BUBBLE_MENUS.push(this.tippy);
    }
  };

  removeActiveBubbleMenu = () => {
    const idx = ACTIVE_BUBBLE_MENUS.findIndex((instance) => instance?.id === this.tippy?.id);
    if (idx > -1) {
      ACTIVE_BUBBLE_MENUS.splice(idx, 1);
    }
  };
  show() {
    this.addActiveBubbleMenu();
    this.tippy?.show();
  }

  hide() {
    this.removeActiveBubbleMenu();
    this.tippy?.hide();
  }

  destroy() {
    this.removeActiveBubbleMenu();
    this.tippy?.destroy();
    this.element.removeEventListener('mousedown', this.mousedownHandler, {
      capture: true,
    });
    this.view.dom.removeEventListener('dragstart', this.dragstartHandler);
    this.editor.off('focus', this.focusHandler);
    this.editor.off('blur', this.blurHandler);
  }
}

export const BubbleMenuPlugin = (options: BubbleMenuPluginProps) => {
  return new Plugin({
    key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: (view) => new BubbleMenuView({ view, ...options }),
  });
};
