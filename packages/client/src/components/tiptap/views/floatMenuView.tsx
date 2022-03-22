import { Editor, isNodeSelection, posToDOMRect, Range } from '@tiptap/core';
import tippy, { Instance, Props } from 'tippy.js';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';

export type FloatMenuViewOptions = {
  editor: Editor;
  getReferenceClientRect?: (props: { editor: Editor; range: Range; oldState?: EditorState }) => DOMRect;
  shouldShow: (props: { editor: Editor; range: Range; oldState?: EditorState }, instance: FloatMenuView) => boolean;
  init: (dom: HTMLElement, editor: Editor) => void;
  update?: (
    dom: HTMLElement,
    props: {
      editor: Editor;
      oldState?: EditorState;
      range: Range;
      show: () => void;
      hide: () => void;
    }
  ) => void;
  tippyOptions?: Partial<Props>;
};

export class FloatMenuView {
  public editor: Editor;
  public parentNode: null | HTMLElement;
  private dom: HTMLElement;
  private popup: Instance;
  private _update: FloatMenuViewOptions['update'];
  private shouldShow: FloatMenuViewOptions['shouldShow'];
  private tippyOptions: FloatMenuViewOptions['tippyOptions'];
  private getReferenceClientRect: NonNullable<FloatMenuViewOptions['getReferenceClientRect']> = ({ editor, range }) => {
    const { view, state } = editor;
    if (this.parentNode) {
      return this.parentNode.getBoundingClientRect();
    }
    if (isNodeSelection(state.selection)) {
      const node = view.nodeDOM(range.from) as HTMLElement;

      if (node) {
        return node.getBoundingClientRect();
      }
    }
    return posToDOMRect(view, range.from, range.to);
  };

  constructor(props: FloatMenuViewOptions) {
    this.editor = props.editor;
    this.shouldShow = props.shouldShow;
    this.tippyOptions = props.tippyOptions || {};
    if (props.getReferenceClientRect) {
      this.getReferenceClientRect = props.getReferenceClientRect;
    }
    this._update = props.update;
    this.dom = document.createElement('div');

    // init
    props.init(this.dom, this.editor);

    // popup
    this.createPopup();
  }

  createPopup() {
    const { element: editorElement } = this.editor.options;
    const editorIsAttached = !!editorElement.parentElement;

    if (this.popup || !editorIsAttached) {
      return;
    }

    this.popup = tippy(editorElement, {
      getReferenceClientRect: null,
      content: this.dom,
      interactive: true,
      trigger: 'manual',
      placement: 'top',
      hideOnClick: 'toggle',
      ...Object.assign({ zIndex: 99 }, this.tippyOptions),
    });
  }

  public update(view: EditorView, oldState?: EditorState) {
    const { state, composing } = view;
    const { doc, selection } = state;
    const isSame = oldState && oldState.doc.eq(doc) && oldState.selection.eq(selection);

    if (composing || isSame) {
      return;
    }

    this.createPopup();

    const { ranges } = selection;
    const from = Math.min(...ranges.map((range) => range.$from.pos));
    const to = Math.max(...ranges.map((range) => range.$to.pos));

    const shouldShow = this.shouldShow?.(
      {
        editor: this.editor,
        oldState,
        range: {
          from,
          to,
        },
      },
      this
    );

    if (!shouldShow) {
      this.hide();
      return;
    }

    this._update?.(this.dom, {
      editor: this.editor,
      oldState,
      range: {
        from,
        to,
      },
      show: this.show.bind(this),
      hide: this.hide.bind(this),
    });

    this.popup.setProps({
      getReferenceClientRect: () => {
        return this.getReferenceClientRect({
          editor: this.editor,
          oldState,
          range: {
            from,
            to,
          },
        });
      },
    });

    this.show();
  }

  show() {
    this.popup?.show();
  }

  hide() {
    this.popup?.hide();
  }

  public destroy() {
    this.popup?.destroy();
  }
}
