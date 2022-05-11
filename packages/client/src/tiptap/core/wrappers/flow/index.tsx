import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Resizeable } from 'components/resizeable';
import { getEditorContainerDOMSize } from 'tiptap/prose-utils';
import { Flow } from 'tiptap/core/extensions/flow';
import styles from './index.module.scss';

const INHERIT_SIZE_STYLE = { width: '100%', height: '100%', maxWidth: '100%', overflow: 'hidden', padding: '1rem' };

export const FlowWrapper = ({ editor, node, updateAttributes }) => {
  const isEditable = editor.isEditable;
  const isActive = editor.isActive(Flow.name);
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { data, width, height } = node.attrs;
  const $container = useRef<HTMLElement>();

  const graphData = useMemo(() => {
    const content = data.replace(/<!--.*?-->/gs, '').trim();
    const config = JSON.stringify({
      highlight: '#00afff',
      lightbox: false,
      nav: false,
      resize: true,
      xml: content,
      zoom: 0.8,
    });
    return config;
  }, [data]);

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
      DrawioViewer.createViewerForElement(div);
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
      <Resizeable isEditable={isEditable} width={width} height={height} maxWidth={maxWidth} onChangeEnd={onResize}>
        <div className={cls(styles.renderWrap, 'render-wrapper')} style={INHERIT_SIZE_STYLE}>
          <div className="mxgraph" ref={setMxgraph} data-mxgraph={graphData}></div>
        </div>
      </Resizeable>
    </NodeViewWrapper>
  );
};
