import { Space, Spin, Typography } from '@douyinfe/semi-ui';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { IconMind } from 'components/icons';
import { Resizeable } from 'components/resizeable';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useRef, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Columns } from 'tiptap/core/extensions/columns';
import { getEditorContainerDOMSize } from 'tiptap/prose-utils';

import styles from './index.module.scss';

const { Text } = Typography;

const INHERIT_SIZE_STYLE = { width: '100%', height: '100%', maxWidth: '100%' };

export const ColumnsWrapper = ({ editor, node, updateAttributes }) => {
  const exportToSvgRef = useRef(null);
  const isEditable = editor.isEditable;
  const isActive = editor.isActive(Columns.name);
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
    <NodeViewWrapper>
      <NodeViewContent className={cls(styles.wrap, 'render-wrap')} />
    </NodeViewWrapper>
  );
};
