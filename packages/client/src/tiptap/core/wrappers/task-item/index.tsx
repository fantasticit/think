import { Checkbox } from '@douyinfe/semi-ui';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';

import styles from './index.module.scss';

export const TaskItemWrapper = ({ editor, node, updateAttributes }) => {
  const { checked } = node.attrs;

  return (
    <NodeViewWrapper as="span" className={styles.wrap} contentEditable={false}>
      <Checkbox checked={checked} onChange={(e) => updateAttributes({ checked: e.target.checked })} />
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};
