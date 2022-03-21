import { NodeViewWrapper } from '@tiptap/react';
import { Resizeable } from 'components/resizeable';
import { useEffect, useRef } from 'react';
import { Typography, Spin } from '@douyinfe/semi-ui';
import { useToggle } from 'hooks/useToggle';
import { uploadFile } from 'services/file';
import { extractFileExtension, extractFilename } from '../../services/file';
import styles from './index.module.scss';

const { Text } = Typography;

export const ImageWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { autoTrigger, error, src, alt, title, width, height, textAlign } = node.attrs;
  const $upload = useRef();
  const [loading, toggleLoading] = useToggle(false);

  const onResize = (size) => {
    updateAttributes({ height: size.height, width: size.width });
  };

  const selectFile = () => {
    // @ts-ignore
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
      updateAttributes({ error: '上传失败：' + (error && error.message) || '未知错误' });
      toggleLoading(false);
    }
  };

  useEffect(() => {
    if (!src && !autoTrigger) {
      selectFile();
      updateAttributes({ autoTrigger: true });
    }
  }, [src, autoTrigger]);

  const content = (() => {
    if (error) {
      return <Text>{error}</Text>;
    }

    if (!src) {
      return (
        <div className={styles.wrap}>
          <Spin spinning={loading}>
            <Text onClick={selectFile} style={{ cursor: 'pointer' }}>
              {loading ? '正在上传中' : '请选择图片'}
            </Text>
            <input ref={$upload} accept="image/*" type="file" hidden onChange={handleFile} />
          </Spin>
        </div>
      );
    }

    const img = <img src={src} alt={alt} width={width} height={height} />;

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
    </NodeViewWrapper>
  );
};
