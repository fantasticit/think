import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Input } from '@douyinfe/semi-ui';
import { Resizeable } from 'components/resizeable';
import styles from './index.module.scss';

export const IframeWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { url, width, height } = node.attrs;

  const onResize = (size) => {
    updateAttributes({ width: size.width, height: size.height });
  };
  const content = (
    <NodeViewContent as="div" className={styles.wrap}>
      {isEditable && (
        <div className={styles.handlerWrap}>
          <Input placeholder={'输入外链地址'} value={url} onChange={(url) => updateAttributes({ url })}></Input>
        </div>
      )}
      {url && (
        <div className={styles.innerWrap} style={{ pointerEvents: !isEditable ? 'auto' : 'none' }}>
          <iframe src={url}></iframe>
        </div>
      )}
    </NodeViewContent>
  );

  if (!isEditable && !url) {
    return null;
  }

  return (
    <NodeViewWrapper>
      {isEditable ? (
        <Resizeable height={height} width={width} onChange={onResize}>
          {content}
        </Resizeable>
      ) : (
        <div style={{ width, height, maxWidth: '100%' }}>{content}</div>
      )}
    </NodeViewWrapper>
  );
};
