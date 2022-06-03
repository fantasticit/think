import { Form, Modal } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from 'tiptap/core';

import { cancelSubject, OPEN_COUNT_SETTING_MODAL, subject } from '../_event';

type IProps = { editor: Editor };

export const CountdownSettingModal: React.FC<IProps> = ({ editor }) => {
  const $form = useRef<FormApi>();
  const [initialState, setInitialState] = useState({ title: '倒计时⏰', date: Date.now() });
  const [visible, toggleVisible] = useToggle(false);

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      editor.chain().focus().setCountdown({ title: values.title, date: values.date.valueOf() }).run();
      toggleVisible(false);
    });
  }, [editor, toggleVisible]);

  useEffect(() => {
    const handler = (data) => {
      toggleVisible(true);
      data && setInitialState(data);
    };

    subject(editor, OPEN_COUNT_SETTING_MODAL, handler);

    return () => {
      cancelSubject(editor, OPEN_COUNT_SETTING_MODAL, handler);
    };
  }, [editor, toggleVisible]);

  return (
    <Modal
      centered
      title="倒计时"
      style={{ maxWidth: '96vw' }}
      visible={visible}
      onOk={handleOk}
      onCancel={() => toggleVisible(false)}
    >
      <Form initValues={initialState} getFormApi={(formApi) => ($form.current = formApi)} labelPosition="left">
        <Form.Input labelWidth={72} label="标题" field="title" required />
        <Form.DatePicker labelWidth={72} style={{ width: '100%' }} label="截止日期" field="date" type="dateTime" />
      </Form>
    </Modal>
  );
};
