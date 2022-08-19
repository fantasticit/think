import { IconImage } from '@douyinfe/semi-icons';
import { Button, Dropdown, Form, Tooltip } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { Upload } from 'components/upload';
import { useCallback, useEffect, useRef, useState } from 'react';

export const Image = ({ disabled, image, setImage }) => {
  const $form = useRef<FormApi>();
  const [initialState, setInitialState] = useState({ image });

  const setImageUrl = useCallback((url) => {
    $form.current.setValue('image', url);
  }, []);

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      setImage(values.image);
    });
  }, [setImage]);

  useEffect(() => {
    setInitialState({ image });
  }, [image]);

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
            <Form.Input autofocus label="图片" field="image" placeholder="请输入图片地址" />
            <Upload onOK={setImageUrl} />
            <Button type="primary" htmlType="submit" style={{ marginLeft: 12 }}>
              保存
            </Button>
          </Form>
        </div>
      }
    >
      <span style={{ display: 'inline-block' }}>
        <Tooltip content="设置图片" zIndex={10000}>
          <Button disabled={disabled} type="tertiary" theme={image ? 'light' : 'borderless'} icon={<IconImage />} />
        </Tooltip>
      </span>
    </Dropdown>
  );
};
