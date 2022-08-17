import { IconHelpCircle } from '@douyinfe/semi-icons';
import { Banner, Button, Form, Toast, Tooltip } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { useSystemConfig } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback } from 'react';

export const System = () => {
  const { data, loading, error, updateSystemConfig } = useSystemConfig();
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
          <Form labelPosition="left" initValues={data} onChange={onFormChange} onSubmit={onFinish}>
            <Form.Switch
              field="isSystemLocked"
              label={{
                text: '系统锁定',
                extra: (
                  <Tooltip content="系统锁定后，除系统管理员外均不可登录，谨慎修改！">
                    <IconHelpCircle style={{ color: '--semi-color-text-1' }} />
                  </Tooltip>
                ),
              }}
            />
            <Form.Switch
              field="enableEmailVerify"
              label={{
                text: '邮箱检验',
                extra: (
                  <Tooltip content="开启邮箱检验后，用户注册、密码等操作必须通过邮箱验证">
                    <IconHelpCircle style={{ color: '--semi-color-text-1' }} />
                  </Tooltip>
                ),
              }}
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
          </Form>
        </div>
      )}
    />
  );
};
