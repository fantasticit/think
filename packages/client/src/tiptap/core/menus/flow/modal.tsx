import { Modal, Spin, Typography } from '@douyinfe/semi-ui';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createEditor, load } from 'thirtypart/diagram';
import { Editor } from 'tiptap/core';

import { cancelSubject, OPEN_FLOW_SETTING_MODAL, subject } from '../_event';

type IProps = { editor: Editor };

const { Text } = Typography;

export const FlowSettingModal: React.FC<IProps> = ({ editor }) => {
  const $editor = useRef(null);
  const [initialData, setInitialData] = useState('');
  const [visible, toggleVisible] = useToggle(false);
  const [loading, toggleLoading] = useToggle(true);
  const [error, setError] = useState(null);

  const renderEditor = useCallback(
    (div) => {
      if (!div) return;

      load()
        .then(() => {
          const editor = createEditor(div);
          $editor.current = editor;
          editor.setXml(initialData);
        })
        .catch(setError)
        .finally(() => toggleLoading(false));
    },
    [toggleLoading, initialData]
  );

  const save = useCallback(() => {
    if (!$editor.current) {
      toggleVisible(false);
      return;
    }

    const data = $editor.current?.getXml();
    editor.chain().focus().setFlow({ data }).run();
    toggleVisible(false);
  }, [editor, toggleVisible]);

  useEffect(() => {
    const handler = (data) => {
      toggleVisible(true);
      data && setInitialData(data.data);
    };

    subject(editor, OPEN_FLOW_SETTING_MODAL, handler);

    return () => {
      cancelSubject(editor, OPEN_FLOW_SETTING_MODAL, handler);
    };
  }, [editor, toggleVisible]);

  return (
    <Modal
      centered
      title="流程图"
      fullScreen
      visible={visible}
      onCancel={toggleVisible}
      onOk={save}
      okText="保存"
      cancelText="退出"
    >
      <div style={{ height: '100%', margin: '0 -24px', border: '1px solid var(--semi-color-border)' }}>
        {loading && (
          <Spin spinning>
            {/* FIXME: semi-design 的问题，不加 div，文字会换行! */}
            <div></div>
          </Spin>
        )}
        {error && <Text>{(error && error.message) || '未知错误'}</Text>}
        <div className="geEditor" ref={renderEditor}></div>
      </div>
    </Modal>
  );
};
