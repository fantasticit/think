import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Popover } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { useToggle } from 'hooks/use-toggle';
import { EmojiPicker } from 'components/emoji-picker';
import styles from './index.module.scss';
import { useCallback, useEffect, useMemo } from 'react';

export const BannerWrapper = ({ node, updateAttributes }) => {
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
