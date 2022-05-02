import React, { useEffect, useRef } from 'react';
import { BubbleMenuPlugin, BubbleMenuPluginProps } from './bubble-menu-plugin';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type BubbleMenuProps = Omit<Optional<BubbleMenuPluginProps, 'pluginKey'>, 'element'> & {
  className?: string;
};

export const BubbleMenu: React.FC<BubbleMenuProps> = (props) => {
  const $element = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = $element.current;

    if (!element) {
      return;
    }

    if (props.editor.isDestroyed) {
      return;
    }

    const {
      pluginKey = 'bubbleMenu',
      editor,
      tippyOptions = {},
      shouldShow = null,
      renderContainerSelector,
      matchRenderContainer,
    } = props;

    const plugin = BubbleMenuPlugin({
      pluginKey,
      editor,
      element,
      tippyOptions,
      shouldShow,
      renderContainerSelector,
      matchRenderContainer,
    });

    editor.registerPlugin(plugin);
    return () => editor.unregisterPlugin(pluginKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editor]);

  return (
    <div ref={$element} className={props.className} style={{ visibility: 'hidden' }}>
      {props.children}
    </div>
  );
};
