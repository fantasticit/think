import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Spin, Typography } from '@douyinfe/semi-ui';
import deepEqual from 'deep-equal';
import { Resizeable } from 'components/resizeable';
import { useToggle } from 'hooks/use-toggle';
import { clamp } from '../../utils/clamp';
import { Mind } from '../../extensions/mind';
import { loadKityMinder } from './kityminder';
import { Toolbar } from './toolbar';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from './toolbar/constant';
import styles from './index.module.scss';

const { Text } = Typography;

export const MindWrapper = ({ editor, node, updateAttributes }) => {
  const $container = useRef();
  const $mind = useRef<any>();
  const isMindActive = editor.isActive(Mind.name);
  const isEditable = editor.isEditable;
  const { data, template, theme, zoom, width, height } = node.attrs;
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState<Error | null>(null);

  const content = useMemo(() => {
    if (error) {
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <Text>{error.message || error}</Text>
        </div>
      );
    }

    if (loading) {
      return <Spin spinning={loading} style={{ width: '100%', height: '100%' }}></Spin>;
    }

    return (
      <div
        ref={$container}
        className={cls(styles.renderWrap, 'render-wrapper')}
        tabIndex={0}
        style={{ width: '100%', height: '100%' }}
      ></div>
    );
  }, [loading, error]);

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
    <NodeViewWrapper className={cls(styles.wrap, isMindActive && styles.isActive)}>
      {isEditable ? (
        <Resizeable width={width} height={height} onChangeEnd={onResize}>
          {content}
        </Resizeable>
      ) : (
        <div style={{ display: 'inline-block', width, height, maxWidth: '100%' }}>{content}</div>
      )}
      <div className={styles.toolbarWrap}>
        <Toolbar
          isEditable={isEditable}
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
