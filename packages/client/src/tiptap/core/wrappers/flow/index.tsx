import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { Button, Space } from '@douyinfe/semi-ui';
import { IconMindCenter, IconZoomOut, IconZoomIn } from 'components/icons';
import { useCallback, useEffect, useRef } from 'react';
import { Resizeable } from 'components/resizeable';
import { getEditorContainerDOMSize, uuid } from 'tiptap/prose-utils';
import { Flow } from 'tiptap/core/extensions/flow';
import { decode } from './decode';
import styles from './index.module.scss';

const INHERIT_SIZE_STYLE = { width: '100%', height: '100%', maxWidth: '100%' };

export const FlowWrapper = ({ editor, node, updateAttributes }) => {
  const $container = useRef<HTMLDivElement>();
  const $graph = useRef(null);
  const containerId = useRef(`js-flow-container-${uuid()}`);
  const isEditable = editor.isEditable;
  const isActive = editor.isActive(Flow.name);
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { data, width, height } = node.attrs;

  const center = useCallback(() => {
    const graph = $graph.current;
    if (!graph) return;
    graph.fit();
    graph.center(true, false);
  }, []);

  const zoomOut = useCallback(() => {
    const graph = $graph.current;
    if (!graph) return;
    graph.zoomOut();
  }, []);

  const zoomIn = useCallback(() => {
    const graph = $graph.current;
    if (!graph) return;
    graph.zoomIn();
  }, []);

  const onResize = useCallback(
    (size) => {
      updateAttributes({ width: size.width, height: size.height });
      setTimeout(() => {
        const graph = $graph.current;
        if (!graph) return;
        graph.fit();
        graph.center(true, false);
      }, 0);
    },
    [updateAttributes]
  );

  useEffect(() => {
    let graph = $graph.current;

    if (!graph) {
      // @ts-ignore
      graph = new mxGraph($container.current);
      graph.resetViewOnRootChange = false;
      graph.foldingEnabled = false;
      graph.setTooltips(false);
      graph.setEnabled(false);
      graph.centerZoom = true;
      $graph.current = graph;
    }

    const text = decode(data);
    // @ts-ignore
    const xmlDoc = mxUtils.parseXml(text);
    // @ts-ignore
    const codec = new mxCodec(xmlDoc);
    codec.decode(codec.document.documentElement, graph.getModel());
    setTimeout(() => {
      graph.fit();
      graph.center(true, false);
    }, 0);
  }, [data]);

  return (
    <NodeViewWrapper className={cls(styles.wrap, isActive && styles.isActive)}>
      <Resizeable isEditable={isEditable} width={width} height={height} maxWidth={maxWidth} onChangeEnd={onResize}>
        <div
          ref={$container}
          id={containerId.current}
          className={cls(styles.renderWrap, 'render-wrapper')}
          style={{ ...INHERIT_SIZE_STYLE, overflow: 'hidden' }}
        ></div>
        <div className={styles.toolbarWrap}>
          <Space spacing={2}>
            <Button
              type="tertiary"
              theme="borderless"
              size="small"
              onClick={center}
              icon={<IconMindCenter style={{ fontSize: '0.85em' }} />}
            />

            <Button
              type="tertiary"
              theme="borderless"
              size="small"
              onClick={zoomOut}
              icon={<IconZoomOut style={{ fontSize: '0.85em' }} />}
            />

            <Button
              type="tertiary"
              theme="borderless"
              size="small"
              onClick={zoomIn}
              icon={<IconZoomIn style={{ fontSize: '0.85em' }} />}
            />
          </Space>
        </div>
      </Resizeable>
    </NodeViewWrapper>
  );
};
