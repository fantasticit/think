import { useEffect, useRef } from 'react';
import cls from 'classnames';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Button, Typography, Spin, Collapsible, Space } from '@douyinfe/semi-ui';
import { IconDownload, IconPlayCircle, IconClose } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { useToggle } from 'hooks/use-toggle';
import { download } from '../../utils/download';
import { uploadFile } from 'services/file';
import { normalizeFileSize, extractFileExtension, extractFilename } from '../../utils/file';
import { Player } from './player';
import { getFileTypeIcon } from './file-icon';
import styles from './index.module.scss';

const { Text } = Typography;

export const AttachmentWrapper = ({ editor, node, updateAttributes }) => {
  const $upload = useRef<HTMLInputElement>();
  const isEditable = editor.isEditable;
  const { hasTrigger, fileName, fileSize, fileExt, fileType, url, error } = node.attrs;
  const [loading, toggleLoading] = useToggle(false);
  const [visible, toggleVisible] = useToggle(false);

  const selectFile = () => {
    if (!isEditable || url) return;
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
      updateAttributes({ error: '文件上传失败：' + (error && error.message) || '未知错误' });
      toggleLoading(false);
    }
  };

  useEffect(() => {
    if (!url && !hasTrigger) {
      selectFile();
      updateAttributes({ hasTrigger: true });
    }
  }, [url, hasTrigger]);

  const content = (() => {
    if (isEditable && !url) {
      return (
        <div className={cls(styles.wrap, 'render-wrapper')}>
          <Spin spinning={loading}>
            <Text style={{ cursor: 'pointer' }} onClick={selectFile}>
              {loading ? '正在上传中' : '请选择文件'}
            </Text>
            <input ref={$upload} type="file" hidden onChange={handleFile} />
          </Spin>
        </div>
      );
    }

    if (url) {
      return (
        <>
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
        </>
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

  return <NodeViewWrapper as="div">{content}</NodeViewWrapper>;
};
