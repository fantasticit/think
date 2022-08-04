import { IconClose, IconDownload, IconPlayCircle } from '@douyinfe/semi-icons';
import { Button, Collapsible, Progress, Space, Spin, Toast, Typography } from '@douyinfe/semi-ui';
import { FILE_CHUNK_SIZE } from '@think/domains';
import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { Tooltip } from 'components/tooltip';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { uploadFile } from 'services/file';
import { download, extractFileExtension, extractFilename, normalizeFileSize } from 'tiptap/prose-utils';

import { getFileTypeIcon } from './file-icon';
import styles from './index.module.scss';
import { Player } from './player';

const { Text } = Typography;

export const AttachmentWrapper = ({ editor, node, updateAttributes }) => {
  const $upload = useRef<HTMLInputElement>();
  const isEditable = editor.isEditable;
  const { hasTrigger, fileName, fileSize, fileExt, fileType, url, error } = node.attrs;
  const [loading, toggleLoading] = useToggle(false);
  const [visible, toggleVisible] = useToggle(false);
  const [showProgress, toggleShowProgress] = useToggle(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const selectFile = useCallback(() => {
    if (!isEditable || url) return;
    isEditable && $upload.current.click();
  }, [isEditable, url]);

  const handleFile = useCallback(
    async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const fileInfo = {
        fileName: extractFilename(file.name),
        fileSize: file.size,
        fileType: file.type,
        fileExt: extractFileExtension(file.name),
      };
      toggleLoading(true);

      if (file.size > FILE_CHUNK_SIZE) {
        toggleShowProgress(true);
      }

      try {
        const url = await uploadFile(file, setUploadProgress, () => {
          Toast.info('文件较大，文件将在后台进行上传处理，您可继续其他操作');
        });
        updateAttributes({ ...fileInfo, url });
        toggleLoading(false);
        setUploadProgress(0);
        toggleShowProgress(false);
      } catch (error) {
        updateAttributes({ error: '文件上传失败：' + (error && error.message) || '未知错误' });
        toggleLoading(false);
        setUploadProgress(0);
        toggleShowProgress(false);
        $upload.current.value = '';
      }
    },
    [toggleLoading, toggleShowProgress, updateAttributes]
  );

  useEffect(() => {
    if (!url && !hasTrigger) {
      selectFile();
      updateAttributes({ hasTrigger: true });
    }
  }, [url, hasTrigger, selectFile, updateAttributes]);

  const content = (() => {
    if (isEditable && !url) {
      return (
        <div className={cls(styles.wrap, 'render-wrapper')}>
          <Spin spinning={loading}>
            <Text style={{ cursor: 'pointer' }} onClick={selectFile}>
              {loading ? (
                showProgress ? (
                  <Progress
                    percent={uploadProgress}
                    showInfo
                    style={{
                      margin: '10px 0',
                    }}
                  />
                ) : (
                  '正在上传中'
                )
              ) : (
                '请选择文件'
              )}
            </Text>
            <input ref={$upload} type="file" hidden onChange={handleFile} />
          </Spin>
        </div>
      );
    }

    if (url) {
      return (
        <div className={cls(styles.wrap, visible && styles.isPreviewing, 'render-wrapper')} onClick={selectFile}>
          <div>
            <Space>
              {getFileTypeIcon(fileType)}
              <Text
                style={{ marginLeft: 8 }}
                ellipsis={{
                  showTooltip: { opts: { content: `${fileName}.${fileExt}`, style: { wordBreak: 'break-all' } } },
                }}
              >
                {fileName}.{fileExt}
                <Text type="tertiary">({normalizeFileSize(fileSize)})</Text>
              </Text>
            </Space>
            <span>
              <Tooltip content={!visible ? '预览' : '收起'}>
                <Button
                  theme={'borderless'}
                  type="tertiary"
                  icon={!visible ? <IconPlayCircle /> : <IconClose />}
                  onClick={toggleVisible}
                />
              </Tooltip>
              <Tooltip content="下载">
                <Button
                  theme={'borderless'}
                  type="tertiary"
                  icon={<IconDownload />}
                  onClick={() => download(url, name)}
                />
              </Tooltip>
            </span>
          </div>
          {url ? (
            <Collapsible isOpen={visible}>
              <Player fileType={fileType} url={url} />
            </Collapsible>
          ) : null}
        </div>
      );
    }

    if (error !== 'null') {
      return (
        <div className={cls(styles.wrap, 'render-wrapper')} onClick={selectFile}>
          <Space>
            <Text>{error}</Text>
          </Space>
        </div>
      );
    }
  })();

  return <NodeViewWrapper>{content}</NodeViewWrapper>;
};
