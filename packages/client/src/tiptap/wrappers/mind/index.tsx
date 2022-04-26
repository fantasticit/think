import { NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconMinus, IconPlus } from '@douyinfe/semi-icons';
import { Resizeable } from 'components/resizeable';
import deepEqual from 'deep-equal';
import { useToggle } from 'hooks/use-toggle';
import { Mind } from '../../extensions/mind';
import { loadKityMinder } from './kityminder';
import styles from './index.module.scss';

export const MindWrapper = ({ editor, node, updateAttributes }) => {
  const $container = useRef();
  const $mind = useRef<any>();
  const isMindActive = editor.isActive(Mind.name);
  const isEditable = editor.isEditable;
  const { data, width, height = 100 } = node.attrs;
  const [loading, toggleLoading] = useToggle(true);

  const onResize = useCallback(
    (size) => {
      updateAttributes({ width: size.width, height: size.height });
    },
    [updateAttributes]
  );

  const saveData = useCallback(() => {
    const minder = $mind.current;
    if (!minder) return;
    updateAttributes({ data: minder.exportJson() });
  }, [updateAttributes]);

  // 初始化
  useEffect(() => {
    const onChange = () => {
      saveData();
    };
    loadKityMinder().then((Editor) => {
      toggleLoading(false);
      const minder = new Editor($container.current).minder;
      minder.importJson(data);
      $mind.current = minder;
      minder.on('contentChange', onChange);
      // @ts-ignore
      window.minder = minder;
    });

    return () => {
      if ($mind.current) {
        $mind.current.off('contentChange', onChange);
      }
    };
  }, [toggleLoading]);

  // 数据同步渲染
  useEffect(() => {
    const minder = $mind.current;
    if (!minder) return;
    const currentData = minder.exportJson();
    const isEqual = deepEqual(currentData, data);
    if (isEqual) return;
    minder.importData(data);
  }, [data]);

  // 启用/禁用
  useEffect(() => {
    const minder = $mind.current;
    if (!minder) return;
  }, [isEditable]);

  const content = (
    <div
      ref={$container}
      className={cls(styles.renderWrap, 'render-wrapper')}
      tabIndex={0}
      style={{ width: '100%', height: '100%' }}
    ></div>
  );

  return (
    <NodeViewWrapper className={cls(styles.wrap, isMindActive && styles.isActive)}>
      {isEditable ? (
        <Resizeable width={width} height={height} onChange={onResize}>
          {content}
        </Resizeable>
      ) : (
        <div style={{ display: 'inline-block', width, height, maxWidth: '100%' }}>{content}</div>
      )}
    </NodeViewWrapper>
  );
};
