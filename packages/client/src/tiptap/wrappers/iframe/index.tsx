import { useCallback, useMemo } from 'react';
import cls from 'classnames';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Typography } from '@douyinfe/semi-ui';
import { Resizeable } from 'components/resizeable';
import styles from './index.module.scss';

const { Text } = Typography;

export const IframeWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { url, width, height } = node.attrs;

  const onResize = useCallback((size) => {
    updateAttributes({ width: size.width, height: size.height });
  }, []);

  const content = useMemo(
    () => (
      <NodeViewContent as="div" className={cls(styles.wrap, 'render-wrapper')}>
        {url ? (
          <div className={styles.innerWrap} style={{ pointerEvents: !isEditable ? 'auto' : 'none' }}>
            <iframe src={url}></iframe>
          </div>
        ) : (
          <div className={styles.emptyWrap}>
            <Text>请设置外链地址</Text>
          </div>
        )}
      </NodeViewContent>
    ),
    [url, width, height]
  );

  if (!isEditable && !url) {
    return null;
  }

  return (
    <NodeViewWrapper>
      {isEditable ? (
        <Resizeable height={height} width={width} onChangeEnd={onResize}>
          <div style={{ width, height, maxWidth: '100%' }}>{content}</div>
        </Resizeable>
      ) : (
        <div style={{ width, height, maxWidth: '100%' }}>{content}</div>
      )}
    </NodeViewWrapper>
  );
};
