import { useCallback } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import cls from 'classnames';
import { EmojiPicker } from 'components/emoji-picker';
import styles from './index.module.scss';

export const CalloutWrapper = ({ node, updateAttributes }) => {
  const { emoji, textColor, borderColor, backgroundColor } = node.attrs;

  const onSelectEmoji = useCallback((emoji) => {
    updateAttributes({ emoji });
  }, []);

  return (
    <NodeViewWrapper id="js-bannber-container" className={cls(styles.wrap)}>
      <div
        className={cls(styles.innerWrap, 'render-wrapper')}
        style={{
          borderColor,
          backgroundColor,
        }}
      >
        <EmojiPicker onSelectEmoji={onSelectEmoji}>
          <span className={styles.icon}>{emoji || 'Icon'}</span>
        </EmojiPicker>
        <NodeViewContent
          style={{
            color: textColor,
          }}
        />
      </div>
    </NodeViewWrapper>
  );
};
