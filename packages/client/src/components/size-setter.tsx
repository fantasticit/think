import { Button, Dropdown, Form } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { useCallback, useRef } from 'react';

type ISize = { width: number | string; height: number | string };

interface IProps {
  width: number | string;
  maxWidth?: number | string;
  height: number | string;
  onOk: (arg: ISize) => void;
}

const containerStyle = { padding: '0 12px 12px' };
const inlineBlockStyle = { display: 'inline-block' };

export const SizeSetter: React.FC<IProps> = ({ width, maxWidth, height, onOk, children }) => {
  const $form = useRef<FormApi>();

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      onOk(values as ISize);
    });
  }, [onOk]);

  return (
    <Dropdown
      zIndex={10000}
      trigger="click"
      position={'bottomLeft'}
      spacing={10}
      render={
        <div style={containerStyle}>
          <Form initValues={{ width, height }} getFormApi={(formApi) => ($form.current = formApi)} labelPosition="left">
            <Form.Input autofocus label="宽" field="width" {...(maxWidth ? { max: maxWidth } : {})} />
            <Form.Input label="高" field="height" />
          </Form>
          <Button size="small" type="primary" theme="solid" htmlType="submit" onClick={handleOk}>
            设置
          </Button>
        </div>
      }
    >
      <span style={inlineBlockStyle}>{children}</span>
    </Dropdown>
  );
};
