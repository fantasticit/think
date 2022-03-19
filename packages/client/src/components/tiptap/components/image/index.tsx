import { NodeViewWrapper } from '@tiptap/react';
import { Resizeable } from 'components/resizeable';

export const ImageWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { src, alt, title, width, height, textAlign } = node.attrs;

  const onResize = (size) => {
    updateAttributes({ height: size.height, width: size.width });
  };

  const content = src && <img src={src} alt={alt} width={width} height={height} />;

  return (
    <NodeViewWrapper as="div" style={{ textAlign, fontSize: 0, maxWidth: '100%' }}>
      {isEditable ? (
        <Resizeable width={width} height={height} onChange={onResize}>
          {content}
        </Resizeable>
      ) : (
        <div style={{ display: 'inline-block', width, height, maxWidth: '100%' }}>{content}</div>
      )}
    </NodeViewWrapper>
  );
};
