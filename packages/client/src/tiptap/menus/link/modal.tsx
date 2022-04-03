import { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Modal } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { Editor } from '@tiptap/core';
import { useToggle } from 'hooks/use-toggle';
import { isValidURL } from '../../services/valid-url';
import { event, OPEN_LINK_SETTING_MODAL } from '../_event';

type IProps = { editor: Editor };

export const LinkSettingModal: React.FC<IProps> = ({ editor }) => {
  const $form = useRef<FormApi>();
  const [initialState, setInitialState] = useState({ text: '', href: '', from: -1, to: -1 });
  const [visible, toggleVisible] = useToggle(false);

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      if (!values.text) {
        values.text = values.href;
      }

      const { from, to } = initialState;
      const { view } = editor;
      const schema = view.state.schema;
      const node = schema.text(values.text, [schema.marks.link.create({ href: values.href })]);
      view.dispatch(view.state.tr.replaceRangeWith(from, to, node));
      view.dispatch(view.state.tr.scrollIntoView());
      toggleVisible(false);
    });
  }, [initialState]);

  useEffect(() => {
    const handler = (data) => {
      toggleVisible(true);
      data && setInitialState(data);
    };

    event.on(OPEN_LINK_SETTING_MODAL, handler);

    return () => {
      event.off(OPEN_LINK_SETTING_MODAL, handler);
    };
  }, [editor]);

  return (
    <Modal title="编辑链接" visible={visible} onOk={handleOk} onCancel={() => toggleVisible(false)} centered>
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
