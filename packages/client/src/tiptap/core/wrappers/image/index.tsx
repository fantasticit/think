import { useCallback, useEffect, useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Button, Spin, Typography } from '@douyinfe/semi-ui';

import { NodeViewWrapper } from '@tiptap/react';
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from 'tiptap/core/menus/mind/constant';
import {
  clamp,
  extractFileExtension,
  extractFilename,
  getEditorContainerDOMSize,
  getImageWidthHeight,
} from 'tiptap/prose-utils';

import { IconZoomIn, IconZoomOut } from 'components/icons';
import { Resizeable } from 'components/resizeable';
import { Tooltip } from 'components/tooltip';
import { useToggle } from 'hooks/use-toggle';
import { uploadFile } from 'services/file';

import styles from './index.module.scss';

const { Text } = Typography;

export const ImageWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const { hasTrigger, error, src, alt, title, width, height, textAlign } = node.attrs;
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const $upload = useRef<HTMLInputElement>();
  const [loading, toggleLoading] = useToggle(false);
  const [zoom, setZoomState] = useState(100);

  const onResize = useCallback(
    (size) => {
      updateAttributes({ height: size.height, width: size.width });
    },
    [updateAttributes]
  );

  const selectFile = useCallback(() => {
    if (!isEditable || error || src) return;
    isEditable && $upload.current.click();
  }, [isEditable, error, src]);

  const handleFile = useCallback(
    async (e) => {
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
        const size = await getImageWidthHeight(src);
        updateAttributes({ ...fileInfo, ...size, src });
        toggleLoading(false);
      } catch (error) {
        updateAttributes({ error: '图片上传失败：' + (error && error.message) || '未知错误' });
        toggleLoading(false);
      }
    },
    [updateAttributes, toggleLoading]
  );

  const setZoom = useCallback((type: 'minus' | 'plus') => {
    return () => {
      setZoomState((currentZoom) =>
        clamp(type === 'minus' ? currentZoom - ZOOM_STEP : currentZoom + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM)
      );
    };
  }, []);

  useEffect(() => {
    if (!src && !hasTrigger) {
      selectFile();
      updateAttributes({ hasTrigger: true });
    }
  }, [src, hasTrigger, selectFile, updateAttributes]);

  return (
    <NodeViewWrapper style={{ textAlign, fontSize: 0, maxWidth: '100%' }}>
      <Resizeable
        className={'render-wrapper'}
        width={width || maxWidth}
        height={height}
        maxWidth={maxWidth}
        isEditable={isEditable}
        onChangeEnd={onResize}
      >
        {error ? (
          <div className={styles.wrap}>
            <Text>{error}</Text>
          </div>
        ) : !src ? (
          <div className={styles.wrap} onClick={selectFile}>
            <Spin spinning={loading}>
              <Text style={{ cursor: 'pointer' }}>{loading ? '正在上传中' : '请选择图片'}</Text>
              <input ref={$upload} accept="image/*" type="file" hidden onChange={handleFile} />
            </Spin>
          </div>
        ) : (
          <div className={styles.wrap}>
            <div
              style={{
                height: '100%',
                maxHeight: '100%',
                padding: 24,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: `scale(${zoom / 100})`,
                transition: `all ease-in-out .3s`,
              }}
            >
              <LazyLoadImage src={src} alt={alt} width={'100%'} height={'100%'} />
            </div>

            <div className={styles.handlerWrap}>
              <Tooltip content="缩小">
                <Button
                  size="small"
                  theme="borderless"
                  type="tertiary"
                  icon={<IconZoomOut />}
                  onClick={setZoom('minus')}
                />
              </Tooltip>
              <Tooltip content="放大">
                <Button
                  size="small"
                  theme="borderless"
                  type="tertiary"
                  icon={<IconZoomIn />}
                  onClick={setZoom('plus')}
                />
              </Tooltip>
            </div>
          </div>
        )}
      </Resizeable>
    </NodeViewWrapper>
  );
};
