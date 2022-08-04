import { NodeViewWrapper } from '@tiptap/react';
import { convertColorToRGBA } from 'helpers/color';
import { Theme, ThemeEnum } from 'hooks/use-theme';
import katex from 'katex';
import { useMemo } from 'react';

import styles from './index.module.scss';

export const KatexWrapper = ({ node, editor }) => {
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
        <span contentEditable={false}>用户未输入公式</span>
      ),
    [text, formatText]
  );

  return (
    <NodeViewWrapper
      className={'render-wrapper'}
      style={{
        backgroundColor,
      }}
    >
      <div className={styles.wrap}>{content}</div>
    </NodeViewWrapper>
  );
};
