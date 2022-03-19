import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Banner as SemiBanner } from '@douyinfe/semi-ui';
import styles from './index.module.scss';

export const BannerWrapper = ({ node }) => {
  return (
    <NodeViewWrapper id="js-bannber-container" className={styles.wrap}>
      <SemiBanner
        type={node.attrs.type}
        description={<NodeViewContent />}
        closeIcon={null}
        fullMode={false}
      />
    </NodeViewWrapper>
  );
};
