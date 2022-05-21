import { IconLink } from '@douyinfe/semi-icons';
import { Button, Dropdown, Form, Tooltip } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { useCallback, useEffect, useRef, useState } from 'react';

export const Link = ({ disabled, link, setLink }) => {
  const $form = useRef<FormApi>();
  const [initialState, setInitialState] = useState({ link });

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      setLink(values.link);
    });
  }, [setLink]);

  useEffect(() => {
    setInitialState({ link });
  }, [link]);

  return (
    <Dropdown
      stopPropagation
      zIndex={10000}
      trigger="click"
      position={'bottomLeft'}
      render={
        <div style={{ padding: 12 }}>
          <Form
            initValues={initialState}
            getFormApi={(formApi) => ($form.current = formApi)}
            labelPosition="left"
            onSubmit={handleOk}
            layout="horizontal"
          >
            <Form.Input autofocus label="链接" field="link" placeholder="请输入外链地址" />
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form>
        </div>
      }
    >
      <span style={{ display: 'inline-block' }}>
        <Tooltip content="设置链接" zIndex={10000}>
          <Button disabled={disabled} type="tertiary" theme={link ? 'light' : 'borderless'} icon={<IconLink />} />
        </Tooltip>
      </span>
    </Dropdown>
  );
};
