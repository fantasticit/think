import { Banner, Input, Popconfirm, Select, Space } from '@douyinfe/semi-ui';
import { AuthEnum, AuthEnumArray } from '@think/domains';
import React, { useCallback, useState } from 'react';

interface IProps {
  onOk: (arg) => any;
}

export const AddUser: React.FC<IProps> = ({ onOk, children }) => {
  const [userAuth, setUserAuth] = useState(AuthEnum.noAccess);
  const [userName, setUserName] = useState('');

  const handleOk = useCallback(() => {
    onOk({ userName, userAuth }).then(() => {
      setUserAuth(AuthEnum.noAccess);
      setUserName('');
    });
  }, [onOk, userName, userAuth]);

  return (
    <Popconfirm
      showArrow
      zIndex={1070}
      title={'添加成员'}
      okText={'邀请对方'}
      style={{ maxWidth: '96vw', width: 380 }}
      onConfirm={handleOk}
      okButtonProps={{
        disabled: !userName,
      }}
      content={
        <div style={{ margin: '16px -68px 0 0' }}>
          {[AuthEnum.creator, AuthEnum.admin].includes(userAuth) ? (
            <Banner style={{ marginBottom: 16 }} type="warning" description="请谨慎操作管理员权限！" />
          ) : null}
          <Space>
            <Select value={userAuth} onChange={setUserAuth} style={{ width: 120 }} zIndex={1080}>
              {AuthEnumArray.map((wikiStatus) => {
                return (
                  <Select.Option key={wikiStatus.value} value={wikiStatus.value}>
                    {wikiStatus.label}
                  </Select.Option>
                );
              })}
            </Select>
            <Input
              autofocus
              placeholder="输入对方用户名"
              value={userName}
              onChange={setUserName}
              style={{ width: 160 }}
            ></Input>
          </Space>
        </div>
      }
    >
      {children}
    </Popconfirm>
  );
};
