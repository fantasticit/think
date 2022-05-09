import { useCallback } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import cls from 'classnames';
import { EmojiPicker } from 'components/emoji-picker';
import styles from './index.module.scss';

export const CalloutWrapper = ({ editor, node, updateAttributes }) => {
  const { isEditable } = editor;
  const { emoji, textColor, borderColor, backgroundColor } = node.attrs;

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
          backgroundColor,
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
