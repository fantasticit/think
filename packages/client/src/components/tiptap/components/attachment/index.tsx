import { useEffect, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Button, Typography, Spin } from '@douyinfe/semi-ui';
import { IconDownload } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { useToggle } from 'hooks/useToggle';
import { download } from '../../services/download';
import { uploadFile } from 'services/file';
import { normalizeFileSize, extractFileExtension, extractFilename } from '../../services/file';
import styles from './index.module.scss';

const { Text } = Typography;

export const AttachmentWrapper = ({ node, updateAttributes }) => {
  const $upload = useRef();
  const { autoTrigger, fileName, fileSize, fileExt, fileType, url, error } = node.attrs;
  const [loading, toggleLoading] = useToggle(false);

  const selectFile = () => {
    // @ts-ignore
    $upload.current.click();
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
      const url = await uploadFile(file);
      updateAttributes({ ...fileInfo, url });
      toggleLoading(false);
    } catch (error) {
      updateAttributes({ error: '上传失败：' + (error && error.message) || '未知错误' });
      toggleLoading(false);
    }
  };

  useEffect(() => {
    if (!url && !autoTrigger) {
      selectFile();
      updateAttributes({ autoTrigger: true });
    }
  }, [url, autoTrigger]);

  return (
    <NodeViewWrapper as="div">
      <div className={styles.wrap}>
        {!url ? (
          error ? (
            <Text>{error}</Text>
          ) : (
            <Spin spinning={loading}>
              <Text onClick={selectFile} style={{ cursor: 'pointer' }}>
                {loading ? '正在上传中' : '请选择文件'}
              </Text>
              <input ref={$upload} type="file" hidden onChange={handleFile} />
            </Spin>
          )
        ) : (
          <>
            <span>
              {fileName}.{fileExt}
              <Text type="tertiary"> ({normalizeFileSize(fileSize)})</Text>
            </span>
            <span>
              <Tooltip content="下载">
                <Button
                  theme={'borderless'}
                  type="tertiary"
                  icon={<IconDownload />}
                  onClick={() => download(url, name)}
                />
              </Tooltip>
            </span>
          </>
        )}
      </div>
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};
