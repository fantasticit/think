import { useEffect, useRef, useState } from 'react';
import { Modal } from '@douyinfe/semi-ui';
import { Editor } from 'tiptap/editor';
import { useToggle } from 'hooks/use-toggle';
import { Theme, useTheme } from 'hooks/use-theme';
import { OPEN_FLOW_SETTING_MODAL, subject, cancelSubject } from '../_event';

type IProps = { editor: Editor };

export const FlowSettingModal: React.FC<IProps> = ({ editor }) => {
  const { theme } = useTheme();
  const $iframe = useRef<HTMLIFrameElement>();
  const [initialData, setInitialData] = useState('');
  const [visible, toggleVisible] = useToggle(false);

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

  useEffect(() => {
    const receiver = (evt) => {
      if (!evt.data) {
        toggleVisible(false);
        return;
      }

      if (evt.data == 'ready') {
        $iframe.current && $iframe.current.contentWindow.postMessage(initialData, '*');
      } else {
        if (evt.data.length > 0) {
          const data = evt.data;
          editor.chain().focus().setFlow({ data }).run();
        }
      }
    };

    window.addEventListener('message', receiver);

    return () => {
      window.removeEventListener('message', receiver);
    };
  }, [editor, toggleVisible, initialData]);

  return (
    <Modal centered title="流程图" fullScreen visible={visible} header={null} footer={null}>
      <div style={{ height: '100%', margin: '0 -24px' }}>
        <iframe
          ref={$iframe}
          src={`${process.env.DRAWIO_URL}?embed=1&ui=${
            theme === Theme.dark ? 'dark' : 'atlas'
          }&lang=zh&hide-pages=1&drafts=0&client=1&spin=1&grid=1`}
          style={{ width: '100%', height: '100%' }}
          frameBorder={0}
        ></iframe>
      </div>
    </Modal>
  );
};
