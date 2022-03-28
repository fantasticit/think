import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useEffect, useMemo } from 'react';
import { Popover, TextArea, Typography, Space } from '@douyinfe/semi-ui';
import { IconHelpCircle } from '@douyinfe/semi-icons';
import katex from 'katex';
import { Checkbox } from '@douyinfe/semi-ui';
import styles from './index.module.scss';

const { Text } = Typography;

export const TaskItemWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { checked } = node.attrs;

  console.log(node.attrs);

  return (
    <NodeViewWrapper as="span" className={styles.wrap} contentEditable={false}>
      <Checkbox checked={checked} onChange={(e) => updateAttributes({ checked: e.target.checked })} />
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};
