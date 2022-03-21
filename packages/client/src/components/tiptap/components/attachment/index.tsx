import { useEffect, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Button, Typography, Spin, Collapsible } from '@douyinfe/semi-ui';
import { IconDownload, IconPlayCircle } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { useToggle } from 'hooks/useToggle';
import { download } from '../../services/download';
import { uploadFile } from 'services/file';
import { normalizeFileSize, extractFileExtension, extractFilename, normalizeFileType } from '../../services/file';
import styles from './index.module.scss';

const { Text } = Typography;

export const AttachmentWrapper = ({ editor, node, updateAttributes }) => {
  const $upload = useRef();
  const isEditable = editor.isEditable;
  const { autoTrigger, fileName, fileSize, fileExt, fileType, url, error } = node.attrs;
  const [loading, toggleLoading] = useToggle(false);
  const [visible, toggleVisible] = useToggle(false);

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
      const url = await uploadFile(file);
      updateAttributes({ ...fileInfo, url });
      toggleLoading(false);
    } catch (error) {
      updateAttributes({ error: '上传失败：' + (error && error.message) || '未知错误' });
      toggleLoading(false);
    }
  };

  const type = normalizeFileType(fileType);

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
              {type === 'video' || type === 'audio' ? (
                <Tooltip content="播放">
                  <Button theme={'borderless'} type="tertiary" icon={<IconPlayCircle />} onClick={toggleVisible} />
                </Tooltip>
              ) : null}
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

      {url ? (
        <Collapsible isOpen={visible}>
          {type === 'video' && <video controls autoPlay src={url}></video>}
          {type === 'audio' && <audio controls autoPlay src={url}></audio>}
        </Collapsible>
      ) : null}
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};
