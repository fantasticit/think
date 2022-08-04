import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { EmojiPicker } from 'components/emoji-picker';
import { convertColorToRGBA } from 'helpers/color';
import { Theme, ThemeEnum } from 'hooks/use-theme';
import { useCallback, useMemo } from 'react';

import styles from './index.module.scss';

export const CalloutWrapper = ({ editor, node, updateAttributes }) => {
  const { isEditable } = editor;
  const { emoji, textColor, borderColor, backgroundColor } = node.attrs;
  const { theme } = Theme.useHook();
  const backgroundColorOpacity = useMemo(() => {
    if (!backgroundColor) return backgroundColor;
    if (theme === ThemeEnum.dark) return convertColorToRGBA(backgroundColor, 0.75);
    return backgroundColor;
  }, [backgroundColor, theme]);

  const onSelectEmoji = useCallback(
    (emoji) => {
      updateAttributes({ emoji });
    },
    [updateAttributes]
  );

  return (
    <NodeViewWrapper id="js-callout-container" className={cls(styles.wrap)}>
      <div
        className={cls(styles.innerWrap, 'render-wrapper')}
        style={{
          borderColor,
          backgroundColor: backgroundColorOpacity,
        }}
      >
        {isEditable ? (
          <EmojiPicker onSelectEmoji={onSelectEmoji}>
            <span className={styles.icon}>{emoji || 'Icon'}</span>
          </EmojiPicker>
        ) : (
          emoji && <span className={styles.icon}>{emoji}</span>
        )}
        <NodeViewContent
          style={{
            color: textColor,
          }}
        />
      </div>
    </NodeViewWrapper>
  );
};
