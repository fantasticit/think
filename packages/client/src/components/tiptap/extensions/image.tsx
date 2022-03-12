import { Plugin } from 'prosemirror-state';
import { Image as TImage } from '@tiptap/extension-image';
import { NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from '@tiptap/react';
import { Resizeable } from 'components/resizeable';
import { uploadFile } from 'services/file';

const Render = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { src, alt, title, width, height, textAlign } = node.attrs;

  const onResize = (size) => {
    updateAttributes({ height: size.height, width: size.width });
  };

  const content = src && <img src={src} alt={title} style={{ width: '100%', height: '100%' }} />;

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

export const Image = TImage.extend({
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: 'auto',
      },
      height: {
        default: 'auto',
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(Render);
  },
});
