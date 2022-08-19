import { Button, Space, Spin, Typography } from '@douyinfe/semi-ui';
import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { IconMind, IconMindCenter, IconZoomIn, IconZoomOut } from 'components/icons';
import { Resizeable } from 'components/resizeable';
import { Tooltip } from 'components/tooltip';
import deepEqual from 'deep-equal';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { load, renderMind } from 'thirtypart/kityminder';
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from 'tiptap/core/menus/mind/constant';
import { clamp, getEditorContainerDOMSize } from 'tiptap/prose-utils';

import styles from './index.module.scss';

const { Text } = Typography;

const INHERIT_SIZE_STYLE = { width: '100%', height: '100%', maxWidth: '100%' };

export const _MindWrapper = ({ editor, node, updateAttributes }) => {
  const $mind = useRef(null);
  const isEditable = editor.isEditable;
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { data, width, height } = node.attrs;
  const [visible, toggleVisible] = useToggle(false);
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState<Error | null>(null);

  const setCenter = useCallback(() => {
    const mind = $mind.current;
    if (!mind) return;
    mind.execCommand('camera');
  }, []);

  const setZoom = useCallback((type: 'minus' | 'plus') => {
    return () => {
      const mind = $mind.current;
      if (!mind) return;
      const currentZoom = mind.getZoomValue();
      const nextZoom = clamp(type === 'minus' ? currentZoom - ZOOM_STEP : currentZoom + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
      mind.execCommand('zoom', nextZoom);
    };
  }, []);

  const onResize = useCallback(
    (size) => {
      updateAttributes({ width: size.width, height: size.height });
      setTimeout(() => {
        setCenter();
      });
    },
    [updateAttributes, setCenter]
  );

  const render = useCallback(
    (div) => {
      if (!div) return;

      if (!$mind.current) {
        const graph = renderMind({
          container: div,
          data,
          isEditable: false,
        });
        $mind.current = graph;
      }
    },
    [data]
  );

  const setMind = useCallback(
    (div) => {
      render(div);
    },
    [render]
  );

  const onViewportChange = useCallback(
    (visible) => {
      if (visible && !$mind.current) {
        toggleVisible(true);
      }
    },
    [toggleVisible]
  );

  useEffect(() => {
    load()
      .catch(setError)
      .finally(() => toggleLoading(false));
  }, [toggleLoading]);

  // 数据同步渲染
  useEffect(() => {
    const mind = $mind.current;
    if (!mind) return;
    const currentData = mind.exportJson();
    const isEqual = deepEqual(currentData, data);
    if (isEqual) return;
    mind.importJson(data);
  }, [data]);

  useEffect(() => {
    setCenter();
  }, [width, height, setCenter]);

  return (
    <NodeViewWrapper className={cls(styles.wrap)}>
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

            {!loading && !error && (
              <div style={{ height: '100%', maxHeight: '100%', overflow: 'hidden' }} ref={setMind}></div>
            )}

            <div className={styles.title}>
              <Space>
                <span className={styles.icon}>
                  <IconMind />
                </span>
                思维导图
              </Space>
            </div>

            <div className={styles.mindHandlerWrap}>
              <Tooltip content="居中">
                <Button size="small" theme="borderless" type="tertiary" icon={<IconMindCenter />} onClick={setCenter} />
              </Tooltip>
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

export const MindWrapper = React.memo(_MindWrapper, (prevProps, nextProps) => {
  if (deepEqual(prevProps.node.attrs, nextProps.node.attrs)) {
    return true;
  }

  return false;
});
