import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import clone from 'clone';
import deepEqual from 'deep-equal';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Spin, Typography } from '@douyinfe/semi-ui';
import { Resizeable } from 'components/resizeable';
import { useToggle } from 'hooks/use-toggle';
import { getEditorContainerDOMSize, uuid } from 'tiptap/prose-utils';
import { Mind } from 'tiptap/extensions/mind';
import styles from './index.module.scss';

const { Text } = Typography;

const INHERIT_SIZE_STYLE = { width: '100%', height: '100%', maxWidth: '100%' };

export const MindWrapper = ({ editor, node, updateAttributes }) => {
  const $container = useRef<HTMLDivElement>();
  const $mind = useRef(null);
  const containerId = useRef(`js-mind-container-${uuid()}`);
  const isEditable = editor.isEditable;
  const isActive = editor.isActive(Mind.name);
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { data, width, height } = node.attrs;
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState<Error | null>(null);

  const content = useMemo(() => {
    if (error) {
      return (
        <div style={INHERIT_SIZE_STYLE}>
          <Text>{error.message || error}</Text>
        </div>
      );
    }

    if (loading) {
      return <Spin spinning={loading} style={INHERIT_SIZE_STYLE}></Spin>;
    }

    return (
      <div
        ref={$container}
        id={containerId.current}
        className={cls(styles.renderWrap, 'render-wrapper')}
        tabIndex={0}
        style={{ ...INHERIT_SIZE_STYLE, overflow: 'hidden' }}
      ></div>
    );
  }, [loading, error]);

  const onResize = useCallback(
    (size) => {
      updateAttributes({ width: size.width, height: size.height });
      setTimeout(() => {
        $mind.current && $mind.current.toCenter();
      });
    },
    [updateAttributes]
  );

  // 加载依赖
  useEffect(() => {
    import('./mind-elixir')
      .then((module) => {
        toggleLoading(false);
        window.MindElixir = module.default;
      })
      .catch((e) => {
        setError(e);
      });
  }, [toggleLoading]);

  // 初始化渲染
  useEffect(() => {
    const container = $container.current;
    if (loading || !container) return;

    const onChange = () => {
      updateAttributes({ data: mind.getAllData() });
    };

    let mind = null;

    let isEnter = false;
    const onMouseEnter = () => {
      isEnter = true;
    };
    const onMouseLeave = () => {
      isEnter = false;
    };

    container.addEventListener('onmouseenter', onMouseEnter);
    container.addEventListener('onMouseLeave', onMouseLeave);

    try {
      mind = new window.MindElixir({
        el: `#${containerId.current}`,
        direction: window.MindElixir.SIDE,
        data: clone(data),
        editable: editor.isEditable,
        contextMenu: editor.isEditable,
        keypress: editor.isEditable,
        nodeMenu: editor.isEditable,
        toolBar: true,
        draggable: false, // TODO: 需要修复
        locale: 'zh_CN',
      });
      mind.shouldPreventDefault = () => isEnter && editor.isActive('mind');
      mind.init();
      mind.bus.addListener('operation', onChange);
      $mind.current = mind;
      toggleLoading(false);
    } catch (e) {
      setError(e);
    }

    return () => {
      if (container) {
        container.removeEventListener('onmouseenter', onMouseEnter);
        container.removeEventListener('onMouseLeave', onMouseLeave);
      }

      if (mind) {
        mind.destroy();
      }
    };
    // data 的更新交给下方 effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, editor, updateAttributes, toggleLoading]);

  useEffect(() => {
    const mind = $mind.current;
    if (!mind) return;
    const newData = clone(data);
    if (!deepEqual(newData, mind.getAllData())) {
      mind.update(newData);
    }
  }, [data]);

  return (
    <NodeViewWrapper className={cls(styles.wrap, isActive && styles.isActive)}>
      <Resizeable isEditable={isEditable} width={width} height={height} maxWidth={maxWidth} onChangeEnd={onResize}>
        {content}
      </Resizeable>
    </NodeViewWrapper>
  );
};
