import { Form, Modal } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from 'tiptap/core';
import { isValidURL } from 'tiptap/prose-utils';

import { cancelSubject, OPEN_LINK_SETTING_MODAL, subject } from '../_event';

type IProps = { editor: Editor };

export const LinkSettingModal: React.FC<IProps> = ({ editor }) => {
  const $form = useRef<FormApi>();
  const [initialState, setInitialState] = useState({ text: '', href: '', from: -1, to: -1 });
  const [visible, toggleVisible] = useToggle(false);

  const handleCancel = useCallback(() => toggleVisible(false), [toggleVisible]);

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      if (!values.text) {
        values.text = values.href;
      }

      const { from, to } = initialState;
      const { view } = editor;
      const schema = view.state.schema;
      const node = schema.text(values.text, [schema.marks.link.create({ href: values.href })]);

      view.dispatch(view.state.tr.deleteRange(from, to));
      view.dispatch(view.state.tr.insert(from, node));
      view.dispatch(view.state.tr.scrollIntoView());
      toggleVisible(false);
    });
  }, [initialState, editor, toggleVisible]);

  useEffect(() => {
    const handler = (data) => {
      toggleVisible(true);
      data && setInitialState(data);
    };

    subject(editor, OPEN_LINK_SETTING_MODAL, handler);

    return () => {
      cancelSubject(editor, OPEN_LINK_SETTING_MODAL, handler);
    };
  }, [editor, toggleVisible]);

  return (
    <Modal
      title="编辑链接"
      style={{ maxWidth: '96vw' }}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
    >
      <Form initValues={initialState} getFormApi={(formApi) => ($form.current = formApi)} labelPosition="left">
        <Form.Input label="文本" field="text" placeholder="请输入文本"></Form.Input>
        <Form.Input
          autofocus
          label="链接"
          field="href"
          placeholder="请输入外链地址"
          rules={[{ validator: (_, value) => isValidURL(value), message: '请输入有效链接' }]}
        ></Form.Input>
      </Form>
    </Modal>
  );
};
