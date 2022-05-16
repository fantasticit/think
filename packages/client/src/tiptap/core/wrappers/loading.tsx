import { Spin } from '@douyinfe/semi-ui';
import { NodeViewWrapper } from '@tiptap/react';

export const LoadingWrapper = ({ editor, node }) => {
  const isEditable = editor.isEditable;
  const { text } = node.attrs;

  if (!isEditable) return <NodeViewWrapper />;

  return (
    <NodeViewWrapper as="div">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '1em',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        <Spin tip={text ? `正在上传${text}中...` : ''} />
      </div>
    </NodeViewWrapper>
  );
};
