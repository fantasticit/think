import { Typography } from '@douyinfe/semi-ui';
import { ImageViewer } from 'components/image-viewer';
import React, { useMemo, useRef } from 'react';
import {
  extractFileExtension,
  extractFilename,
  FileType,
  normalizeFileSize,
  normalizeFileType,
} from 'tiptap/prose-utils';

import styles from './index.module.scss';
import { PDFPlayer } from './pdf-player';

interface IProps {
  url: string;
  fileType: string;
}

const { Text } = Typography;

export const Player: React.FC<IProps> = ({ url, fileType }) => {
  const ref = useRef();
  const type = useMemo(() => normalizeFileType(fileType), [fileType]);

  const player = useMemo(() => {
    if (type === 'video') return <video controls autoPlay src={url}></video>;

    if (type === 'audio') return <audio controls autoPlay src={url}></audio>;

    if (type === 'image')
      return <img style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: 300 }} src={url} />;

    if (type === 'pdf') return <PDFPlayer url={url} />;

    return <Text type="tertiary">暂不支持预览该类型文件</Text>;
  }, [type, url]);

  return (
    <>
      <div ref={ref} className={styles.playerWrap}>
        {player}
      </div>
      <ImageViewer container={ref.current} />
    </>
  );
};
