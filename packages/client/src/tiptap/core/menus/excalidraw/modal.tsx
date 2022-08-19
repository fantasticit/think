import { Modal, Spin, Typography } from '@douyinfe/semi-ui';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useState } from 'react';
import { Editor } from 'tiptap/core';

import { cancelSubject, OPEN_EXCALIDRAW_SETTING_MODAL, subject } from '../_event';

type IProps = { editor: Editor };

const { Text } = Typography;

export const ExcalidrawSettingModal: React.FC<IProps> = ({ editor }) => {
  const [Excalidraw, setExcalidraw] = useState(null);
  const [data, setData] = useState({});
  const [initialData, setInitialData] = useState({ elements: [], appState: { isLoading: false }, files: null });
  const [visible, toggleVisible] = useToggle(false);
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState(null);

  const renderEditor = useCallback(
    (div) => {
      if (!div) return;

      import('@excalidraw/excalidraw')
        .then((res) => {
          setExcalidraw(res.Excalidraw);
        })
        .catch(setError)
        .finally(() => toggleLoading(false));
    },
    [toggleLoading]
  );

  const renderExcalidraw = useCallback((app) => {
    setTimeout(() => {
      app.refresh();
    });
  }, []);

  const onChange = useCallback((elements, appState, files) => {
    // excalidraw 导出的是 {}，实际上应该是 []
    // appState.collaborators = [];
    setData({
      elements,
      appState: { isLoading: false },
      files,
    });
  }, []);

  const save = useCallback(() => {
    if (!Excalidraw) {
      toggleVisible(false);
      return;
    }

    /**
     * FIXME: 绘图更新后会滚动 dom 到顶点，原因未知，在此 hack 修复下！
     */
    const currentScrollTop = document.querySelector('main#js-tocs-container')?.scrollTop;
    editor.chain().focus().setExcalidraw({ data }).run();
    setTimeout(() => {
      document.querySelector('main#js-tocs-container').scrollTop = currentScrollTop;
    });
    toggleVisible(false);
  }, [Excalidraw, editor, data, toggleVisible]);

  useEffect(() => {
    const handler = (data) => {
      toggleVisible(true);
      data && setInitialData(data.data);
    };

    subject(editor, OPEN_EXCALIDRAW_SETTING_MODAL, handler);

    return () => {
      cancelSubject(editor, OPEN_EXCALIDRAW_SETTING_MODAL, handler);
    };
  }, [editor, toggleVisible]);

  return (
    <Modal
      centered
      title="绘图"
      fullScreen
      visible={visible}
      onCancel={toggleVisible}
      onOk={save}
      okText="保存"
      cancelText="退出"
      motion={false}
    >
      <div style={{ height: '100%', margin: '0 -24px', border: '1px solid var(--semi-color-border)' }}>
        {loading && (
          <Spin spinning>
            {/* FIXME: semi-design 的问题，不加 div，文字会换行! */}
            <div></div>
          </Spin>
        )}
        {error && <Text>{(error && error.message) || '未知错误'}</Text>}
        <div style={{ width: '100%', height: '100%' }} ref={renderEditor}>
          {!loading && !error && Excalidraw ? (
            <Excalidraw ref={renderExcalidraw} onChange={onChange} langCode="zh-CN" initialData={initialData} />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};
