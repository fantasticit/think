import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Resizeable } from 'components/resizeable';
import { useEffect, useRef } from 'react';
import cls from 'classnames';
import { Typography, Spin } from '@douyinfe/semi-ui';
import { useToggle } from 'hooks/useToggle';
import { uploadFile } from 'services/file';
import { extractFileExtension, extractFilename } from '../../services/file';
import styles from './index.module.scss';

const { Text } = Typography;

export const ImageWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { hasTrigger, error, src, alt, title, width, height, textAlign } = node.attrs;
  const $upload = useRef<HTMLInputElement>();
  const [loading, toggleLoading] = useToggle(false);

  const onResize = (size) => {
    updateAttributes({ height: size.height, width: size.width });
  };

  const selectFile = () => {
    if (!isEditable || error || src) return;
    isEditable && $upload.current.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    const fileInfo = {
      fileName: extractFilename(file.name),
      fileSize: file.size,
      fileType: file.type,
      fileExt: extractFileExtension(file.name),
    };
    toggleLoading(true);
    try {
      const src = await uploadFile(file);
      updateAttributes({ ...fileInfo, src });
      toggleLoading(false);
    } catch (error) {
      updateAttributes({ error: '图片上传失败：' + (error && error.message) || '未知错误' });
      toggleLoading(false);
    }
  };

  useEffect(() => {
    if (!src && !hasTrigger) {
      selectFile();
      updateAttributes({ hasTrigger: true });
    }
  }, [src, hasTrigger]);

  const content = (() => {
    if (error) {
      return (
        <div className={cls(styles.wrap, 'render-wrapper')}>
          <Text>{error}</Text>
        </div>
      );
    }

    if (!src) {
      return (
        <div className={cls(styles.wrap, 'render-wrapper')} onClick={selectFile}>
          <Spin spinning={loading}>
            <Text style={{ cursor: 'pointer' }}>{loading ? '正在上传中' : '请选择图片'}</Text>
            <input ref={$upload} accept="image/*" type="file" hidden onChange={handleFile} />
          </Spin>
        </div>
      );
    }

    const img = <img className="render-wrapper" src={src} alt={alt} width={width} height={height} />;

    if (isEditable) {
      return (
        <Resizeable width={width} height={height} onChange={onResize}>
          {img}
        </Resizeable>
      );
    }

    return <div style={{ display: 'inline-block', width, height, maxWidth: '100%' }}>{img}</div>;
  })();

  return (
    <NodeViewWrapper as="div" style={{ textAlign, fontSize: 0, maxWidth: '100%' }}>
      {content}
      <NodeViewContent />
    </NodeViewWrapper>
  );
};
