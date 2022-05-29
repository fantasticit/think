import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { convertColorToRGBA } from 'helpers/color';
import { Theme, ThemeEnum } from 'hooks/use-theme';
import katex from 'katex';
import { useMemo } from 'react';

import styles from './index.module.scss';

export const KatexWrapper = ({ node }) => {
  const { text } = node.attrs;
  const { theme } = Theme.useHook();
  const backgroundColor = useMemo(() => {
    const color = `rgb(254, 242, 237)`;
    if (theme === ThemeEnum.dark) return convertColorToRGBA(color, 0.75);
    return color;
  }, [theme]);

  const formatText = useMemo(() => {
    try {
      return katex.renderToString(`${text}`);
    } catch (e) {
      return text;
    }
  }, [text]);

  const content = useMemo(
    () =>
      text.trim() ? (
        <span contentEditable={false} dangerouslySetInnerHTML={{ __html: formatText }}></span>
      ) : (
        <span contentEditable={false}>点击输入公式</span>
      ),
    [text, formatText]
  );

  return (
    <NodeViewWrapper
      className={cls(styles.wrap, 'render-wrapper')}
      style={{
        backgroundColor,
      }}
      contentEditable={false}
    >
      {content}
    </NodeViewWrapper>
  );
};
