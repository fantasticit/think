import { Space, Spin, Typography } from '@douyinfe/semi-ui';
import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { IconMind } from 'components/icons';
import { Resizeable } from 'components/resizeable';
import deepEqual from 'deep-equal';
import { useToggle } from 'hooks/use-toggle';
import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Excalidraw } from 'tiptap/core/extensions/excalidraw';
import { getEditorContainerDOMSize } from 'tiptap/prose-utils';

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

  useEffect(() => {
    import('@excalidraw/excalidraw')
      .then((res) => {
        exportToSvgRef.current = res.exportToSvg;
      })
      .catch(setError)
      .finally(() => toggleLoading(false));
  }, [toggleLoading, data]);

  useEffect(() => {
    const setContent = async () => {
      if (loading || error || !visible || !data) return;

      const svg: SVGElement = await exportToSvgRef.current(data);

      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('display', 'block');

      setSvg(svg);
    };
    setContent();
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
