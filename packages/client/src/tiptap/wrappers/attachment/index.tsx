import { useEffect, useRef } from 'react';
import cls from 'classnames';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Button, Typography, Spin, Collapsible, Space } from '@douyinfe/semi-ui';
import {
  IconDownload,
  IconPlayCircle,
  IconFile,
  IconSong,
  IconVideo,
  IconImage,
  IconClose,
} from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { useToggle } from 'hooks/use-toggle';
import { download } from '../../services/download';
import { uploadFile } from 'services/file';
import {
  normalizeFileSize,
  extractFileExtension,
  extractFilename,
  normalizeFileType,
  FileType,
} from '../../services/file';
import styles from './index.module.scss';

const { Text } = Typography;

const getFileTypeIcon = (type: FileType) => {
  switch (type) {
    case 'audio':
      return <IconSong />;

    case 'video':
      return <IconVideo />;

    case 'file':
      return <IconFile />;

    case 'image':
      return <IconImage />;

    default: {
      const value: never = type;
      throw new Error(value);
    }
  }
};

export const AttachmentWrapper = ({ editor, node, updateAttributes }) => {
  const $upload = useRef<HTMLInputElement>();
  const isEditable = editor.isEditable;
  const { hasTrigger, fileName, fileSize, fileExt, fileType, url, error } = node.attrs;
  const [loading, toggleLoading] = useToggle(false);
  const [visible, toggleVisible] = useToggle(false);

  const selectFile = () => {
    if (!isEditable || error || url) return;
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

  const type = normalizeFileType(fileType);

  useEffect(() => {
    if (!url && !hasTrigger) {
      selectFile();
      updateAttributes({ hasTrigger: true });
    }
  }, [url, hasTrigger]);

  const content = (() => {
    if (error) {
      return (
        <div className={cls(styles.wrap, 'render-wrapper')} onClick={selectFile}>
          <Text>{error}</Text>
        </div>
      );
    }

    if (url) {
      return (
        <>
          <div className={cls(styles.wrap, 'render-wrapper')} onClick={selectFile}>
            <Space>
              {getFileTypeIcon(type)}
              <Text ellipsis={{ showTooltip: true }} style={{ maxWidth: 320 }}>
                {fileName}.{fileExt}
              </Text>
              <Text type="tertiary"> ({normalizeFileSize(fileSize)})</Text>
            </Space>
            <span>
              {type === 'video' || type === 'audio' ? (
                <Tooltip content={!visible ? '播放' : '收起'}>
                  <Button
                    theme={'borderless'}
                    type="tertiary"
                    icon={!visible ? <IconPlayCircle /> : <IconClose />}
                    onClick={toggleVisible}
                  />
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
          </div>

          {url ? (
            <Collapsible isOpen={visible}>
              {type === 'video' && <video controls autoPlay src={url}></video>}
              {type === 'audio' && <audio controls autoPlay src={url}></audio>}
            </Collapsible>
          ) : null}
        </>
      );
    }

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
  })();

  return (
    <NodeViewWrapper as="div">
      {content} <NodeViewContent />
    </NodeViewWrapper>
  );
};
