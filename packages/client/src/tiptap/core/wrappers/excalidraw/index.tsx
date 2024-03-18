import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import { Button, Space, Spin, Typography } from '@douyinfe/semi-ui';

import { NodeViewWrapper } from '@tiptap/react';
import { Excalidraw } from 'tiptap/core/extensions/excalidraw';
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from 'tiptap/core/menus/mind/constant';
import { clamp, getEditorContainerDOMSize } from 'tiptap/prose-utils';

import cls from 'classnames';
import { IconMind, IconZoomIn, IconZoomOut } from 'components/icons';
import { Resizeable } from 'components/resizeable';
import { Tooltip } from 'components/tooltip';
import deepEqual from 'deep-equal';
import { useToggle } from 'hooks/use-toggle';

import styles from './index.module.scss';

const { Text } = Typography;

const INHERIT_SIZE_STYLE = { width: '100%', height: '100%', maxWidth: '100%' };

export const _ExcalidrawWrapper = ({ editor, node, updateAttributes }) => {
  const exportToSvgRef = useRef(null);
  const isEditable = editor.isEditable;
  const isActive = editor.isActive(Excalidraw.name);
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { data, width, height } = node.attrs;
  const [Svg, setSvg] = useState<SVGElement | null>(null);
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState<Error | null>(null);
  const [visible, toggleVisible] = useToggle(false);
  const [zoom, setZoomState] = useState(100);

  const onResize = useCallback(
    (size) => {
      updateAttributes({ width: size.width, height: size.height });
    },
    [updateAttributes]
  );

  const onViewportChange = useCallback(
    (visible) => {
      if (visible) {
        toggleVisible(true);
      }
    },
    [toggleVisible]
  );

  const setZoom = useCallback((type: 'minus' | 'plus') => {
    return () => {
      setZoomState((currentZoom) =>
        clamp(type === 'minus' ? currentZoom - ZOOM_STEP : currentZoom + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM)
      );
    };
  }, []);

  useEffect(() => {
    let isUnmount = false;

    import('@excalidraw/excalidraw')
      .then((res) => {
        if (!isUnmount) {
          exportToSvgRef.current = res.exportToSvg;
        }
      })
      .catch((err) => !isUnmount && setError(err))
      .finally(() => !isUnmount && toggleLoading(false));

    return () => {
      isUnmount = true;
    };
  }, [toggleLoading, data]);

  useEffect(() => {
    let isUnmount = false;

    const setContent = async () => {
      if (isUnmount || loading || error || !visible || !data) return;

      const svg: SVGElement = await exportToSvgRef.current(data);

      if (isUnmount) return;

      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('display', 'block');

      setSvg(svg);
    };

    setContent();

    return () => {
      isUnmount = true;
    };
  }, [data, loading, error, visible]);

  return (
    <NodeViewWrapper className={cls(styles.wrap, isActive && styles.isActive)}>
      <VisibilitySensor onChange={onViewportChange}>
        <Resizeable isEditable={isEditable} width={width} height={height} maxWidth={maxWidth} onChangeEnd={onResize}>
          <div
            className={cls(styles.renderWrap, 'render-wrapper')}
            style={{ ...INHERIT_SIZE_STYLE, overflow: 'hidden' }}
          >
            {error && (
              <div style={INHERIT_SIZE_STYLE}>
                <Text>{error.message || error}</Text>
              </div>
            )}

            {loading && <Spin spinning style={INHERIT_SIZE_STYLE}></Spin>}

            {!loading && !error && visible && (
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
                dangerouslySetInnerHTML={{ __html: Svg?.outerHTML ?? '' }}
              />
            )}

            <div className={styles.title}>
              <Space>
                <span className={styles.icon}>
                  <IconMind />
                </span>
                绘图
              </Space>
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
        </Resizeable>
      </VisibilitySensor>
    </NodeViewWrapper>
  );
};

export const ExcalidrawWrapper = React.memo(_ExcalidrawWrapper, (prevProps, nextProps) => {
  if (deepEqual(prevProps.node.attrs, nextProps.node.attrs)) {
    return true;
  }

  return false;
});
