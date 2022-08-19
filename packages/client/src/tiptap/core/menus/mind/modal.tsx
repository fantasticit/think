import { Modal, Spin, Typography } from '@douyinfe/semi-ui';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useState } from 'react';
import { load, renderMind } from 'thirtypart/kityminder';
import { Editor } from 'tiptap/core';

import { cancelSubject, OPEN_MIND_SETTING_MODAL, subject } from '../_event';
import styles from './style.module.scss';
import { Toolbar } from './toolbar';

type IProps = { editor: Editor };

const { Text } = Typography;

export const MindSettingModal: React.FC<IProps> = ({ editor }) => {
  const [mind, setMind] = useState(null);
  const [initialData, setInitialData] = useState({});
  const [visible, toggleVisible] = useToggle(false);
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState(null);

  const renderMindEditor = useCallback(
    (div) => {
      if (!div) return;

      const mindInstance = renderMind({
        container: div,
        data: initialData,
        isEditable: true,
      });

      setMind(mindInstance);
    },
    [initialData]
  );

  useEffect(() => {
    load()
      .catch(setError)
      .finally(() => toggleLoading(false));
  }, [toggleLoading]);

  const save = useCallback(() => {
    if (!mind) {
      toggleVisible(false);
      return;
    }
    const data = mind.exportJson();
    /**
     * FIXME: 百度脑图更新后会滚动 dom 到顶点，原因未知，在此 hack 修复下！
     */
    const currentScrollTop = document.querySelector('main#js-tocs-container')?.scrollTop;
    editor.chain().focus().setMind({ data }).run();
    setTimeout(() => {
      document.querySelector('main#js-tocs-container').scrollTop = currentScrollTop;
    });
    toggleVisible(false);
  }, [editor, toggleVisible, mind]);

  useEffect(() => {
    const handler = (data) => {
      toggleVisible(true);
      if (data) {
        setInitialData(data.data);
      }
    };

    subject(editor, OPEN_MIND_SETTING_MODAL, handler);

    return () => {
      cancelSubject(editor, OPEN_MIND_SETTING_MODAL, handler);
    };
  }, [editor, toggleVisible]);

  useEffect(() => {
    if (!visible && mind) {
      mind.destroy();
    }
  }, [visible, mind]);

  return (
    <Modal
      centered
      title="思维导图"
      fullScreen
      visible={visible}
      onCancel={toggleVisible}
      onOk={save}
      okText="保存"
      cancelText="退出"
      motion={false}
    >
      <div
        style={{
          position: 'relative',
          height: 'calc(100vh - 152px)',
          margin: '0 -24px',
          border: '1px solid var(--semi-color-border)',
        }}
      >
        {loading && (
          <Spin spinning>
            {/* FIXME: semi-design 的问题，不加 div，文字会换行! */}
            <div></div>
          </Spin>
        )}
        {error && <Text>{(error && error.message) || '未知错误'}</Text>}
        <div style={{ height: '100%', maxHeight: '100%', overflow: 'hidden' }} ref={renderMindEditor}></div>

        <div className={styles.toolbarWrap}>
          <Toolbar mind={mind} />
        </div>
      </div>
    </Modal>
  );
};
