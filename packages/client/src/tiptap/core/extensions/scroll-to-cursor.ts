import { Extension } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import { ImagesLoaded } from 'tiptap/image-load';

/**
 * Options for customizing Scroll2Cursor plugin
 */
export type Scroll2CursorOptions = {
  /**
   * The HTML element that wraps around the editor on which you would
   * call `scrollTo` to scroll to the cursor. Default to `window`.
   */
  scrollerElement?: HTMLElement;
  /**
   * Number of milliseconds to wait before starting scrolling. The main reason
   * for the delay is that it helps prevent flickering when the user hold down
   * the up/down key. Default to 50.
   */
  delay?: number;
  /**
   * Used to override the default function in case there is another
   * platform-specific implementation.
   */
  computeScrollTop?: () => number;
  /**
   * Number of pixels from the bottom where cursor position should be
   * considered too low. Default to 64.
   */
  offsetBottom?: number;
  /**
   * Number of pixels from the top where cursor position should be considered
   * too high. Default to 168.
   */
  offsetTop?: number;
  /**
   * Number of pixels you want to scroll downward/upward when the cursor is
   * too low/high the. Default to 96.
   */
  scrollDistance?: number;
  /**
   * When debugMode is false or not set, the plugin will not print anything to
   * the console.
   */
  debugMode?: boolean;
};

export const Scroll2Cursor = Extension.create<Scroll2CursorOptions>({
  name: 'scroll2Cursor',

  addOptions() {
    return {
      delay: 100,
      offsetTop: 64,
      offsetBottom: 64,
      scrollDistance: 96,
    };
  },

  addProseMirrorPlugins() {
    const { options, editor } = this;
    let timeoutScroll: ReturnType<typeof setTimeout>;
    const offsetBottom = options?.offsetBottom;
    const offsetTop = options?.offsetTop;
    const scrollDistance = options?.scrollDistance;

    function scrollTo(x: number, y: number) {
      const scrollerElement =
        options?.scrollerElement ||
        editor.view?.dom?.parentElement?.parentElement?.parentElement?.parentElement ||
        window;
      scrollerElement.scrollTo(x, y);
    }

    return [
      new Plugin({
        props: {
          handleScrollToSelection(view) {
            const scrollerElement = (options?.scrollerElement ||
              editor.view?.dom?.parentElement?.parentElement?.parentElement?.parentElement ||
              window) as HTMLElement;
            const scrollerHeight = scrollerElement.getBoundingClientRect().height;

            ImagesLoaded(scrollerElement, function () {
              timeoutScroll && clearTimeout(timeoutScroll);

              timeoutScroll = setTimeout(() => {
                if (scrollerHeight <= offsetBottom + offsetTop + scrollDistance) {
                  options?.debugMode && console.info('The window height is too small for the scrolling configurations');
                  return false;
                }

                const top =
                  view.coordsAtPos(view.state.selection.$head.pos).top -
                  (scrollerElement?.getBoundingClientRect().top ?? 0);

                const scrollTop = options?.computeScrollTop
                  ? options.computeScrollTop()
                  : scrollerElement?.scrollTop ??
                    (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) ??
                    -1;

                if (scrollTop === -1) {
                  options?.debugMode && console.error('The plugin could not determine scrollTop');
                  return;
                }

                const offBottom = top + offsetBottom - scrollerHeight;

                if (offBottom > 0) {
                  scrollTo(0, scrollTop + offBottom + scrollDistance);
                  return;
                }

                const offTop = top - offsetTop;
                if (offTop < 0) {
                  scrollTo(0, scrollTop + offTop - scrollDistance);
                }
              }, options.delay);
            });

            return true;
          },
        },
      }),
    ];
  },
});
