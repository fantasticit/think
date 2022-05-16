import { Button, Space } from '@douyinfe/semi-ui';
import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { IconMindCenter, IconZoomIn, IconZoomOut } from 'components/icons';
import { Resizeable } from 'components/resizeable';
import { convertColorToRGBA } from 'helpers/color';
import { Theme, useTheme } from 'hooks/use-theme';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flow } from 'tiptap/core/extensions/flow';
import { getEditorContainerDOMSize } from 'tiptap/prose-utils';

import styles from './index.module.scss';

const INHERIT_SIZE_STYLE = { width: '100%', height: '100%', maxWidth: '100%', overflow: 'hidden' };
const ICON_STYLE = { fontSize: '0.85em' };

export const FlowWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const isActive = editor.isActive(Flow.name);
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { data, width, height } = node.attrs;
  const { theme } = useTheme();
  const $viewer = useRef(null);
  const $container = useRef<HTMLElement>();
  const [bgColor, setBgColor] = useState('var(--semi-color-fill-0)');
  const bgColorOpacity = useMemo(() => {
    if (!bgColor) return bgColor;
    if (theme === Theme.dark) return convertColorToRGBA(bgColor, 0.85);
    return bgColor;
  }, [bgColor, theme]);

  const graphData = useMemo(() => {
    if (!data) return null;
    const content = data.replace(/<!--.*?-->/gs, '').trim();
    const config = JSON.stringify({
      'lightbox': false,
      'nav': false,
      'resize': true,
      'xml': content,
      'zoom': 1,
      'auto-fit': true,
      'allow-zoom-in': true,
      'allow-zoom-out': true,
      'forceCenter': true,
    });
    return config;
  }, [data]);

  const center = useCallback(() => {
    const graph = $viewer.current && $viewer.current.graph;
    if (!graph) return;
    graph.fit();
    graph.center(true, false);
  }, []);

  const zoomOut = useCallback(() => {
    const graph = $viewer.current && $viewer.current.graph;
    if (!graph) return;
    graph.zoomOut();
  }, []);

  const zoomIn = useCallback(() => {
    const graph = $viewer.current && $viewer.current.graph;
    if (!graph) return;
    graph.zoomIn();
  }, []);

  const onResize = useCallback(
    (size) => {
      updateAttributes({ width: size.width, height: size.height });
    },
    [updateAttributes]
  );

  const render = useCallback((div) => {
    if (!div) return;

    // @ts-ignore
    const DrawioViewer = window.GraphViewer;
    if (DrawioViewer) {
      div.innerHTML = '';
      DrawioViewer.createViewerForElement(div, (viewer) => {
        $viewer.current = viewer;
        const background = viewer?.graph?.background;
        background && setBgColor(background);
      });
    }
  }, []);

  const setMxgraph = useCallback(
    (div) => {
      $container.current = div;
      render(div);
    },
    [render]
  );

  useEffect(() => {
    render($container.current);
  }, [graphData, render]);

  return (
    <NodeViewWrapper className={cls(styles.wrap, isActive && styles.isActive)}>
      <Resizeable
        style={{ overflow: 'hidden' }}
        isEditable={isEditable}
        width={width}
        height={height}
        maxWidth={maxWidth}
        onChangeEnd={onResize}
      >
        <div
          className={cls(styles.renderWrap, 'render-wrapper')}
          style={{ ...INHERIT_SIZE_STYLE, backgroundColor: bgColorOpacity }}
        >
          {graphData && (
            <div
              className="mxgraph"
              style={{ width: maxWidth, height }}
              ref={setMxgraph}
              data-mxgraph={graphData}
            ></div>
          )}
        </div>

        <div className={styles.toolbarWrap}>
          <Space spacing={2}>
            <Button
              type="tertiary"
              theme="borderless"
              size="small"
              onClick={center}
              icon={<IconMindCenter style={ICON_STYLE} />}
            />

            <Button
              type="tertiary"
              theme="borderless"
              size="small"
              onClick={zoomOut}
              icon={<IconZoomOut style={ICON_STYLE} />}
            />

            <Button
              type="tertiary"
              theme="borderless"
              size="small"
              onClick={zoomIn}
              icon={<IconZoomIn style={ICON_STYLE} />}
            />
          </Space>
        </div>
      </Resizeable>
    </NodeViewWrapper>
  );
};
