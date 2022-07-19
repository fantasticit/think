import { Banner, Button, Form, Toast } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { useSystemConfig } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback } from 'react';

export const Mail = () => {
  const { data, loading, error, sendTestEmail, updateSystemConfig } = useSystemConfig();
  const [changed, toggleChanged] = useToggle(false);

  const onFormChange = useCallback(() => {
    toggleChanged(true);
  }, [toggleChanged]);

  const onFinish = useCallback(
    (values) => {
      updateSystemConfig(values).then(() => {
        Toast.success('操作成功');
      });
    },
    [updateSystemConfig]
  );

  return (
    <DataRender
      loading={loading}
      error={error}
      normalContent={() => (
        <div style={{ marginTop: 16 }}>
          <Banner
            type="warning"
            description="配置邮箱服务后，请测试是否正确，否则可能导致无法注册用户，找回密码！"
            closeIcon={null}
          />

          <Form initValues={data} onChange={onFormChange} onSubmit={onFinish}>
            <Form.Input
              field="emailServiceHost"
              label="邮件服务地址"
              style={{ width: '100%' }}
              placeholder="输入邮件服务地址"
              rules={[{ required: true, message: '请输入邮件服务地址' }]}
            />

            <Form.Input
              field="emailServicePort"
              label="邮件服务端口"
              style={{ width: '100%' }}
              placeholder="输入邮件服务端口"
              rules={[{ required: true, message: '请输入邮件服务端口' }]}
            />

            <Form.Input
              field="emailServiceUser"
              label="邮件服务用户"
              style={{ width: '100%' }}
              placeholder="输入邮件服务用户名"
              rules={[{ required: true, message: '请输入邮件服务用户名' }]}
            />

            <Form.Input
              field="emailServicePassword"
              label="邮件服务密码"
              style={{ width: '100%' }}
              placeholder="输入邮件服务密码"
              rules={[{ required: true, message: '请输入邮件服务密码' }]}
            />

            <Button
              htmlType="submit"
              type="primary"
              theme="solid"
              disabled={!changed}
              loading={loading}
              style={{ margin: '16px 0' }}
            >
              保存
            </Button>

            <Button style={{ margin: '16px' }} onClick={sendTestEmail}>
              测试
            </Button>
          </Form>
        </div>
      )}
    />
  );
};
