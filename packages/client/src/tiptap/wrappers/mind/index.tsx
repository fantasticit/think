import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Spin, Typography } from '@douyinfe/semi-ui';
import deepEqual from 'deep-equal';
import { Resizeable } from 'components/resizeable';
import { useToggle } from 'hooks/use-toggle';
import { clamp, getEditorContainerDOMSize } from 'tiptap/prose-utils';
import { Mind } from 'tiptap/extensions/mind';
import { loadKityMinder } from './kityminder';
import { Toolbar } from './toolbar';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from './toolbar/constant';
import styles from './index.module.scss';

const { Text } = Typography;

const INHERIT_SIZE_STYLE = { width: '100%', height: '100%' };

export const MindWrapper = ({ editor, node, updateAttributes }) => {
  const $container = useRef();
  const $mind = useRef<any>();
  const isEditable = editor.isEditable;
  const isActive = editor.isActive(Mind.name);
  const { width: maxWidth } = getEditorContainerDOMSize(editor);
  const { data, template, theme, zoom, width, height } = node.attrs;
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
        className={cls(styles.renderWrap, 'render-wrapper')}
        tabIndex={0}
        style={INHERIT_SIZE_STYLE}
      ></div>
    );
  }, [loading, error, width, height]);

  const onResize = useCallback(
    (size) => {
      updateAttributes({ width: size.width, height: size.height });
      setCenter();
    },
    [updateAttributes]
  );

  const setZoom = useCallback(
    (type: 'minus' | 'plus') => {
      return () => {
        const minder = $mind.current;
        if (!minder) return;
        const currentZoom = minder.getZoomValue();
        const nextZoom = clamp(
          type === 'minus' ? currentZoom - ZOOM_STEP : currentZoom + ZOOM_STEP,
          MIN_ZOOM,
          MAX_ZOOM
        );
        minder.execCommand('zoom', nextZoom);
        isEditable && updateAttributes({ zoom: nextZoom });
      };
    },
    [editor, zoom, isEditable, updateAttributes]
  );

  const setCenter = useCallback(() => {
    const minder = $mind.current;
    if (!minder) return;
    minder.execCommand('camera');
  }, []);

  // 布局
  const setTemplate = useCallback(
    (template) => {
      const minder = $mind.current;
      if (!minder) return;
      minder.execCommand('template', template);
      isEditable && updateAttributes({ template });
    },
    [updateAttributes, isEditable]
  );

  // 主题
  const setTheme = useCallback(
    (theme) => {
      const minder = $mind.current;
      if (!minder) return;
      minder.execCommand('theme', theme);
      isEditable && updateAttributes({ theme });
    },
    [updateAttributes, isEditable]
  );

  const saveData = useCallback(() => {
    const minder = $mind.current;
    if (!minder) return;
    isEditable && updateAttributes({ data: minder.exportJson() });
  }, [updateAttributes, isEditable]);

  // 加载依赖
  useEffect(() => {
    loadKityMinder()
      .then(() => {
        toggleLoading(false);
      })
      .catch((e) => {
        setError(e);
      });
  }, []);

  // 初始化渲染
  useEffect(() => {
    if (loading || !$container.current) return;

    const onChange = () => {
      saveData();
    };

    try {
      const Editor = window.kityminder.Editor;
      const minder = new Editor($container.current).minder;
      minder.importJson(data);
      minder.execCommand('template', template);
      minder.execCommand('theme', theme);
      minder.execCommand('zoom', parseInt(zoom));

      if (!isEditable) {
        minder.preventEdit = true;
      } else {
        minder.preventEdit = false;
        minder.enable();
      }

      $mind.current = minder;
      minder.on('contentChange', onChange);
      toggleLoading(false);
    } catch (e) {
      setError(e);
    }

    return () => {
      if ($mind.current) {
        $mind.current.off('contentChange', onChange);
        $mind.current.destroy();
      }
    };
  }, [loading]);

  // 数据同步渲染
  useEffect(() => {
    const minder = $mind.current;
    if (!minder) return;

    const currentData = minder.exportJson();
    const isEqual = deepEqual(currentData, data);
    if (isEqual) return;
    // TODO: 也许刷新更好些
    minder.importJson(data);
  }, [data]);

  // 启用/禁用
  useEffect(() => {
    const minder = $mind.current;
    if (!minder) return;

    if (!isEditable) {
      minder.preventEdit = true;
    } else {
      minder.preventEdit = false;
      minder.enable();
    }
  }, [isEditable]);

  // 缩放
  useEffect(() => {
    const minder = $mind.current;
    if (!minder) return;
    minder.execCommand('zoom', parseInt(zoom));
  }, [zoom]);

  // 布局
  useEffect(() => {
    const minder = $mind.current;
    if (!minder) return;
    minder.execCommand('template', template);
  }, [template]);

  // 主题
  useEffect(() => {
    const minder = $mind.current;
    if (!minder) return;
    minder.execCommand('theme', theme);
  }, [theme]);

  return (
    <NodeViewWrapper className={cls(styles.wrap, isActive && styles.isActive)}>
      <Resizeable isEditable={isEditable} width={width} height={height} maxWidth={maxWidth} onChangeEnd={onResize}>
        {content}
      </Resizeable>
      <div className={styles.toolbarWrap}>
        <Toolbar
          isEditable={isEditable}
          maxHeight={height * 0.8}
          template={template}
          theme={theme}
          zoom={zoom}
          setZoomMinus={setZoom('minus')}
          setZoomPlus={setZoom('plus')}
          setCenter={setCenter}
          setTemplate={setTemplate}
          setTheme={setTheme}
        />
      </div>
    </NodeViewWrapper>
  );
};
