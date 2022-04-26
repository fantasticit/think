import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Spin, Button, Typography } from '@douyinfe/semi-ui';
import { IconMinus, IconPlus, IconAlignCenter } from '@douyinfe/semi-icons';
import deepEqual from 'deep-equal';
import { Resizeable } from 'components/resizeable';
import { Tooltip } from 'components/tooltip';
import { useToggle } from 'hooks/use-toggle';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from '../../menus/mind/constant';
import { clamp } from '../../utils/clamp';
import { Mind } from '../../extensions/mind';
import { loadKityMinder } from './kityminder';
import styles from './index.module.scss';

const { Text } = Typography;

export const MindWrapper = ({ editor, node, updateAttributes }) => {
  const $container = useRef();
  const $mind = useRef<any>();
  const isMindActive = editor.isActive(Mind.name);
  const isEditable = editor.isEditable;
  const { data, template, theme, zoom, callCenterCount, width, height } = node.attrs;
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

  const setCenter = useCallback(() => {
    const minder = $mind.current;
    if (!minder) return;
    minder.execCommand('camera');
  }, []);

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
      };
    },
    [editor, zoom]
  );

  const saveData = useCallback(() => {
    const minder = $mind.current;
    if (!minder) return;
    updateAttributes({ data: minder.exportJson() });
  }, [updateAttributes]);

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
        minder.disable();
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

  // 缩放
  useEffect(() => {
    const minder = $mind.current;
    if (!minder) return;
    minder.execCommand('zoom', parseInt(zoom));
  }, [zoom]);

  // 启用/禁用
  useEffect(() => {
    const minder = $mind.current;
    if (!minder) return;

    if (isEditable) {
      minder.enable();
    } else {
      minder.disable();
    }
  }, [isEditable]);

  // 居中
  useEffect(() => {
    setCenter();
  }, [callCenterCount]);

  return (
    <NodeViewWrapper className={cls(styles.wrap, isMindActive && styles.isActive)}>
      {isEditable ? (
        <Resizeable width={width} height={height} onChangeEnd={onResize}>
          {content}
        </Resizeable>
      ) : (
        <div style={{ display: 'inline-block', width, height, maxWidth: '100%' }}>{content}</div>
      )}

      {!isEditable && (
        <div className={styles.mindHandlerWrap}>
          <Tooltip content="缩小">
            <Button
              size="small"
              theme="borderless"
              type="tertiary"
              icon={<IconMinus style={{ fontSize: 14 }} />}
              onClick={setZoom('minus')}
            />
          </Tooltip>
          <Tooltip content="放大">
            <Button
              size="small"
              theme="borderless"
              type="tertiary"
              icon={<IconPlus style={{ fontSize: 14 }} />}
              onClick={setZoom('plus')}
            />
          </Tooltip>
          <Tooltip content="居中">
            <Button
              size="small"
              theme="borderless"
              type="tertiary"
              icon={<IconAlignCenter style={{ fontSize: 14 }} />}
              onClick={setCenter}
            />
          </Tooltip>
        </div>
      )}
    </NodeViewWrapper>
  );
};
